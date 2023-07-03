$(document).ready(() => {
  getAllComments();
});

async function createComment() {
  try {
    const comment = document.getElementById("comment").value;
    // 페이지 url에서 postId 추출
    const url = window.location.pathname;
    const postId = url.split("/posts/")[1];
    if (!comment) {
      alert("alert");
    }

    const data = {
      comment
    };
    console.log(data);
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    // 전달받은 값에 벨류 값을 얼럿으로 띄움
    alert(Object.values(responseData)[0]);
    // 새로고침
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}

const saveCommentBtn = document.getElementById("save-comment");
saveCommentBtn.addEventListener("click", createComment);

async function getAllComments() {
  try {
    // 페이지 url에서 postId 추출
    const url = window.location.pathname;
    const postId = url.split("/posts/")[1];

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const responseData = await response.json();
    responseData.data.forEach(item => {
      let comment = item.comment;

      let temp_html = ` <div class="comment-container">
                          <div class="comment-text">${comment}</div>
                        </div>`;
      $(".all-comments").append(temp_html);
    });
  } catch (error) {
    console.error(error);
  }
}
