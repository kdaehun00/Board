document.addEventListener("DOMContentLoaded", function () {
    const postList = document.getElementById("post-list");
    const writePostButton = document.getElementById("write-post-btn");

    const profileImg = document.getElementById("profile-img");
    const profileMenu = document.getElementById("profile-menu");
    const logoutBtn = document.getElementById("logout-btn");

    // 프로필 이미지 클릭 시 메뉴 토글
    profileImg.addEventListener("click", function (event) {
        event.stopPropagation();
        profileMenu.style.display = (profileMenu.style.display === "block") ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!profileMenu.contains(event.target) && event.target !== profileImg) {
            profileMenu.style.display = "none";
        }
    });

    // 로그아웃 기능
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        alert("로그아웃 되었습니다.");
        window.location.href = "login.html";
    });
    
    // 숫자 포맷팅 함수
    function formatNumber(num) {
        if (num >= 100000) return Math.floor(num / 1000) + "k";
        if (num >= 10000) return (num / 1000).toFixed(0) + "k";
        if (num >= 1000) return (num / 1000).toFixed(1) + "k";
        return num;
    }

    // 게시글 목록을 가져오는 비동기 함수
    async function fetchPosts() {
        try {
            const response = await fetch("http://localhost:8080/posts"); // 백엔드 요청
            if (!response.ok) throw new Error("서버 응답 실패");

            const posts = await response.json(); // JSON 변환
            console.log("불러온 게시물 목록:", posts);
            return posts;
        } catch (error) {
            console.error("게시물 불러오기 오류:", error);
            return [];
        }
    }

    // 게시글 목록을 렌더링하는 함수
    async function renderPosts() {
        postList.innerHTML = ""; // 기존 게시글 목록 초기화

        const posts = await fetchPosts(); // 게시글 가져오기

        posts.forEach(post => {
            const postItem = document.createElement("div");
            postItem.classList.add("post-item");

            postItem.innerHTML = `
                <h3 class="post-title">${post.title.length > 26 ? post.title.substring(0, 26) + "..." : post.title}</h3>
                <p class="post-meta">
                    좋아요 ${post.likes || 0} ・ 댓글 ${post.comments ? post.comments.length : 0} ・ 조회수 ${formatNumber(post.views || 0)}
                </p>
                <p class="post-author">${post.author}</p>
                <p class="post-date">${post.date}</p>
            `;

            // 게시물 클릭 이벤트 추가
            postItem.addEventListener("click", async function () {
                try {
                    const response = await fetch(`http://localhost:8080/posts/${post.id}`); // 올바른 URL 사용
                    if (!response.ok) throw new Error("게시물 데이터를 불러오는 데 실패했습니다.");
                    
                    const postData = await response.json();
                    console.log("게시물 데이터:", postData);
                    
                    // 상세 페이지로 이동하면서 postId를 URL에 포함
                    window.location.href = `postdetail.html?id=${post.id}`;
                } catch (error) {
                    console.error("게시물 상세 조회 오류:", error);
                }
            });

            postList.appendChild(postItem);
        });
    }

    // 초기 게시글 목록 렌더링
    renderPosts();

    // 게시글 작성 페이지로 이동
    writePostButton.addEventListener("click", function () {
        window.location.href = "createpost.html";
    });
});
