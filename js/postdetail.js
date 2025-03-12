document.addEventListener("DOMContentLoaded", function () {
    const postTitle = document.getElementById("post-title");
    const postContent = document.getElementById("post-content");
    const postAuthor = document.getElementById("post-author");
    const postDate = document.getElementById("post-date");
    const postViews = document.getElementById("post-views");
    const postLikes = document.getElementById("post-likes");
    const likeBtn = document.getElementById("like-btn");
    const commentInput = document.getElementById("comment-input");
    const submitCommentBtn = document.getElementById("submit-comment");
    const commentList = document.getElementById("comment-list");
    const commentCount = document.getElementById("comment-count");
    const postActions = document.getElementById("post-actions");
    const editPostBtn = document.getElementById("edit-post");
    const deletePostBtn = document.getElementById("delete-post");

    // URL에서 게시물 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        alert("게시물을 찾을 수 없습니다.");
        window.location.href = "postlist.html";
        return;
    }

    // localStorage에서 게시물 데이터 가져오기
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let comments = JSON.parse(localStorage.getItem("comments")) || {};
    let storedEmail = localStorage.getItem("email");

    let post = posts.find(p => p.id == postId);
    if (!post) {
        alert("게시물이 존재하지 않습니다.");
        window.location.href = "postlist.html";
        return;
    }

    // 조회수 증가
    post.views = (post.views || 0) + 1;
    localStorage.setItem("posts", JSON.stringify(posts));

    // 게시물 정보 출력
    postTitle.textContent = post.title;
    postContent.textContent = post.content;
    postAuthor.textContent = post.author;
    postDate.textContent = post.createdAt;
    postViews.textContent = post.views;
    postLikes.textContent = post.likes || 0;

    // 댓글 불러오기
    function loadComments() {
        commentList.innerHTML = "";
        const postComments = comments[postId] || [];
        commentCount.textContent = postComments.length;

        postComments.forEach(comment => {
            const li = document.createElement("li");
            li.textContent = `${comment.author}: ${comment.text}`;
            commentList.appendChild(li);
        });
    }
    loadComments();

    // 좋아요 기능
    likeBtn.addEventListener("click", () => {
        post.likes = (post.likes || 0) + 1;
        postLikes.textContent = post.likes;
        localStorage.setItem("posts", JSON.stringify(posts));
    });

    // 댓글 작성 기능
    submitCommentBtn.addEventListener("click", () => {
        const commentText = commentInput.value.trim();
        if (!storedEmail) {
            alert("로그인이 필요합니다.");
            window.location.href = "login.html";
            return;
        }

        if (!commentText) {
            alert("댓글을 입력해주세요.");
            return;
        }

        const newComment = { author: storedEmail, text: commentText };

        if (!comments[postId]) {
            comments[postId] = [];
        }
        comments[postId].push(newComment);
        localStorage.setItem("comments", JSON.stringify(comments));

        commentInput.value = "";
        loadComments();
    });

    // 본인 게시글이면 수정/삭제 버튼 보이기
    if (storedEmail === post.author) {
        postActions.style.display = "block";
    }

    // 게시글 삭제 기능
    deletePostBtn.addEventListener("click", () => {
        posts = posts.filter(p => p.id != postId);
        localStorage.setItem("posts", JSON.stringify(posts));
        alert("게시물이 삭제되었습니다.");
        window.location.href = "postlist.html";
    });

    // 게시글 수정 기능
    editPostBtn.addEventListener("click", () => {
        const newTitle = prompt("새 제목을 입력하세요", post.title);
        const newContent = prompt("새 내용을 입력하세요", post.content);

        if (newTitle && newContent) {
            post.title = newTitle;
            post.content = newContent;
            localStorage.setItem("posts", JSON.stringify(posts));
            postTitle.textContent = newTitle;
            postContent.textContent = newContent;
            alert("게시물이 수정되었습니다.");
        }
    });
});
