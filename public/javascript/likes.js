const url = window.location.pathname;
const postId = url.split("/posts/")[1];

const like = document.querySelector(".like");
like.addEventListener("click", async e => {
  try {
    // class에 liked가 있으면 좋아요 삭제
    if (e.target.classList.contains("liked")) {
      const response = await fetch(`/api/${postId}/unlike`, {
        method: "DELETE"
      });
      const result = await response.json();
      if (result.errorMessege) {
        return console.log(result.errorMessage);
      } else {
        console.log(result.message);
        e.target.classList.toggle("liked");
      }
    } else {
      // class에 liked가 없으면 좋아요 추가
      const response = await fetch(`/api/${postId}/like`, {
        method: "POST"
      });
      const result = await response.json();
      if (result.errorMessage) {
        return console.log(result.errorMessage);
      } else {
        e.target.classList.toggle("liked");
      }
    }
  } catch (error) {
    console.log(error);
  }
});
