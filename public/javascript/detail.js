const postUpdateButton = document.getElementById("postUpdate");
const postUpdateModal = document.getElementById("postUpdateModal");
const updateForm = document.getElementById("updateForm");
const updateTitleInput = document.getElementById("updateTitle");
const updateContentInput = document.getElementById("updateContent");
const updateButton = document.getElementById("updateButton");

postUpdateButton.addEventListener("click", e => {
  postUpdateModal.style.display = "block";
});

updateButton.addEventListener("click", async e => {
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
      console.log("게시글이 성공적으로 수정되었습니다.");
      location.reload();
    } else {
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