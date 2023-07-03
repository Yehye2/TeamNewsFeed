const url = window.location.pathname;
const postId = url.split("/posts/")[1];
const like = document.querySelector(".like");
import { isLoggedIn } from "./isLoggedIn.js";

$(document).ready(() => {
  getAllLike();
});

async function addLike() {
  const response = await fetch(`/api/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    alert("좋아요가 추가되었습니다.");
    like.classList.add("liked");
    like.removeEventListener("click", addLike);
    like.addEventListener("click", deleteLike);
  } else {
    const errorMessage = await response.text();
    alert(`좋아요 추가에 실패했습니다: ${errorMessage}`);
  }
}

like.addEventListener("click", addLike);

async function getAllLike() {
  const data = await isLoggedIn();
  const userId = data.user.id;
  const response = await fetch(`/api/likes/${postId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    const data = await response.json();
    const result = data.data;
    const userLikesPost = result.some(item => item.UserId === userId);

    if (userLikesPost) {
      like.classList.add("liked");
      like.removeEventListener("click", addLike);
      like.addEventListener("click", deleteLike);
    }
  } else {
    const errorMessage = await response.text();
    console.log(`좋아요 조회에 실패했습니다: ${errorMessage}`);
  }
}

async function deleteLike() {
  const response = await fetch(`/api/${postId}/unlike`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    alert("좋아요가 삭제되었습니다.");
    like.classList.remove("liked");
    like.removeEventListener("click", deleteLike);
    like.addEventListener("click", addLike);
  } else {
    const errorMessage = await response.text();
    alert(`좋아요 삭제에 실패했습니다: ${errorMessage}`);
  }
}
