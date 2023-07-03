import { updateLoginStatus, isLoggedIn } from "./isLoggedIn.js";
import myPage from "./myPageButton.js";

$(document).ready(() => {
  myPage();
  updateLoginStatus();
  initializePage();
});

const profileUrl = window.location.pathname;
let userId = profileUrl.split("/profile/")[1];

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

const postBtn = document.getElementById("post-btn");
postBtn.addEventListener("click", createPost);

// 닉네임, 자기소개, 이미지 조회
async function getProfile() {
  try {
    let nicknameId = document.getElementById("nickname");
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
  try {
    const response = await fetch(`/api/users/${userId}/posts`);
    const result = await response.json();

    result.forEach(item => {
      let img = item.img;
      let title = item.title;
      let content = item.content;

      let temp_html = `<div data-post-id="${item.postId}" class="post-container">
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

    const postCards = document.querySelectorAll(".post-container");
    postCards.forEach(postCard => {
      postCard.addEventListener("click", () => {
        // Retrieve the postId from the clicked card
        const postId = postCard.getAttribute("data-post-id");
        // Redirect to the post detail page with the postId
        window.location.href = `/posts/${postId}`;
      });
    });
  } catch (error) {
    console.log(error);
  }
}

// 프로필 수정 모달창에 수정버튼 이벤트 추가
const editProfileBtn = document.getElementById("editProfileBtn");
editProfileBtn.addEventListener("click", editProfile);

async function editProfile() {
  try {
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

// 팔로우 함수
function follow() {
  fetch(`/api/users/${userId}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      alert(Object.values(data)[0]);
      window.location.reload();
    })
    .catch(err => console.log(err));
}

const followBtn = document.getElementById("follow-btn");
followBtn.addEventListener("click", follow);

// 언팔로우 함수
function unfollow() {
  fetch(`/api/users/${userId}/unfollow`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      alert(Object.values(data)[0]);
      window.location.reload();
    })
    .catch(err => console.log(err));
}

const unfollowBtn = document.getElementById("unfollow-btn");
unfollowBtn.addEventListener("click", unfollow);

// 여기
const nav = document.querySelector("nav ul");
async function initializePage() {
  const result = await isLoggedIn(); // 로그인 상태 확인
  // 로그인 상태인 경우
  if (!result.errorMessage) {
    const logoutButton = document.createElement("li");
    logoutButton.innerHTML = `<button class="logout-btn1" id="logoutButton">로그아웃</button>`;
    nav.appendChild(logoutButton);

    const logoutButtonElement = document.getElementById("logoutButton");

    logoutButtonElement.addEventListener("click", async () => {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          // 로그아웃 성공 시 페이지 리로드 또는 다른 동작 수행
          window.location.href = "/";
        } else {
          const result = await response.json();
          console.log(result.errorMessage);
        }
      } catch (error) {
        console.error(error);
      }
    });
  } else {
    console.log("알 슈 없는 에뤄가 발생했슙니다.");
  }
}
