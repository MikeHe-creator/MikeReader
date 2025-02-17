import { useEffect } from "react";

export default function EPUBmenu({ EPUBmenusucai, setOuthref }) {
    const { bookname, toc = [] } = EPUBmenusucai || {}; // 解构并提供默认值
    let hrefs=[];
    let titles=[];
    if(toc){
        toc.forEach((item) => {
            hrefs.push(item.href);
            titles.push(item.title);
        })
    }

    useEffect(() => {
        if (!bookname || !toc) return;
        // 获取父容器 epubmulu
        const EPUBmulu = document.getElementById("epubmulu");
        let EPUBmenuDiv = document.getElementById(`epubMulu_${bookname}`);
        if (!EPUBmenuDiv) {
            Array.from(EPUBmulu.children).forEach(menu => {menu.style.display = "none";});
            EPUBmenuDiv = document.createElement("div");
            EPUBmenuDiv.id = `EPUBMulu_${bookname}`;
            EPUBmulu.appendChild(EPUBmenuDiv);
        }else{
            Array.from(EPUBmulu.children).forEach(menu => {menu.style.display = "none";});
            EPUBmenuDiv.style.display = "block";
        }

        const parsedMenu = parseMenu(titles);
        renderMenu(EPUBmenuDiv, parsedMenu);
    }, [bookname, toc]);

    const parseMenu = (titles) => {
        const result = [];
        const stack = [];

        titles.forEach((line) => {
            const trimmed = line.trim();
            const level = line.match(/^\s*/)[0].length / 2;
            const newEntry = { title: trimmed, subItems: [], isExpanded: false, level: level };
            while (stack.length && stack[stack.length - 1].level >= level) {
                stack.pop();
            }
            if (stack.length > 0) {
                stack[stack.length - 1].subItems.push(newEntry);
            } else {
                result.push(newEntry);
            }
            stack.push(newEntry);
        });
        return result;
    };

    // 渲染菜单的函数
    const renderMenu = (container, menuItems) => {
        menuItems.forEach((item) => {
            const menuItemElement = createMenuItemElement(item);
            container.appendChild(menuItemElement);
        });
    };

    const createMenuItemElement = (item) => {
        //const itemMap={};

        const menuItemContainer = document.createElement("div");
        const menuItemTitle = document.createElement("p");
        const cleanTitle = item.title.replace(/(?:-?\s*page:?[\s\d]*\s*)$/i, '').trim();
        menuItemTitle.textContent = `${item.subItems.length > 0 ? (item.isExpanded ? "🔽 " : "▶️ ") : ""}${cleanTitle}`;
        menuItemTitle.className = "cursor-pointer hover:bg-[rgba(92,175,236,0.88)]";
        menuItemTitle.style.marginLeft = `${item.level * 10}px`;
        menuItemTitle.style.cursor = "pointer";
        menuItemTitle.style.borderLeft = "none";

        // 点击事件切换展开状态
        menuItemTitle.onclick = () => {
            const allMenuItems = document.querySelectorAll(".menu-item-title");
            allMenuItems.forEach(item => {
                item.style.borderLeft = "none";
            });
            if (item.subItems.length === 0) {
                menuItemTitle.style.borderLeft = "2px solid #fd923c";
                const titleIndex = titles.findIndex(title => title.includes(cleanTitle));
                const thishref=hrefs[titleIndex];
                setOuthref(thishref);
            }

            // 切换子菜单的显示状态
            item.isExpanded = !item.isExpanded;
            menuItemContainer.querySelectorAll("div").forEach(child => {
                child.style.display = item.isExpanded ? "block" : "none";
            });
            menuItemTitle.textContent = `${item.subItems.length > 0 ? (item.isExpanded ? "🔽 " : "▶️ ") : ""}${cleanTitle}`;
        };
        menuItemTitle.classList.add("menu-item-title");
        menuItemContainer.appendChild(menuItemTitle);

        // 如果有子菜单项，递归创建子菜单
        if (item.subItems.length > 0) {
            const subMenuContainer = document.createElement("div");
            subMenuContainer.style.display = "none";
            item.subItems.forEach((subItem) => {
                const subMenuItemElement = createMenuItemElement(subItem);
                subMenuContainer.appendChild(subMenuItemElement);
            });
            menuItemContainer.appendChild(subMenuContainer);
        }
        return menuItemContainer;
    }

    return (
        <>
            <div id="epubmulu" className="absolute w-full h-[93.5%] overflow-y-auto pr-0"></div>
        </>
    );
}