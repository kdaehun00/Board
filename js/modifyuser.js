import { users } from "../data/users.js";

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const nicknameInput = document.getElementById("nickname");
    const modifyBtn = document.getElementById("modifyBtn");
    const modifyDoneBtn = document.getElementById("modifyDoneBtn");
    const deleteBtn = document.getElementById("deleteBtn");
    const modalOverlay = document.getElementById("modalOverlay");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

    // localStorage에서 사용자 정보 가져오기
    let usersData = JSON.parse(localStorage.getItem("users")) || users;
    const storedEmail = localStorage.getItem("email");
    const storedNickname = localStorage.getItem("nickname");

    if (storedEmail) {
        emailInput.value = storedEmail;
        nicknameInput.value = storedNickname || "";
    } else {
        alert("사용자 정보를 찾을 수 없습니다. 로그인 페이지로 이동합니다.");
        window.location.href = "login.html";
    }

    // 닉네임 수정 버튼 이벤트
    modifyBtn.addEventListener("click", () => {
        const newNick = nicknameInput.value.trim();

        if (!newNick) {
            alert("닉네임을 입력해주세요.");
            return;
        }
        if (/\s/.test(newNick)) {
            alert("닉네임에 공백을 사용할 수 없습니다.");
            return;
        }
        if (newNick.length > 10) {
            alert("닉네임은 10자 이하로 설정해주세요.");
            return;
        }

        // 기존 users 배열에서 현재 사용자 찾기
        usersData = usersData.map(user =>
            user.email === storedEmail ? { ...user, nickname: newNick } : user
        );

        // localStorage에 업데이트된 users 저장
        localStorage.setItem("users", JSON.stringify(usersData));
        localStorage.setItem("nickname", newNick); // 변경된 닉네임 반영

        alert("닉네임이 수정되었습니다.");
        modifyBtn.style.display = "none";
        modifyDoneBtn.style.display = "inline-block"; // 수정 완료 버튼 표시
    });

    // 회원 탈퇴 버튼 이벤트
    deleteBtn.addEventListener("click", () => {
        modalOverlay.style.display = "flex"; // 모달 보이기
    });

    cancelDeleteBtn.addEventListener("click", () => {
        modalOverlay.style.display = "none";
    });

    confirmDeleteBtn.addEventListener("click", () => {
        // users 배열에서 현재 사용자 삭제
        usersData = usersData.filter(user => user.email !== storedEmail);
        localStorage.setItem("users", JSON.stringify(usersData)); // 업데이트된 사용자 목록 저장

        // 로그인 정보 삭제
        localStorage.removeItem("email");
        localStorage.removeItem("nickname");

        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "login.html"; // 로그인 페이지로 이동
    });
});
