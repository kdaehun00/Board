document.addEventListener("DOMContentLoaded", function () {
    const currentPasswordInput = document.getElementById("current-password");
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const changePasswordBtn = document.getElementById("changePasswordBtn");

    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        alert("로그인이 필요합니다.");
        window.location.href = "login.html";
        return;
    }

    // 입력값 검증 및 버튼 활성화
    function validateForm() {
        const currentPassword = currentPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (currentPassword && newPassword.length >= 8 && newPassword === confirmPassword) {
            changePasswordBtn.classList.add("active");
            changePasswordBtn.disabled = false;
        } else {
            changePasswordBtn.classList.remove("active");
            changePasswordBtn.disabled = true;
        }
    }

    currentPasswordInput.addEventListener("input", validateForm);
    newPasswordInput.addEventListener("input", validateForm);
    confirmPasswordInput.addEventListener("input", validateForm);

    // 비밀번호 변경 요청
    changePasswordBtn.addEventListener("click", async function () {
        const currentPassword = currentPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();

        try {
            const response = await fetch(`http://localhost:8080/users/${loggedInUser}/info/password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    currentPassword: currentPassword, 
                    newPassword: newPassword  })
            });
            console.log(loggedInUser, currentPassword, newPassword, response.ok);

            if (response.ok) {
                alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
                localStorage.removeItem("loggedInUser"); // 로그아웃
                window.location.href = "login.html"; // 로그인 페이지로 이동
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert("서버 오류: " + error);
        }
    });
});
