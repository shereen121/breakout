// cart.js
import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// التوكن والـ chat ID للبوت
const TELEGRAM_TOKEN = "8260462424:AAHnSEjh9OKxJ-BVHgZUkL7f-ZomyH--Rdo";
const TELEGRAM_CHAT_ID = "8319188377";

document.addEventListener("DOMContentLoaded", function() {
    const cartList = document.getElementById("cart-items");
    const addButtons = document.querySelectorAll(".btn-order");
    const completeBtn = document.getElementById("complete-order");
    const cartCount = document.getElementById("cart-count");

    // تحميل السلة من localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if(!cartCount) return; // لو العنصر مش موجود، نوقف
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.textContent = count;
}

    async function updateUserDisplay() {
        const user = auth.currentUser;
        if(!user) return;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if(userSnap.exists()) {
            const data = userSnap.data();
            document.getElementById("user-name").textContent = "User: " + data.username;
            document.getElementById("user-balance").textContent = "Wallet: " + data.wallet + " EGY";
            document.getElementById("user-points").textContent = "Points: " + data.points;
        }
    }

    auth.onAuthStateChanged(user => {
        if(user) updateUserDisplay();
        else {
            alert("❌ يجب تسجيل الدخول أولاً!");
            window.location.href = "login.html";
        }
    });

    addButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            const card = btn.closest(".card");
            const qty = parseInt(card.querySelector(".qty").value) || 1;
            const flavorEl = card.querySelector(".flavor");
            const flavor = flavorEl.value;
            const price = parseInt(flavorEl.selectedOptions[0].dataset.price) || 0;
            const points = parseInt(flavorEl.selectedOptions[0].dataset.points) || 0;
            const notes = card.querySelector(".notes").value || "";

            if(price <= 0) return alert("اختر نكهة صحيحة");

            const itemName = card.querySelector("h5")?.textContent.trim() || "Item";

            cart.push({ name: itemName, qty, flavor, price, points, notes });
            
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartCount();
        });
    });

    function renderCart() {
        if(!cartList) return;
        cartList.innerHTML = "";
        cart.forEach((item, i) => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - ${item.flavor} x${item.qty} = ${item.price*item.qty} EGY - Points: ${item.points*item.qty}`;

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "X";
            removeBtn.style.marginLeft = "10px";
            removeBtn.style.background = "#CC0000";
            removeBtn.style.color = "white";
            removeBtn.style.border = "none";
            removeBtn.style.borderRadius = "3px";
            removeBtn.style.cursor = "pointer";

            removeBtn.addEventListener("click", () => {
                cart.splice(i, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
                updateCartCount();
            });

            li.appendChild(removeBtn);
            cartList.appendChild(li);
        });
    }

    renderCart();
    updateCartCount();

    if(completeBtn) {
        completeBtn.addEventListener("click", async () => {
            if(cart.length === 0) return alert("العربة فارغة!");
            const user = auth.currentUser;
            if(!user) return alert("❌ يجب تسجيل الدخول أولاً!");

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if(!userSnap.exists()) return alert("مستخدم غير موجود!");

            const data = userSnap.data();
            const totalPrice = cart.reduce((acc, item) => acc + (item.price*item.qty), 0);
            const totalPoints = cart.reduce((acc, item) => acc + (item.points*item.qty), 0);

            if(data.wallet < totalPrice) return alert("رصيد المحفظة غير كافي!");

            await updateDoc(userRef, { wallet: data.wallet - totalPrice, points: data.points + totalPoints });

            const orderDoc = await addDoc(collection(db, "orders"), {
                userId: user.uid,
                username: data.username || user.email,
                items: cart,
                totalPrice,
                totalPoints,
                status: "pending",
                createdAt: serverTimestamp()
            });

            let orderText = `📦 New Order from ${data.username}:\n\n`;
            cart.forEach(item => {
                orderText += ` - ${item.name} (${item.flavor}) x${item.qty}\n  Notes: ${item.notes}\n  Price: ${item.price*item.qty} EGY\n  Points: ${item.points*item.qty}\n\n`;
            });
            orderText += `💰 Total Price: ${totalPrice} EGY\n⭐ Total Points: ${totalPoints}\n🧾 Receipt ID: ${orderDoc.id}`;

            try {
                await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: orderText })
                });
                console.log("Order sent to Telegram ✅");
            } catch(err) {
                console.error("Error sending order to Telegram:", err);
            }

            cart = [];
            localStorage.removeItem("cart");
            renderCart();
            updateCartCount();
            updateUserDisplay();
            alert("✅ تم إتمام الطلب وتم إرسال الأوردر للبوت");
        });
    }
});
