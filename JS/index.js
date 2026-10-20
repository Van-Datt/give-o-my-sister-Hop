
/* =========================================
   WEBSITE CHÚC MỪNG NGÀY 20/10
   Hiệu ứng trái tim rơi liên tục
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Lấy các phần tử HTML
    const heartContainer = document.getElementById("heartContainer");
    const envelope = document.getElementById("envelope");
    const openButton = document.getElementById("openButton");

    const passwordOverlay = document.getElementById("passwordOverlay");
    const passwordForm = document.getElementById("passwordForm");
    const passwordInput = document.getElementById("passwordInput");
    const passwordError = document.getElementById("passwordError");
    const cancelPassword = document.getElementById("cancelPassword");

    const letterModal = document.getElementById("letterModal");
    const closeLetter = document.getElementById("closeLetter");
    const letterDone = document.getElementById("letterDone");

    const bgMusic = document.getElementById("bgMusic");

    // Đổi mật khẩu tại đây nếu cần
    const CORRECT_PASSWORD = "0308";

    let isVerified = false;
    let heartInterval = null;
    let currentFocusBeforeModal = null;

    /* =====================================
       1. TRÁI TIM RƠI LIÊN TỤC
    ===================================== */

    const heartSymbols = ["♥", "♡", "❤", "💕", "💗", "💖"];

    function createHeart() {
        if (!heartContainer) return;

        const heart = document.createElement("span");
        heart.className = "falling-heart";

        heart.textContent =
            heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

        // Vị trí ngang ngẫu nhiên
        heart.style.left = Math.random() * 100 + "vw";

        // Kích thước từ 12px đến 34px
        const size = 12 + Math.random() * 22;
        heart.style.fontSize = size + "px";

        // Thời gian rơi từ 4 đến 9 giây
        const duration = 4 + Math.random() * 5;
        heart.style.animationDuration = duration + "s";

        // Trôi ngang và xoay ngẫu nhiên
        const drift = Math.random() * 160 - 80;
        const rotation = Math.random() * 720 - 360;

        heart.style.setProperty("--drift", drift + "px");
        heart.style.setProperty("--rotation", rotation + "deg");

        heartContainer.appendChild(heart);

        // Dọn phần tử sau khi animation hoàn tất
        setTimeout(() => {
            heart.remove();
        }, duration * 1000 + 200);
    }

    function startHearts() {
        // Tránh tạo nhiều interval nếu hàm được gọi lại
        if (heartInterval !== null) return;

        createHeart();

        // Cứ 120ms tạo một trái tim mới
        heartInterval = setInterval(createHeart, 120);
    }

    // Bắt đầu ngay khi trang tải xong và tiếp tục khi trang mở
    startHearts();

    /* =====================================
       2. HIỆU ỨNG TRÁI TIM BAY
    ===================================== */

    function burstHearts() {
        if (!envelope) return;

        const rect = envelope.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 45; i++) {
            const heart = document.createElement("span");
            heart.className = "burst-heart";
            heart.textContent =
                heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

            heart.style.left = centerX + "px";
            heart.style.top = centerY + "px";
            heart.style.fontSize = 12 + Math.random() * 20 + "px";

            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 180;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance - 50;
            const rotation = Math.random() * 360 - 180;

            heart.style.setProperty("--burst-x", x + "px");
            heart.style.setProperty("--burst-y", y + "px");
            heart.style.setProperty("--burst-rotation", rotation + "deg");

            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 1700);
        }
    }

    /* =====================================
       3. NHẠC NỀN
    ===================================== */

    function playMusic() {
        if (!bgMusic) return;

        bgMusic.volume = 0.35;

        const playPromise = bgMusic.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
                // Trình duyệt có thể chặn nhạc nếu chưa có tương tác.
                // Người dùng có thể thêm file nhạc hợp lệ vào assets/nhac.mp3.
            });
        }
    }

    /* =====================================
       4. HỘP NHẬP MẬT KHẨU
    ===================================== */

    function showPasswordBox() {
        if (!passwordOverlay) return;

        currentFocusBeforeModal = document.activeElement;

        passwordOverlay.classList.add("show");
        passwordOverlay.setAttribute("aria-hidden", "false");

        if (passwordError) {
            passwordError.textContent = "";
        }

        if (passwordInput) {
            passwordInput.value = "";
            setTimeout(() => passwordInput.focus(), 100);
        }
    }

    function hidePasswordBox() {
        if (!passwordOverlay) return;

        passwordOverlay.classList.remove("show");
        passwordOverlay.setAttribute("aria-hidden", "true");

        if (openButton) {
            openButton.focus();
        }
    }

    /* =====================================
       5. MỞ VÀ ĐÓNG BỨC THƯ
    ===================================== */

    function revealLetter() {
        if (envelope) {
            envelope.classList.add("opened");
        }

        burstHearts();
        playMusic();

        setTimeout(() => {
            if (letterModal) {
                letterModal.classList.add("show");
                letterModal.setAttribute("aria-hidden", "false");

                if (closeLetter) {
                    closeLetter.focus();
                }
            }
        }, 450);
    }

    function openLetter() {
        if (isVerified) {
            revealLetter();
        } else {
            showPasswordBox();
        }
    }

    function hideLetter() {
        if (!letterModal) return;

        letterModal.classList.remove("show");
        letterModal.setAttribute("aria-hidden", "true");

        if (openButton) {
            openButton.focus();
        }
    }

    /* =====================================
       6. XỬ LÝ SỰ KIỆN
    ===================================== */

    if (openButton) {
        openButton.addEventListener("click", openLetter);
    }

    if (envelope) {
        envelope.addEventListener("click", openLetter);
    }

    if (passwordForm) {
        passwordForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const enteredPassword = passwordInput.value.trim();

            if (enteredPassword === CORRECT_PASSWORD) {
                isVerified = true;

                if (passwordError) {
                    passwordError.textContent = "";
                }

                hidePasswordBox();
                revealLetter();
            } else {
                if (passwordError) {
                    passwordError.textContent =
                        "Mật khẩu chưa đúng, thử lại nhé 💗";
                }

                if (passwordInput) {
                    passwordInput.value = "";
                    passwordInput.focus();
                    passwordInput.classList.remove("shake");

                    // Khởi động lại hiệu ứng rung
                    void passwordInput.offsetWidth;
                    passwordInput.classList.add("shake");

                    setTimeout(() => {
                        passwordInput.classList.remove("shake");
                    }, 400);
                }
            }
        });
    }

    if (cancelPassword) {
        cancelPassword.addEventListener("click", hidePasswordBox);
    }

    if (closeLetter) {
        closeLetter.addEventListener("click", hideLetter);
    }

    if (letterDone) {
        letterDone.addEventListener("click", hideLetter);
    }

    // Bấm ra ngoài hộp thoại để đóng
    if (passwordOverlay) {
        passwordOverlay.addEventListener("click", (event) => {
            if (event.target === passwordOverlay) {
                hidePasswordBox();
            }
        });
    }

    if (letterModal) {
        letterModal.addEventListener("click", (event) => {
            if (event.target === letterModal) {
                hideLetter();
            }
        });
    }

    // Nhấn Escape để đóng hộp thoại
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;

        if (letterModal && letterModal.classList.contains("show")) {
            hideLetter();
        } else if (
            passwordOverlay &&
            passwordOverlay.classList.contains("show")
        ) {
            hidePasswordBox();
        }
    });
});
