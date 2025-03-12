document.addEventListener("DOMContentLoaded", function () {
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const submitPostBtn = document.getElementById("submitPost");

    // 기존 게시물 목록 불러오기 (localStorage 활용)
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    submitPostBtn.addEventListener("click", () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const storedEmail = localStorage.getItem("email"); // 현재 로그인한 사용자

        if (!storedEmail) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            window.location.href = "login.html";
            return;
        }

        if (!title || !content) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        // 새로운 게시물 객체 생성
        const newPost = {
            id: Date.now(), // 고유 ID (timestamp)
            title,
            content,
            author: storedEmail,
            createdAt: new Date().toLocaleString()
        };

        // 게시물 목록에 추가하고 저장
        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));

        alert("게시물이 작성되었습니다.");
        window.location.href = "postlist.html"; // 게시물 목록 페이지로 이동
    });
});
