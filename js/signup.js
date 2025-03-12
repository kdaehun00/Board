document.addEventListener("DOMContentLoaded", function () {
    const profileImgInput = document.getElementById("profile-img");
    const profilePreview = document.getElementById("profile-preview");

    // 이미지 미리보기 기능 (선택한 파일을 브라우저에서 보여줌)
    profileImgInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const objectURL = URL.createObjectURL(file); // 브라우저에서 접근 가능한 URL 생성
            profilePreview.src = objectURL; // 미리보기 설정
            profileImgInput.dataset.path = objectURL; // 파일 경로를 data-path 속성에 저장
        }
    });

    // 미리보기 클릭 시 초기화 (기본 이미지로 변경)
    profilePreview.addEventListener("click", function () {
        profileImgInput.value = "";
        profilePreview.src = "../images/default-profile.png";
        profileImgInput.dataset.path = ""; // 저장된 이미지 경로 제거
    });

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const nicknameInput = document.getElementById("nickname");
    const signupButton = document.getElementById("signup-btn");
    const loginLink = document.querySelector(".login-link");

    // 이메일 유효성 검사
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // 비밀번호 유효성 검사
    function isValidPassword(password) {
        return password.length >= 8 && password.length <= 20;
    }

    // 닉네임 유효성 검사
    function isValidNickname(nickname) {
        return nickname.length <= 10 && !nickname.includes(" ");
    }

    function validateForm() {
        let isValid = true;

        // 이메일 검사
        if (!isValidEmail(emailInput.value)) {
            document.getElementById("email-helper").textContent = "* 올바른 이메일 주소를 입력하세요.";
            isValid = false;
        } else {
            document.getElementById("email-helper").textContent = "";
        }

        // 비밀번호 검사
        if (!isValidPassword(passwordInput.value)) {
            document.getElementById("password-helper").textContent = "* 비밀번호는 8~20자 사이여야 합니다.";
            isValid = false;
        } else {
            document.getElementById("password-helper").textContent = "";
        }

        // 비밀번호 확인 검사
        if (confirmPasswordInput.value !== passwordInput.value) {
            document.getElementById("confirm-password-helper").textContent = "* 비밀번호가 일치하지 않습니다.";
            isValid = false;
        } else {
            document.getElementById("confirm-password-helper").textContent = "";
        }

        // 닉네임 검사
        if (!isValidNickname(nicknameInput.value)) {
            document.getElementById("nickname-helper").textContent = "* 닉네임은 10자 이하, 공백 불가.";
            isValid = false;
        } else {
            document.getElementById("nickname-helper").textContent = "";
        }

        // 회원가입 버튼 활성화
        signupButton.disabled = !isValid;
        signupButton.classList.toggle("active", isValid);
    }

    // 입력 이벤트 리스너 추가
    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);
    confirmPasswordInput.addEventListener("input", validateForm);
    nicknameInput.addEventListener("input", validateForm);

    // 회원가입 버튼 클릭 이벤트 (JSON 데이터 전송)
    signupButton.addEventListener("click", async function () {
        const email = emailInput.value;
        const password = passwordInput.value;
        const nickname = nicknameInput.value;

        try {
            const response = await fetch("http://localhost:8080/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, nickname})
            });

            if (!response.ok) {
                throw new Error("서버 응답 오류");
            }

            const data = await response.json();
            if (data.success) {
                alert(data.message);
                window.location.href = "login.html";
            } else {
                alert("회원가입에 실패했습니다!");
            }
        } catch (error) {
            alert("서버 연결에 실패했습니다.");
        }
    });

    // 로그인 페이지로 이동
    loginLink.addEventListener("click", function () {
        window.location.href = "login.html";
    });
});
