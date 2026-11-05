(async function () {
    const publicPages = ["/login", "/register"];
    const currentPage = window.location.pathname;

    // Allow login and register pages
    if (publicPages.includes(currentPage)) {
        return;
    }

    const accessToken = localStorage.getItem("accessToken");

    // No token: redirect to login
    if (!accessToken) {
        localStorage.removeItem("refreshToken");
        window.location.replace("/login");
        return;
    }

    // Verify token with backend
    try {
        const response = await fetch(
            "https://job-pilot-1-czpi.onrender.com/api/profile",
            {
                method: "GET",
                headers: {
                    Authorization: Bearer `${accessToken}`
                },
                cache: "no-store"
            }
        );

        if (!response.ok) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            window.location.replace("/login");
            return;
        }

    } catch (error) {
        console.error("Authentication check failed:", error);
    }

    // Check authentication when returning through browser history
    window.addEventListener("pageshow", async function () {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            window.location.replace("/login");
            return;
        }

        try {
            const response = await fetch(
                "https://job-pilot-1-czpi.onrender.com/api/profile",
                {
                    headers: {
                        Authorization: Bearer `${token}`
                    },
                    cache: "no-store"
                }
            );

            if (!response.ok) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.replace("/login");
            }

        } catch (error) {
            console.error("Authentication check failed:", error);
        }
    });
})()