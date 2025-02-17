import {useEffect} from "react";

export default function PDFmenu({ PDFmuluscai,SetmenuSendout }) {
    const { bookname, pdfmenu } = PDFmuluscai || {};

    useEffect(() => {
        if (!bookname || !pdfmenu) return;

        // 获取父容器 pdfmulu
        const pdfmulu = document.getElementById("pdfmulu");
        let pdfmenuDiv = document.getElementById(`pdfMulu_${bookname}`);
        if (!pdfmenuDiv) {
            Array.from(pdfmulu.children).forEach(menu => {menu.style.display = "none";});
            pdfmenuDiv = document.createElement("div");
            pdfmenuDiv.id = `pdfMulu_${bookname}`;
            pdfmulu.appendChild(pdfmenuDiv);
        }else{
            Array.from(pdfmulu.children).forEach(menu => {menu.style.display = "none";});
            pdfmenuDiv.style.display = "block";
        }

        pdfmenuDiv.style.marginLeft="2%";
        pdfmenuDiv.innerHTML = '';
        // 将 pdfmenu 解析成层级结构的菜单项
        const pdfmenuArray = pdfmenu.split('\n').slice(1, -1);
        const parsedMenu = parseMenu(pdfmenuArray);
        renderMenu(pdfmenuDiv, parsedMenu);

    }, [bookname, pdfmenu]);


    // 解析菜单的函数
    const parseMenu = (pdfmenuArray) => {
        const result = [];
        const stack = [];

        pdfmenuArray.forEach((line) => {
            const trimmed = line.trim();
            const level = line.match(/^\s*/)[0].length / 4;
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

    // 创建单个菜单项元素，支持递归渲染子菜单
    const createMenuItemElement = (item) => {
        const itemMap={};

        const menuItemContainer = document.createElement("div");
        const menuItemTitle = document.createElement("p");
        const cleanTitle = item.title.replace(/(?:-?\s*page:?[\s\d]*\s*)$/i, '').trim();
        menuItemTitle.textContent = `${item.subItems.length > 0 ? (item.isExpanded ? "🔽 " : "▶️ ") : ""}${cleanTitle}`;
        menuItemTitle.className = "cursor-pointer hover:bg-[rgba(92,175,236,0.88)]";
        menuItemTitle.style.marginLeft = `${item.level * 20}px`;
        menuItemTitle.style.cursor = "pointer";
        menuItemTitle.style.borderLeft = "none";

        const pageMatch = item.title.match(/page:?[\s-]*(\d+)/i);
        if (pageMatch && pageMatch[1]) {
            const pageNumber = parseInt(pageMatch[1], 10);
            itemMap[cleanTitle] = pageNumber;
        } else {
            console.warn("页码提取失败，标题为：", item.title);
        }

        // 点击事件切换展开状态
        menuItemTitle.onclick = () => {
            const allMenuItems = document.querySelectorAll(".menu-item-title");
            allMenuItems.forEach(item => {
                item.style.borderLeft = "none";
            });
            if (item.subItems.length === 0) {
                menuItemTitle.style.borderLeft = "2px solid red";
                const itemContent=menuItemTitle.innerText;
                const valueNum=itemMap[itemContent];
                console.log("valueNum",valueNum)
                SetmenuSendout(valueNum);
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
    };


    return (
        <div id="pdfmulu" className="absolute w-full h-[93.5%] overflow-y-auto pr-0"></div>
    );
}