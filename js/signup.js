import { users } from "../data/users.js";

document.addEventListener("DOMContentLoaded", function () {
    const profileImgInput = document.getElementById("profile-img");
    const profilePreview = document.getElementById("profile-preview");

    profileImgInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => profilePreview.src = e.target.result;
            reader.readAsDataURL(file);
        }
    });

    profilePreview.addEventListener("click", function () {
        profileImgInput.value = "";
        profilePreview.src = "../images/default-profile.png";
    });

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const nicknameInput = document.getElementById("nickname");
    const signupButton = document.getElementById("signup-btn");
    const loginLink = document.querySelector(".login-link");

    function checkDuplicateEmail(email) {
        return users.some(user => user.email === email);
    }

    function checkDuplicateNickname(nickname) {
        return users.some(user => user.nickname === nickname);
    }

    function validateForm() {
        let isValid = true;

        if (!emailInput.value.includes("@")) {
            document.getElementById("email-helper").textContent = "* 올바른 이메일 주소를 입력하세요.";
            isValid = false;
        } else if (checkDuplicateEmail(emailInput.value)) {
            document.getElementById("email-helper").textContent = "* 이미 사용 중인 이메일입니다.";
            isValid = false;
        } else {
            document.getElementById("email-helper").textContent = "";
        }

        if (passwordInput.value.length < 8) {
            document.getElementById("password-helper").textContent = "* 비밀번호는 8자 이상이어야 합니다.";
            isValid = false;
        } else if (passwordInput.value.length > 20) {
            document.getElementById("password-helper").textContent = "* 비밀번호는 20자 이하이어야 합니다.";
            isValid = false;
        } else {
            document.getElementById("password-helper").textContent = "";
        }


        if (confirmPasswordInput.value !== passwordInput.value) {
            document.getElementById("confirm-password-helper").textContent = "* 비밀번호가 다릅니다.";
            isValid = false;
        } else {
            document.getElementById("confirm-password-helper").textContent = "";
        }

        if (nicknameInput.value.includes(" ")) {
            document.getElementById("nickname-helper").textContent = "* 닉네임에는 공백이 포함될 수 없습니다.";
            isValid = false;
        } else if (nicknameInput.value.length > 10) {
            document.getElementById("nickname-helper").textContent = "* 닉네임은 최대 10자까지 작성 가능합니다.";
            isValid = false;
        } else if (checkDuplicateNickname(nicknameInput.value)) {
            document.getElementById("nickname-helper").textContent = "* 이미 사용 중인 닉네임입니다.";
            isValid = false;
        } else {
            document.getElementById("nickname-helper").textContent = "";
        }


        signupButton.disabled = !isValid;
        signupButton.classList.toggle("active", isValid);
    }


    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);
    confirmPasswordInput.addEventListener("input", validateForm);
    nicknameInput.addEventListener("input", validateForm);


    signupButton.addEventListener("click", function () {
        const email = emailInput.value;
        const password = passwordInput.value;
        const nickname = nicknameInput.value;

        if (checkDuplicateEmail(email) || checkDuplicateNickname(nickname)) {
            alert("이미 사용 중인 이메일 또는 닉네임입니다.");
            return;
        }

        users.push({ email, password, nickname });

        alert("회원가입 완료!");
        window.location.href = "login.html";
    });


    loginLink.addEventListener("click", function () {
        window.location.href = "login.html";
    });
});
