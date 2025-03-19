document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    const loggedInUser = localStorage.getItem("loggedInUser");

    const postTitle = document.getElementById("post-title");
    const postContent = document.getElementById("post-content");
    const postMeta = document.getElementById("post-meta");
    const likeBtn = document.getElementById("like-btn");
    const likeIcon = document.getElementById("like-icon");
    const likeCount = document.getElementById("like-count");
    const viewCount = document.getElementById("view-count");
    const editBtn = document.getElementById("edit-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const commentsDiv = document.getElementById("comments");
    const commentInput = document.getElementById("comment-input");
    const commentBtn = document.getElementById("comment-btn");
    const backBtn = document.getElementById("back-btn");

    let likes = false; // 좋아요 상태 저장

    // 뒤로가기 버튼 기능 추가
    backBtn.addEventListener("click", function () {
        history.back();
    });


    // 게시글 데이터 가져오기
    async function fetchPost() {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}`);
            const data = response.JSON.stringify();
            if (!response.ok) alert(data.message);

            const post = await response.json(); // 응답을 바로 사용

            postTitle.textContent = post.title;
            postContent.textContent = post.content;
            postMeta.textContent = `작성자: ${post.nickname} ・ 조회수: ${post.views}`;
            likeCount.textContent = post.likes;
            viewCount.textContent = post.views;

            // 본인 게시물일 경우 수정 & 삭제 버튼 표시
            if (String(post.userId) === loggedInUser) {
                editBtn.style.display = "inline";
                deleteBtn.style.display = "inline";
            }

            // 좋아요 상태 체크
            likes = await checkLikeStatus(postId, loggedInUser);
            updateLikeButton();
        } catch (error) {
            console.error("게시글 조회 오류:", error);
        }
    }


    // 특정 사용자의 좋아요 상태 체크
    async function checkLikeStatus(postId, loggedInUser) {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}/likes/${loggedInUser}`);
            if (!response.ok) throw new Error("좋아요 상태 확인 실패");

            const data = await response.json();
            return data.likes;
        } catch (error) {
            console.error("좋아요 상태 확인 오류:", error);
            return false;
        }
    }

    async function fetchComments() {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}/comments`);
            if (!response.ok) throw new Error("댓글 데이터를 불러올 수 없습니다.");

            const data = await response.json();
            commentsDiv.innerHTML = ""; // 기존 댓글 초기화

            data.forEach(comment => {
                const commentItem = document.createElement("div");
                commentItem.classList.add("comment-item");

                // 프로필 이미지가 없을 경우 기본 이미지 제공
                const profileImageUrl = comment.profileImg || "https://picsum.photos/40";

                commentItem.innerHTML = `
                    <div class="comment-content-wrapper">
                        <img class="comment-profile-img" src="${profileImageUrl}" alt="프로필 이미지">
                        <div>
                            <p class="comment-author"><strong>${comment.nickname}</strong></p>
                            <p class="comment-content">${comment.content}</p>
                            <p class="comment-date">${new Date(comment.createDate).toLocaleString()}</p>
                        </div>
                    </div>
                `;

                // 🔹 본인의 댓글이면 삭제 버튼 추가
                if (String(comment.nickname) === localStorage.getItem("Nickname")) {
                    const deleteCommentBtn = document.createElement("button");
                    deleteCommentBtn.textContent = "삭제 ❌";
                    deleteCommentBtn.classList.add("delete-comment-btn");
                    deleteCommentBtn.addEventListener("click", () => deleteComment(comment.commentId));
                    commentItem.appendChild(deleteCommentBtn);
                }

                commentsDiv.appendChild(commentItem);
            });
        } catch (error) {
            console.error("댓글 조회 오류:", error);
        }
    }



    // 댓글 삭제 함수
    async function deleteComment(commentId) {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}/comments/${commentId}`, { method: "DELETE" });

            if (!response.ok) throw new Error("댓글 삭제 실패");

            alert("댓글이 삭제되었습니다.");
            fetchComments();
        } catch (error) {
            console.error("댓글 삭제 오류:", error);
        }
    }

    // 좋아요 버튼 상태 업데이트
    function updateLikeButton() {
        likeIcon.src = likes ? "../images/heart-filled.png" : "../images/heart-empty.png";
        likeBtn.classList.toggle("liked", likes);
    }

    // 좋아요 기능
    likeBtn.addEventListener("click", async function () {
        try {
            let response;
            if (likes) {
                console.log(postId);
                response = await fetch(`http://localhost:8080/posts/${postId}/likes/${loggedInUser}`, { method: "DELETE" });
            } else {
                response = await fetch(`http://localhost:8080/posts/${postId}/likes/${loggedInUser}`, { method: "POST" });
            }

            if (!response.ok) throw new Error("좋아요 변경 실패");

            const data = await response.json();
            likes = !likes;
            likeCount.textContent = data.likeNumber;
            updateLikeButton();
        } catch (error) {
            console.error("좋아요 처리 오류:", error);
        }
    });

    // 댓글 작성
    commentBtn.addEventListener("click", async function () {
        const content = commentInput.value.trim();
        if (!content) return alert("댓글을 입력하세요.");

        try {
            await fetch(`http://localhost:8080/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: loggedInUser, content })
            });

            commentInput.value = "";
            fetchComments();
        } catch (error) {
            console.error("댓글 작성 오류:", error);
        }
    });

    // 게시글 수정
    editBtn.addEventListener("click", function () {
        window.location.href = `editPost.html?id=${postId}`;
    });

    // 게시글 삭제
    deleteBtn.addEventListener("click", async function () {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}`, { method: "DELETE" });

            if (!response.ok) throw new Error("게시글 삭제 실패");

            alert("게시글이 삭제되었습니다.");
            window.location.href = "postboard.html";
        } catch (error) {
            console.error("게시글 삭제 오류:", error);
        }
    });

    // 초기 데이터 로드
    fetchPost(); // 게시글 데이터 불러오기
    fetchComments(); // 댓글 목록 불러오기
});
