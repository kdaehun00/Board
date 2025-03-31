document.addEventListener("DOMContentLoaded", function () {
    const postForm = document.getElementById("post-form");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const submitButton = document.getElementById("submit-btn");
    const cancelButton = document.getElementById("cancel-btn");

    // 게시글 작성 API 요청
    async function createPost(title, content) {
        try {
            const userId = Number(localStorage.getItem("loggedInUser"));
            const userNickname = localStorage.getItem("Nickname");
            if (!userId) {
                alert("로그인이 필요합니다.");
                window.location.href = "login.html";
                return;
            }

            const response = await fetch("http://localhost:8080/write", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, userNickname, title, content })
            });

            const responseData = await response.json();
            console.log("게시글 작성 응답:", responseData);

            if (response.ok) {
                window.location.href = "postboard.html";
            } else {
                alert(responseData.message);
            }
        } catch (error) {
            console.error("게시글 작성 오류:", error);
            alert("게시글 작성 중 오류가 발생했습니다.");
        }
    }

    // 폼 제출 이벤트
    postForm.addEventListener("submit", function (event) {
        event.preventDefault(); // 기본 동작 방지

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (title === "" || content === "") {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        createPost(title, content);
    });

    // 취소 버튼 클릭 시 게시글 목록으로 이동
    cancelButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });
});
