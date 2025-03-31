document.addEventListener("DOMContentLoaded", async function () {

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user");
    const postSlug = urlParams.get("slug");
    const loggedInUser = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("accessToken"); // 저장된 토큰

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

    let likes = false;
    let postId = null;

    backBtn.addEventListener("click", function () {
        history.back();
    });

    async function fetchPost() {
        try {
            const response = await fetch(`http://localhost:8080/${userId}/${postSlug}`);
            if (!response.ok) throw new Error("게시글을 불러올 수 없습니다.");

            const post = await response.json();
            postId = post.postId; // 이후 좋아요/댓글 기능에 사용됨

            postTitle.textContent = post.title;
            postContent.textContent = post.content;
            postMeta.textContent = `작성자: ${post.nickname || "알 수 없음"} ・ 조회수: ${post.views}`;
            likeCount.textContent = post.likes;
            viewCount.textContent = post.views;

            if (String(post.userId) === loggedInUser) {
                editBtn.style.display = "inline";
                deleteBtn.style.display = "inline";
            }

            likes = await checkLikeStatus(postId, loggedInUser);
            updateLikeButton();
        } catch (error) {
            console.error("게시글 조회 오류:", error);
        }
    }

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
            const response = await fetch(`http://localhost:8080/posts/${postId}/comments`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("댓글 데이터를 불러올 수 없습니다.");

            const data = await response.json();
            commentsDiv.innerHTML = "";

            data.forEach(comment => {
                const commentItem = document.createElement("div");
                commentItem.classList.add("comment-item");

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

    async function deleteComment(commentId) {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}/comments/${commentId}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("댓글 삭제 실패");

            alert("댓글이 삭제되었습니다.");
            fetchComments();
        } catch (error) {
            console.error("댓글 삭제 오류:", error);
        }
    }

    function updateLikeButton() {
        likeIcon.src = likes ? "../images/heart-filled.png" : "../images/heart-empty.png";
        likeBtn.classList.toggle("liked", likes);
    }

    likeBtn.addEventListener("click", async function () {
        try {
            let response;
            if (likes) {
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

    editBtn.addEventListener("click", function () {
        window.location.href = `editPost.html?id=${postId}&userId=${userId || "unknown"}&slug=${postSlug}`;
    });

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

    // 🔥 게시글 먼저 불러온 후 postId 확보하고 → 좋아요 & 댓글 처리
    await fetchPost();
    await fetchComments();
});
