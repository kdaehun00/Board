import { users } from "../data/users.js";

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("userpassword");
    const loginButton = document.getElementById("login-btn");
    
    const signupButton = document.getElementById("signup-btn");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");

    // 이메일 형식 검사 정규식
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // 입력값 변경 시 유효성 검사
    function validateForm() {
        let isValid = true;

        // 이메일 유효성 검사
        if (!isValidEmail(emailInput.value)) {
            emailError.textContent = "* 올바른 이메일 주소를 입력해주세요.";
            isValid = false;
        } else {
            emailError.textContent = "";
        }

        // 비밀번호 유효성 검사
        if (passwordInput.value.length < 8) {
            passwordError.textContent = "* 비밀번호는 8자 이상이어야 합니다.";
            isValid = false;
        } else {
            passwordError.textContent = "";
        }

        // 로그인 버튼 활성화 여부 설정
        loginButton.disabled = !isValid;
        loginButton.classList.toggle("active", isValid);
    }

    // 입력 이벤트 리스너 추가
    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);

    // 로그인 검증 함수
    function loginUser(email, password) {
        return users.find(user => user.email === email && user.password === password);
    }

    // 로그인 버튼 클릭 이벤트
    loginButton.addEventListener("click", function (event) {
        event.preventDefault(); // 기본 폼 제출 방지
        if (loginButton.disabled) return;

        const email = emailInput.value;
        const password = passwordInput.value;

        const user = users.find(u => u.email === email && u.password === password);


        if (user) {
            alert(`로그인 성공! 환영합니다, ${user.nickname}님.`);

            localStorage.setItem("email", user.email);
            localStorage.setItem("nickname", user.nickname);

            // 페이지 이동
            window.location.href = "postboard.html";
        } else {
            alert("이메일 또는 비밀번호를 확인하세요.");
            passwordInput.value = ""; // 비밀번호 초기화
        }
    });

    // 회원가입 버튼 클릭 시 페이지 이동
    signupButton.addEventListener("click", function () {
        window.location.href = "signup.html";
    });
});
