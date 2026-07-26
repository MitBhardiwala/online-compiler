export const getFileExtension = (language) => {
    const extensions = {
        python: "py",
        javascript: "js",
        cpp: "cpp",
        c: "c",
        go: "go",
        php: "php",
    };
    return extensions[language] || "txt";
}; 