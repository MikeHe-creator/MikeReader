module.exports={
    plugins: [require("tailwind-gradient-mask-image")], //npm install tailwind-gradient-mask-image@latest
    theme: {
        extend: {
          spacing:{
            xs: "0.5rem",
            sm: "0.75rem",
            md: "1rem",
            lg: "1.5rem",
            xl: "2rem",
            "2xl": "3rem",
            "3xl": "4rem",        
           }
        },
    },
}