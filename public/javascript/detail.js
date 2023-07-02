import { isLoggedIn, updateLoginStatus } from "./isLoggedIn.js";
import myPage from "./myPageButton.js";
myPage();
updateLoginStatus();

// 페이지 url에서 postId 추출
const url = window.location.pathname;
const postId = url.split("/posts/")[1];

// 요소 가져오기
const postUpdateButton = document.querySelector("#postUpdate");
const postUpdateModal = document.querySelector("#postUpdateModal");
const postUpdateModalClose = document.querySelector("#postUpdateModalClose");

// '수정' 버튼 : 수정 모달을 연다.(보이게한다.)
postUpdateButton.addEventListener("click", e => {
  postUpdateModal.classList.replace("d-none", "show");
});

const postModalCloseButton = document.querySelector("#postModal-close");
postModalCloseButton.addEventListener("click", () => {
  postUpdateModal.classList.add("d-none");
});

// 수정 모달폼 - 수정하기 버튼
const modalUpdateButton = document.querySelector("#modalUpdateButton");

modalUpdateButton.addEventListener("click", async e => {
  console.log("수정 로직 실행");
  try {
    const title = document.querySelector("#update-title").value;
    const content = document.querySelector("#update-content").value;
    const response = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, content })
    });
    const result = await response.json();
    if (response.ok) {
      alert(Object.values(result)[0]);
      location.reload();
    } else {
      alert(Object.values(result)[0]);
      location.reload();
    }
  } catch (error) {
    console.error(error);
  }
});

const postDeleteButton = document.querySelector("#postDelete");

// 게시글 삭제 버튼에 이벤트 추가
postDeleteButton.addEventListener("click", async e => {
  console.log("삭제 버튼 클릭됨");
  try {
    const isDelete = confirm("정말 삭제하시겠습니까?");
    if (!isDelete) return;

    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE"
    });
    if (response.ok) {
      const data = await isLoggedIn();
      window.location.href = `/profile/${data.user.id}`;
    } else {
      const result = await response.json();
      console.error(result.errorMessage);
    }
  } catch (error) {
    console.error(error);
  }
});

// 게시물 상세 조회
async function getPosts() {
  try {
    const response = await fetch(`/api/posts/${postId}`);
    const result = await response.json();
    if (!response.ok) {
      window.alert("게시글을 찾을 수 없습니다.");
      window.location.href = "/";
      return console.log(result.errorMessage);
    }

    const { post } = result;

    // if 작성 날짜 추가 시, 년월일만을 createdAt에 할당
    // const createdAt = post.createdAt.split("T")[0];

    const contentWrapper = document.querySelector(".content");

    const postHtml = `<div class="card">
                      <h2>${post.title}</h2>
                      <h4>${post.nickname}</h4>
                      <p>${post.content}</p>
                    </div>`;
    contentWrapper.innerHTML = postHtml;
  } catch (error) {
    console.log(error);
  }
}
getPosts();

// 좋아요 조회
async function getLikes() {
  const like = document.querySelector(".like");

  try {
    const response = await fetch(`/api/likes/${postId}`);
    const result = await response.json();
    if (result.errorMessage) {
      return console.log(result.errorMessage);
    }
    console.log(`result : ${result}`);
    console.log(result.data);
    // 조회가 되는가? 유저가 이 게시물에 좋아요를 눌렀는가?
    if (result.data) {
      like.classList.remove("liked");
    }
  } catch (error) {
    console.log(error);
  }
}

getLikes();
