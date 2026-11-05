(function () {
    const publicPages = ["/login", "/register"];
    const currentPage = window.location.pathname;

    // Public pages
    if (publicPages.includes(currentPage)) {

        // Clear authentication when returning to login
        if (currentPage === "/login") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }

        return;
    }

    // Protect all other pages
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        window.location.replace("/login");
        return;
    }

    // Verify token with backend
    fetch("https://job-pilot-1-czpi.onrender.com/api/profile", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        cache: "no-store"
    })
    .then(response => {
        if (!response.ok) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.replace("/login");
        }
    })
    .catch(error => {
        console.error("Authentication error:", error);
    });

})();