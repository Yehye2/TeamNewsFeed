const postUpdateButton = document.getElementById("postUpdate");
const postUpdateModal = document.getElementById("postUpdateModal");
const updateForm = document.getElementById("updateForm");
const updateTitleInput = document.getElementById("updateTitle");
const updateContentInput = document.getElementById("updateContent");

postUpdateButton.addEventListener("click", e => {
  postUpdateModal.style.display = "block";
});

updateForm.addEventListener("submit", async e => {
  e.preventDefault();

  const url = window.location.pathname;
  const postId = url.split("/posts/")[1];
  const title = updateTitleInput.value;
  const content = updateContentInput.value;

  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, content })
    });

    if (response.ok) {
      // 수정 성공 시 처리
      // 예를 들어, 성공 메시지 표시하거나 수정된 게시글로 리다이렉트하는 등의 동작 수행
      console.log("게시글이 성공적으로 수정되었습니다.");
    } else {
      // 수정 실패 시 처리
      // 예를 들어, 에러 메시지 표시하거나 실패 상황에 대한 처리 수행
      console.log("게시글 수정에 실패했습니다.");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
});

// 게시물 상세 조회
async function getPosts() {
  const url = window.location.pathname;
  const postId = url.split("/posts/")[1];
  const response = await fetch(`/api/posts/${postId}`);
  const { post } = await response.json();

  const contentWrapper = document.querySelector(".content");

  const postHtml = `<div class="card">
                      <h2>${post.title}</h2>
                      <h4>${post.nickname}</h4>
                      <p>${post.content}</p>
                    </div>`;
  contentWrapper.innerHTML = postHtml;
}

getPosts();