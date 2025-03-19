document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const nicknameInput = document.getElementById("nickname");
    const modifyBtn = document.getElementById("modifyBtn");
    const modifyDoneBtn = document.getElementById("modifyDoneBtn");
    const profileImgInput = document.getElementById("profile-img-input");
    const profileImg = document.getElementById("profile-img");
    const deleteBtn = document.getElementById("deleteBtn");
    const modalOverlay = document.getElementById("modalOverlay");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

    const loggedInUserId = localStorage.getItem("loggedInUser");

    if (!loggedInUserId) {
        alert("로그인 정보가 없습니다. 로그인 페이지로 이동합니다.");
        window.location.href = "login.html";
        return;
    }

    // localStorage에서 사용자 정보 불러오기
    emailInput.value = localStorage.getItem("Email") || "";
    nicknameInput.value = localStorage.getItem("Nickname") || "";
    profileImg.src = localStorage.getItem("profileImg") || "https://picsum.photos/100";

    // 닉네임 필드 수정 가능
    nicknameInput.removeAttribute("readonly");

    let selectedProfileFile = null; // 변경된 이미지 파일 저장

    // 프로필 이미지 선택 시 미리보기 적용
    profileImgInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            selectedProfileFile = file;
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    modifyBtn.addEventListener("click", async function () {
        const newNick = nicknameInput.value.trim();
        const oldNick = localStorage.getItem("Nickname");
        const oldProfileImg = localStorage.getItem("profileImg");
    
        // 변경 확인
        const isNicknameChanged = newNick !== oldNick;
        const isProfileChanged = selectedProfileFile !== null;
    
        if (!isNicknameChanged && !isProfileChanged) {
            alert("변경된 내용이 없습니다.");
            return;
        }
    
        try {
            let uploadedProfileImgUrl = oldProfileImg; // 기존 프로필 URL 유지
    
            // 프로필 이미지 변경이 있을 경우 업로드 후 URL 업데이트
            if (isProfileChanged) {
                const formData = new FormData();
                formData.append("file", selectedProfileFile);
    
                const response = await fetch(`http://localhost:8080/users/${loggedInUserId}/user-profile/uploads`, {
                    method: "PUT",
                    body: formData
                });
    
                if (!response.ok) throw new Error("프로필 이미지 업로드 실패");
    
                const data = await response.json();
                uploadedProfileImgUrl = data.url || data.profileImg;
    
                // 브라우저 캐시 무효화를 위해 `?timestamp` 추가
                uploadedProfileImgUrl += "?timestamp=" + new Date().getTime();
            }
    
            // 닉네임만 변경할 경우
            if (isNicknameChanged && !isProfileChanged) {
                const updateResponse = await fetch(`http://localhost:8080/users/${loggedInUserId}/info/nickname`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nickname: newNick })
                });
    
                if (!updateResponse.ok) throw new Error("🚨 닉네임 업데이트 실패");
    
                localStorage.setItem("Nickname", newNick);
                alert("닉네임이 변경되었습니다.");
            }
    
            // 프로필 이미지만 변경할 경우
            if (!isNicknameChanged && isProfileChanged) {
                const updateResponse = await fetch(`http://localhost:8080/users/${loggedInUserId}/info/profileImg`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profileImg: uploadedProfileImgUrl }) // JSON으로 보냄
                });
                
    
                if (!updateResponse.ok) throw new Error("프로필 이미지 업데이트 실패");
    
                localStorage.setItem("profileImg", uploadedProfileImgUrl);
                alert("프로필 이미지가 변경되었습니다.");
            }
    
            // 닉네임과 프로필 이미지를 동시에 변경하는 경우
            if (isNicknameChanged && isProfileChanged) {
                await fetch(`http://localhost:8080/users/${loggedInUserId}/info/nickname`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nickname: newNick })
                });
    
                await fetch(`http://localhost:8080/users/${loggedInUserId}/info/profileImg`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profileImg: uploadedProfileImgUrl }) // JSON으로 보냄
                });
    
    
                localStorage.setItem("Nickname", newNick);
                localStorage.setItem("profileImg", uploadedProfileImgUrl);
                alert("회원 정보가 수정되었습니다.");
            }
    
            // UI 업데이트
            modifyBtn.style.display = "none";
            modifyDoneBtn.style.display = "inline-block";
            window.location.href = "postboard.html";
    
        } catch (error) {
            alert("회원 정보를 수정할 수 없습니다.");
        }
    });
    
    // 회원 탈퇴 기능
    deleteBtn.addEventListener("click", function () {
        modalOverlay.style.display = "flex";
    });

    confirmDeleteBtn.addEventListener("click", async function () {
        try {
            const response = await fetch(`http://localhost:8080/users/${loggedInUserId}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("회원 탈퇴 실패");

            // localStorage에서 사용자 정보 삭제
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("Nickname");
            localStorage.removeItem("Email");
            localStorage.removeItem("profileImg");

            alert("회원 탈퇴가 완료되었습니다.");
            window.location.href = "login.html";
        } catch (error) {
            alert("회원 탈퇴에 실패했습니다.");
        }
    });

    cancelDeleteBtn.addEventListener("click", function () {
        modalOverlay.style.display = "none";
    });
});
