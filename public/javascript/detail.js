const postUpdateButton = document.getElementById("postUpdate");
const postUpdateModal = document.getElementById("postUpdateModal");

postUpdateButton.addEventListener("click", e => {
  postUpdateModal.style.display = "block";

  //이벤트 테스트
  let postId = 13;
  window.location.href = `/posts/${postId}`;
});

const postDeleteButton = document.getElementById("postDelete");

postDeleteButton.addEventListener("click", async e => {
  //이벤트 테스트
  let postId = 5;
  window.location.href = `/posts/${postId}`;

  // try {
  //   const response = await fetch("/api/posts/${postId}", {
  //     method: "DELETE"
  //   });
  // } catch (error) {}
});

// // 모달 닫기 버튼 클릭 시 모달 닫기
// postUpdateModalClose.addEventListener("click", () => {
//   postUpdateModal.style.display = "none";
// });

// // 모달 외부 클릭 시 모달 닫기
// window.addEventListener("click", e => {
//   if (e.target === postUpdateModal) {
//     postUpdateModal.style.display = "none";
//   }
// });

// 게시물 상세 조회
async function getPosts() {
  const url = window.location.pathname;
  const postId = url.split("/posts/")[1];
  const response = await fetch(`/api/posts/${postId}`);
  const { post } = await response.json();
  // 작성 날짜 추가 시, 년월일만을 createdAt에 할당
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
