async function isLoggedIn() {
  try {
    const response = await fetch("/api/check-login");
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Error checking login status");
    }
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

// 모달 띄우기 js 코드
const openButton = document.getElementById("open-settings"); // 프로필 수정 버튼
const openBtn = document.getElementById("open-post"); // 게시글 작성 버튼

const modal = document.getElementById("profileModal");
const postModal = document.getElementById("postModal");

const overlay = modal.querySelector(".modal_overlay");
const postModalOverlay = postModal.querySelector(".postModal_overlay");

const closeButton = modal.querySelector("#settingsModal-close"); // 프로필 수정 모달에 있는 취소버튼
const closeBtn = postModal.querySelector("#postModal-close"); // 게시글 작성 모달에 있는 취소버튼

const openModal = () => {
  modal.classList.remove("hidden");
};

const postModalOpen = () => {
  postModal.classList.remove("hidden");
};

const closeModal = () => {
  modal.classList.add("hidden");
};

const postModalClose = () => {
  postModal.classList.add("hidden");
};

// 프로필 수정 모달
if (overlay) {
  overlay.addEventListener("click", closeModal);
}

if (openButton) {
  openButton.addEventListener("click", openModal);
}

if (closeButton) {
  closeButton.addEventListener("click", closeModal);
}

// 게시글 작성 모달
if (postModalOverlay) {
  postModalOverlay.addEventListener("click", postModalClose);
}

if (openBtn) {
  openBtn.addEventListener("click", postModalOpen);
}

if (closeBtn) {
  closeBtn.addEventListener("click", postModalClose);
}

// 페이지 들어갔을시 실행되는 함수
$(document).ready(function () {
  getProfile();
  getFollowers();
  getPostsCount();
  getUserPosts();
});

// 게시글등록
async function createPost() {
  try {
    const title = document.getElementById("title").value;
    const img = document.getElementById("img").value;
    const content = document.getElementById("content").value;
    const data = {
      title,
      img,
      content
    };
    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    location.reload();
  } catch (error) {
    console.error(error);
  }
}

// 닉네임, 자기소개, 이미지 조회
async function getProfile() {
  try {
    let data = await isLoggedIn();
    let userId = data.user.id;

    let nicknameId = document.getElementById("nickname");
    let proImgId = document.getElementById("proImg");
    let introductionId = document.getElementById("introduction");

    fetch(`/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        // 이미지 url이 존재할때만 innerText로 저장하기
        if (data.profileimage) {
          $(".profile-img").empty();
          const imgUrl = data.profileimage;
          let temp_html = ` <div class="profile-img">
                                      <img id="proImg"
                                          src="${imgUrl}"/>
                                   </div>`;
          $(".profile-img").append(temp_html);
        }
        nicknameId.innerText = data.nickname;
        introductionId.innerText = data.description;
      })
      .catch(error => {
        console.error("데이터를 가져오는 중에 에러가 발생했습니다.", error);
      });
  } catch (error) {
    console.error("알 수 없는 에러가 발생했습니다.", error);
  }
}

// 팔로워 수 조회
async function getFollowers() {
  try {
    let data = await isLoggedIn();
    let userId = data.user.id;

    const allFollowers = document.getElementById("followers-count");
    fetch(`/api/users/${userId}/followers`)
      .then(response => response.json())
      .then(data => {
        const followersCount = data.getFollowers.length;
        allFollowers.innerText = followersCount;
      })
      .catch(error => {
        console.error("팔로워 수 조회에 실패했습니다.", error);
      });
  } catch (error) {
    console.error("알 수 없는 에러가 발생했습니다.", error);
  }
}

// 해당 사용자의 게시글 수 조회
async function getPostsCount() {
  try {
    let data = await isLoggedIn();
    let userId = data.user.id;

    const userPostsCount = document.getElementById("posts-count");
    fetch(`/api/users/${userId}/posts`)
      .then(response => response.json())
      .then(data => {
        const postsCount = data.length;
        userPostsCount.innerText = postsCount;
      })
      .catch(error => {
        console.error("팔로워 수 조회에 실패했습니다.", error);
      });
  } catch (error) {
    console.error("알 수 없는 에러가 발생했습니다.", error);
  }
}

// 해당 사용자의 게시글 조회
async function getUserPosts() {
  let data = await isLoggedIn();
  let userId = data.user.id;

  let postImg = document.getElementById("post-img");
  let postTitle = document.getElementById("post-title");
  let postContent = document.getElementById("post-content");
  fetch(`/api/users/${userId}/posts`)
    .then(response => response.json())
    .then(data => {
      $(".row-2").empty();

      let results = data.forEach(item => {
        let img = item.img;
        // if (!img) {
        //   img =
        //     "https://previews.123rf.com/images/siamimages/siamimages1504/siamimages150401064/39173277-%EC%82%AC%EC%A7%84-%EC%97%86%EC%9D%8C-%EC%95%84%EC%9D%B4%EC%BD%98-%EC%97%86%EC%9D%8C.jpg";
        // }

        let title = item.title;
        let content = item.content;

        let temp_html = `<div class="post-container">
                                  <div id="post-img">
                                      <img src="${img}" onerror="src='https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'"/>
                                  </div>
                                  <div class="post-text">
                                      <h3>${title}</h3>
                                      <p>${content}</p>
                                  </div>
                              </div>`;
        $(".row-2").append(temp_html);
      });
    });
}

// 프로필 수정 모달창에 수정버튼 이벤트 추가
const editProfileBtn = document.getElementById("editProfileBtn");
editProfileBtn.addEventListener("click", editProfile);

async function editProfile() {
  try {
    const data = await isLoggedIn();
    const userId = data.user.id;
    const newNicknameInput = document.getElementById("newNickname").value;
    const newUrlInput = document.getElementById("newUrl").value;
    const newIntroductionInput = document.getElementById("newIntroduction").value;
    const newPasswordInput = document.getElementById("newPassword").value;
    const newConfirmPasswordInput = document.getElementById("newConfirmPassword").value;

    // 비밀번호 확인 로직 추가
    if (newPasswordInput !== newConfirmPasswordInput) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const requestBody = {
      nickname: newNicknameInput,
      profileImage: newUrlInput,
      password: newPasswordInput,
      confirmPassword: newConfirmPasswordInput,
      description: newIntroductionInput
    };

    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    const responseData = await response.json();
    // 전달받은 값에 벨류 값을 얼럿으로 띄움
    alert(Object.values(responseData)[0]);
    // 새로고침
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}