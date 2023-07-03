import { isLoggedIn } from "./isLoggedIn.js";

export default function myPage() {
  const myPageButton = document.querySelector("#my-page");

  myPageButton.addEventListener("click", async e => {
    try {
      const result = await isLoggedIn();

      if (result.errorMessage) {
        window.location.href = `/login`;
      } else {
        window.location.href = `/profile/${result.user.id}`;
      }
    } catch (error) {
      console.log(error);
    }
  });
}
