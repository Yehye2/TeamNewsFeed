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

// 수정 모달 닫기
postUpdateModalClose.addEventListener("click", () => {
  postUpdateModal.classList.replace("show", "d-none");
});

// 수정 모달폼 - 수정하기 버튼
//TODO: 모달 수정버튼 요소 교체
modalUpdateButton = document.querySelector("#modalUpdateButton");

modalUpdateButton.addEventListener("click", async e => {
  console.log("수정 로직 실행");
  try {
    // TODO: title, content 요소 교체
    const title = document.querySelector("#update-title").value;
    const content = document.querySelector("#update-content").value;
    console.log(`title: ${title}`);
    console.log(title);
    console.log(`content: ${content}`);
    const response = await fetch(`/api/posts/${postId}`, {
      // put? patch?
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, content })
    });
    const result = await response.json();
    if (response.ok) {
      console.log(result.message);
      location.reload();
    } else {
      console.log(result.errorMessage);
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
      // TODO: 삭제 성공시 개인페이지로 리디렉션
      console.log("게시글이 삭제되었습니다.");
      window.location.href = "/login";
    } else {
      const result = await response.json();
      console.error(result.errorMessage);
    }
  } catch (error) {
    console.error(error);
  }
});

// // 모달 외부 클릭 시 모달 닫기
// window.addEventListener("click", e => {
//   if (e.target === postUpdateModal) {
//     postUpdateModal.style.display = "none";
//   }
// });

// 게시물 상세 조회
async function getPosts() {
  const response = await fetch(`/api/posts/${postId}`);
  const { post } = await response.json();
  // if 작성 날짜 추가 시, 년월일만을 createdAt에 할당
  // const createdAt = post.createdAt.split("T")[0];

  const contentWrapper = document.querySelector(".content");
  // const postTitle = document.querySelector("#post-title");
  // const postNickname = document.querySelector("#post-nickname");

  const postHtml = `<div class="card">
                      <h2>${post.title}</h2>
                      <h4>${post.nickname}</h4>
                      <p>${post.content}</p>
                    </div>`;
  contentWrapper.innerHTML = postHtml;
}
getPosts();
