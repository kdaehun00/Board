import { posts } from "../data/posts.js";

document.addEventListener("DOMContentLoaded", function () {
    const postList = document.getElementById("post-list");
    const writePostButton = document.getElementById("write-post-btn");

    const profileImg = document.getElementById("profile-img");
    const profileMenu = document.getElementById("profile-menu");
    const logoutBtn = document.getElementById("logout-btn");

    // 프로필 이미지 클릭 시 메뉴 토글
    profileImg.addEventListener("click", function (event) {
        event.stopPropagation(); // 클릭 이벤트 전파 방지
        profileMenu.style.display = (profileMenu.style.display === "block") ? "none" : "block";
    });

    // 메뉴 바깥을 클릭하면 닫힘
    document.addEventListener("click", function (event) {
        if (!profileMenu.contains(event.target) && event.target !== profileImg) {
            profileMenu.style.display = "none";
        }
    });

    // 로그아웃 기능
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser"); // 로그인 정보 삭제
        alert("로그아웃 되었습니다.");
        window.location.href = "login.html"; // 로그인 페이지로 이동
    });
    
    // 게시글 데이터 포맷팅 함수 (조회수 1000 이상 단위 변환)
    function formatNumber(num) {
        if (num >= 100000) return Math.floor(num / 1000) + "k";
        if (num >= 10000) return (num / 1000).toFixed(0) + "k";
        if (num >= 1000) return (num / 1000).toFixed(1) + "k";
        return num;
    }

    // 게시글 목록 렌더링
    function renderPosts() {
        postList.innerHTML = ""; // 기존 목록 초기화
        posts.forEach(post => {
            const postItem = document.createElement("div");
            postItem.classList.add("post-item");
            postItem.innerHTML = `
                <h3 class="post-title">${post.title.length > 26 ? post.title.substring(0, 26) + "..." : post.title}</h3>
                <p class="post-meta">
                    좋아요 ${post.likes} ・ 댓글 ${post.comments} ・ 조회수 ${formatNumber(post.views)}
                </p>
                <p class="post-author">${post.author}</p>
                <p class="post-date">${post.date}</p>
            `;

            // 게시글 클릭 시 상세 페이지로 이동
            postItem.addEventListener("click", function () {
                window.location.href = `postdetail.html?id=${post.id}`;
            });

            postList.appendChild(postItem);
        });
    }

    // 초기 게시글 렌더링
    renderPosts();

    // 게시글 작성 페이지로 이동
    writePostButton.addEventListener("click", function () {
        window.location.href = "writepost.html";
    });
});
