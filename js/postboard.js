document.addEventListener("DOMContentLoaded", function () {
    const postList = document.getElementById("post-list");
    const writePostButton = document.getElementById("write-post-btn");

    const profileImg = document.getElementById("profile-img");
    const profileMenu = document.getElementById("profile-menu");
    const logoutBtn = document.getElementById("logout-btn");

    const loggedInUser = {
        userId: localStorage.getItem("loggedInUser"),
        email: localStorage.getItem("Email"),
        nickname: localStorage.getItem("Nickname"),
        profileImg: localStorage.getItem("profileImg"),
    };

    if (loggedInUser.userId) {
        console.log(localStorage.getItem("profileImg"));
        profileImg.src = loggedInUser.profileImg || "https://picsum.photos/50"; // 기본 이미지 설정
    } else {
        alert("로그인이 필요합니다.");
        window.location.href = "login.html"; // 로그인 페이지로 이동
    }

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
        localStorage.removeItem("Email");
        localStorage.removeItem("Nickname");
        localStorage.removeItem("profileImg");
        alert("로그아웃 되었습니다.");
        window.location.href = "login.html";
    });
    // 숫자 포맷팅 함수 (1000 이상일 경우 k 단위 변환)
    function formatNumber(num) {
        if (num >= 100000) return Math.floor(num / 1000) + "k";
        if (num >= 10000) return (num / 1000).toFixed(0) + "k";
        if (num >= 1000) return (num / 1000).toFixed(1) + "k";
        return num;
    }

    // 날짜 포맷팅 함수 (Invalid Date 방지)
    function formatDate(dateString) {
        if (!dateString) return "날짜 없음"; // 값이 없을 경우 기본값 반환
        const date = new Date(dateString);
        return isNaN(date) ? "날짜 오류" : date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
    }

    // 최신 게시글 목록 가져오기
    async function fetchPosts() {
        try {
            const response = await fetch("http://localhost:8080/posts", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("서버 응답 실패");

            const responseData = await response.json(); // JSON 변환
            console.log("서버 응답 데이터:", responseData);

            return responseData; 
        } catch (error) {
            console.error("게시물 불러오기 오류:", error);
            return [];
        }
    }

    async function renderPosts() {
        postList.innerHTML = ""; // 기존 게시글 목록 초기화

        const posts = await fetchPosts();

        if (!posts || posts.length === 0) {
            postList.innerHTML = "<p>게시물이 없습니다.</p>";
            return;
        }

        posts.forEach(post => {
            const postItem = document.createElement("div");
            postItem.classList.add("post-item");

            // 프로필 이미지가 없을 경우 기본 이미지 제공
            const profileImageUrl = post.profileImg || "https://picsum.photos/50";

            postItem.innerHTML = `
                <div class="post-header">
                    <img class="post-profile-img" src="${profileImageUrl}" alt="작성자 프로필 이미지">
                    <p class="post-author">${post.nickname}</p>
                </div>
                <h3 class="post-title">${post.title.length > 26 ? post.title.substring(0, 26) + "..." : post.title}</h3>
                <p class="post-meta">
                    ❤️ ${post.likes || 0} ・ 👁️ ${formatNumber(post.views || 0)}
                </p>
                <p class="post-date">${formatDate(post.createPostDate)}</p>
            `;

            console.log("📌 게시글 날짜 데이터:", post.createPostDate);

            // 게시글 클릭 시 조회수 증가 후 상세 페이지 이동
            postItem.addEventListener("click", async function () {
                try {
                    // 조회수 증가 요청 (PATCH)
                    const patchResponse = await fetch(`http://localhost:8080/posts/${post.postId}/views`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" }
                    });

                    if (!patchResponse.ok) throw new Error("조회수 증가 실패");

                    const patchData = await patchResponse.json();
                    console.log(`📌 조회수 증가 완료: ${patchData.views}`);

                    // 최신 게시글 데이터 반영 (조회수 증가 후 업데이트)
                    setTimeout(async () => {
                        await fetchPosts();
                        renderPosts();
                    }, 500);

                } catch (error) {
                    console.error("📌 게시물 상세 조회 오류:", error);
                } finally {
                    window.location.href = `postdetail.html?id=${post.postId}`;
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
