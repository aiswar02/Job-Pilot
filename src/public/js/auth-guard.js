(function () {
    const publicPages = ["/login", "/register"];

    const currentPage = window.location.pathname;

    const accessToken = localStorage.getItem("accessToken");

    // If user is not logged in
    if (!accessToken && !publicPages.includes(currentPage)) {
        window.location.replace("/login");
        return;
    }

    // If user is already logged in, prevent login/register pages
    if (accessToken && publicPages.includes(currentPage)) {
        window.location.replace("/dashboard");
        return;
    }

    // Prevent browser from restoring protected pages from history
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            const token = localStorage.getItem("accessToken");

            if (!token && !publicPages.includes(window.location.pathname)) {
                window.location.replace("/login");
            }
        }
    });

    // Recheck authentication when browser Back/Forward is used
    window.addEventListener("popstate", function () {
        const token = localStorage.getItem("accessToken");

        if (!token && !publicPages.includes(window.location.pathname)) {
            window.location.replace("/login");
        }
    });
})();