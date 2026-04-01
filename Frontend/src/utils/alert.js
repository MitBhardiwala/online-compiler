export const showAlert = (message, type = "error") => {
    const alertDiv = document.createElement("div");
    alertDiv.className = `fixed top-4 right-4 ${type === "error" ? "bg-red-500" :
            type === "success" ? "bg-green-500" :
                "bg-yellow-500"
        } text-white px-4 py-2 rounded shadow-lg transform transition-transform duration-300 flex items-center z-50`;
    alertDiv.style.transform = "translateX(100%)";
    alertDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        ${message}
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
        alertDiv.style.transform = "translateX(100%)";
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 3000);
};