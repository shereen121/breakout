document.addEventListener("DOMContentLoaded", function () {

    // ---------- SIGNUP ----------
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = signupForm.elements["txt"].value.trim();
            const email = signupForm.elements["email"].value.trim();
            const phone = signupForm.elements["broj"].value.trim();
            const password = signupForm.elements["pswd"].value.trim();

            let users = JSON.parse(localStorage.getItem("users")) || [];

            if (users.some(user => user.email === email)) {
                alert("This email is already registered!");
                return;
            }

            const userData = { username, email, phone, password, points: 0, wallet: 0 };

            users.push(userData);
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(userData));

            alert("تم التسجيل بنجاح!");
            window.location.href = "home.html";
        });
    }

    // ---------- LOGIN ----------
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = loginForm.elements["email"].value.trim();
            const password = loginForm.elements["pswd"].value.trim();

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const storedUser = users.find(u => u.email === email && u.password === password);

            if (storedUser) {
                storedUser.wallet = storedUser.wallet || 0;
                storedUser.points = storedUser.points || 0;
                localStorage.setItem("currentUser", JSON.stringify(storedUser));
                window.location.href = "home.html";
            } else {
                alert("Email or password incorrect.");
            }
        });
    }

    // ---------- DISPLAY USER ON ALL PAGES ----------
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        // لو مفيش مستخدم مسجل، ارجع للـ login
        if (window.location.pathname.includes("home.html") || window.location.pathname.includes("/hot/") || window.location.pathname.includes("/cold/")) {
            // عدّل المسار حسب مكان breakout.html
            window.location.href = "../breakout.html";
        }
        return;
    }

    const userNameEl = document.getElementById("user-name");
    const userPointsEl = document.getElementById("user-points");
    const userBalanceEl = document.getElementById("user-balance");

    if (userNameEl) userNameEl.textContent = "User: " + currentUser.username;
    if (userPointsEl) userPointsEl.textContent = "Points: " + currentUser.points;
    if (userBalanceEl) userBalanceEl.textContent = "Wallet: " + currentUser.wallet + " EGP";
});
