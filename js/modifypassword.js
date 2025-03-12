import { users } from "../data/users.js";

document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const newPasswordInput = document.getElementById("new_password");
    const confirmPasswordInput = document.getElementById("confirm_password");
    const modifyBtn = document.getElementById("modifyBtn");
    const modifyDoneBtn = document.getElementById("modifyDoneBtn");

    // localStorage에서 사용자 정보 가져오기
    let usersData = JSON.parse(localStorage.getItem("users")) || users;
    const storedEmail = localStorage.getItem("email");

    if (!storedEmail) {
        alert("사용자 정보를 찾을 수 없습니다. 로그인 페이지로 이동합니다.");
        window.location.href = "login.html";
        return;
    }

    // 비밀번호 변경 버튼 이벤트
    modifyBtn.addEventListener("click", () => {
        const currentPassword = passwordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // 현재 비밀번호 확인
        const user = usersData.find(user => user.email === storedEmail);
        if (!user || user.password !== currentPassword) {
            alert("현재 비밀번호가 일치하지 않습니다.");
            return;
        }

        // 새 비밀번호 유효성 검사
        if (!newPassword || newPassword.length < 6) {
            alert("새 비밀번호는 6자 이상이어야 합니다.");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
            return;
        }

        // 비밀번호 변경 적용
        usersData = usersData.map(user =>
            user.email === storedEmail ? { ...user, password: newPassword } : user
        );

        // localStorage에 업데이트된 users 저장
        localStorage.setItem("users", JSON.stringify(usersData));

        alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
        window.location.href = "login.html"; // 로그인 페이지로 이동
    });
});
