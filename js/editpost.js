document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    const loggedInUser = localStorage.getItem("loggedInUser");

    const postForm = document.getElementById("post-form");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const submitButton = document.getElementById("submit-btn");
    const cancelButton = document.getElementById("cancel-btn");

    // 게시글 정보 불러오기
    async function fetchPost() {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}`);
            if (!response.ok) throw new Error("게시글 데이터를 불러올 수 없습니다.");
            
            const data = await response.json();
            const post = data.data;

            // 입력 필드에 기존 게시글 정보 채우기
            titleInput.value = post.title;
            contentInput.value = post.content;

            // 수정 권한 체크 (작성자만 수정 가능)
            if (String(post.userId) !== loggedInUser) {
                alert("게시글 수정 권한이 없습니다.");
                window.location.href = "postboard.html";
            }
        } catch (error) {
            console.error("게시글 조회 오류:", error);
            alert("게시글을 불러오는 중 오류가 발생했습니다.");
            window.location.href = "postboard.html";
        }
    }

    // 게시글 수정 API 요청
    async function updatePost(title, content) {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content })
            });
            
            console.log(title, content);
            if (response.ok) {
                alert("게시글이 수정되었습니다.");
                window.location.href = `postdetail.html?id=${postId}`;
            } else {
                alert("게시글 수정 실패: ");
            }
        } catch (error) {
            console.error("게시글 수정 오류:", error);
            alert("게시글 수정 중 오류가 발생했습니다.");
        }
    }

    // 폼 제출 이벤트 (게시글 수정)
    postForm.addEventListener("submit", function (event) {
        event.preventDefault(); // 기본 동작 방지

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (title === "" || content === "") {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        updatePost(title, content);
    });

    // 취소 버튼 클릭 시 게시글 상세 페이지로 이동
    cancelButton.addEventListener("click", function () {
        window.location.href = `postdetail.html?id=${postId}`;
    });

    // 페이지 로드 시 기존 데이터 불러오기
    fetchPost();
});
