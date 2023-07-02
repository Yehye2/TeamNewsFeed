import isLoggedIn from "./isLoggedIn.js";
import myPage from "./myPageButton.js";
myPage();

async function updateLoginStatus() {
  const data = await isLoggedIn(); // 로그인 상태 확인
  const loggedIn = data.isLoggedIn; // 로그인 상태 확인
  const loginStatusElement = document.getElementById("loginStatus");
  if (loggedIn) {
    loginStatusElement.textContent = "로그인 완료";
  } else {
    loginStatusElement.textContent = "로그인 안됨";
  }
}
updateLoginStatus();

const searchBooks = () => {
  const query = document.getElementById("searchInput").value;
  const url = "/search?q=" + encodeURIComponent(query);
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (books) {
      const resultsContainer = document.getElementById("searchResults");
      if (books.message === "No books found.") {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.className = "no-results";
        noResultsMessage.textContent = "찾을 수 없습니다.";
        resultsContainer.appendChild(noResultsMessage);
      } else {
        resultsContainer.innerHTML = "";
        console.log("resultsContainer = ", resultsContainer);
        books.forEach(x => {
          const searchResults = document.createElement("div");
          searchResults.innerHTML = `<div class="list-item">
                                      <div class="img-box">
                                        <img class="book-img" src="${x.cover}" alt="" srcset="">
                                      </div>
                                    </div>`;
          resultsContainer.append(searchResults);
        });
      }
    })
    .catch(function (error) {
      console.error("Error searching books:", error);
    });
};
function displayBestsellers() {
  const bestsellersList = document.getElementById("bestsellersList");
  fetch("/bestsellers")
    .then(function (response) {
      return response.json();
    })
    .then(function (bestsellers) {
      if (bestsellers && bestsellers.length > 0) {
        bestsellers.forEach(book => {
          const bestsellerItem = document.createElement("div");
          bestsellerItem.innerHTML = `<div class="list-item">
                                        <div class="img-box">
                                          <a href="${book.link}" target="_blank">
                                            <img class="book-img" src="${book.cover}" alt="" srcset="">
                                          </a>
                                        </div>
                                      </div>`;
          bestsellersList.append(bestsellerItem);
        });
      } else {
        const noBestsellersMessage = document.createElement("li");
        noBestsellersMessage.className = "bestsellers-item";
        noBestsellersMessage.textContent = "찾을 수 없습니다.";
        bestsellersList.appendChild(noBestsellersMessage);
      }
    })
    .catch(function (error) {
      console.error("Error fetching bestsellers:", error);
    });
}

function displayPosts() {
  const postsList = document.getElementById("posts-list");
  console.log("postsList = ", postsList);
  fetch("api/posts")
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      const { posts } = response;
      if (posts) {
        posts.forEach(post => {
          console.log(post);
          // console.log(x)
          const postResult = document.createElement("div");
          postResult.innerHTML = `<div class="item" >
                                    <div class="front">
                                      <img
                                        src="${post.img}"
                                        alt=""
                                        onerror="src='https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'"
                                      />
                                    </div>
                                    <div class="movie-info">
                                      <h2>${post.title}</h2>
                                      <h3 data-user-id=${post.UserId} >${post.nickname}</h3>
                                    </div>
                                  </div>`;
          postResult.addEventListener("click", function (e) {
            if (e.target.hasAttribute("data-user-id")) {
              window.location.href = `/${post.UserId}`;
            } else {
              window.location.href = `/posts/${post.postId}`;
            }
            // 이미지 클릭 시 상세 페이지로 이동하는 로직을 작성합니다.
          });
          postsList.append(postResult);
        });
      } else {
        var noPostsMessage = document.createElement("li");
        noPostsMessage.className = "no-results";
        noPostsMessage.textContent = "게시글이 없습니다.";
        postsList.appendChild(noPostsMessage);
      }
    })
    .catch(function (error) {
      console.error("Error fetching posts:", error);
    });
}

async function displayFollowingPosts() {
  const postsList = document.getElementById("posts-list");
  //const loggedIn = await isLoggedIn(); // 로그인 상태 확인
  let data = await isLoggedIn();
  let userId = data.user.id;
  console.log("test", userId);

  fetch(`/api/users/${userId}/following-posts`)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      const { posts } = response;
      if (posts) {
        posts.forEach(x => {
          console.log(x);
          // console.log(x)
          const postResult = document.createElement("div");
          postResult.innerHTML = `<div class="item" >
                                  <div class="front">
                                    <img
                                      src="${x.img}"
                                      alt=""
                                      onerror="src='https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'"
                                    />
                                  </div>
                                  <div class="movie-info">
                                    <h2>${x.title}</h2>
                                    <h3>${x.nickname}</h3>
                                  </div>
                                </div>`;
          postResult.addEventListener("click", function () {
            // 이미지 클릭 시 상세 페이지로 이동하는 로직을 작성합니다.
            window.location.href = `/posts/${x.postId}`;
          });
          postsList.append(postResult);
        });
      } else {
        var noPostsMessage = document.createElement("li");
        noPostsMessage.className = "no-results";
        noPostsMessage.textContent = "게시글이 없습니다.";
        postsList.appendChild(noPostsMessage);
      }
    })
    .catch(function (error) {
      console.error("Error fetching posts:", error);
    });
}

searchBooks();
displayBestsellers();
async function initializePage() {
  const loggedIn = await isLoggedIn(); // 로그인 상태 확인
  console.log(loggedIn);
  if (loggedIn) {
    displayFollowingPosts(); // 로그인 상태인 경우 displayFollowingPosts() 실행
  } else {
    displayPosts(); // 비로그인 상태인 경우 displayPosts() 실행
  }
}

initializePage();
