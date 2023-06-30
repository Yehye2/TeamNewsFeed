function isLoggedIn() {
  const token = getCookie('authorization');
  return token !== null;
}

function getCookie(name) {
  const cookies = document.cookie;
  const cookieList = cookies.split(';');

  for (let i = 0; i < cookieList.length; i++) {
    const cookie = cookieList[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

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
        bestsellers.map(x => {
          const bestsellerItem = document.createElement("div");
          bestsellerItem.innerHTML = `<div class="list-item">
                                        <div class="img-box">
                                          <img class="book-img" src="${x.cover}" alt="" srcset="">
                                        </div>
                                      </div>`;
          bestsellersList.append(bestsellerItem);
        });
      } else {
        var noBestsellersMessage = document.createElement("li");
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
        posts.forEach(x => {
          console.log(x);
          const postResult = document.createElement("div");
          postResult.innerHTML = `<div class="item" >
                                    <div class="front">
                                      <img
                                        src=""
                                        alt=""
                                        onerror="src='https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'"
                                      />
                                    </div>
                                    <div class="movie-info">
                                      <h2>${x.title}</h2>
                                      <h3>${x.nickname}</h3>
                                    </div>
                                  </div>`;
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

function displayFollowingPosts() {
  var postsList = document.getElementById('posts-list');

  fetch('/api/users/:userId/following-posts')
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      var posts = result.posts;
      console.log(posts);
      if (posts && posts.length > 0) {
        for (var i = 0; i < posts.length; i++) {
          var post = posts[i];

          var postContainer = document.createElement('div');
          postContainer.className = 'post-container';

          var postTitle = document.createElement('h3');
          postTitle.className = 'post-title';
          postTitle.textContent = post.title;

          var postContent = document.createElement('p');
          postContent.className = 'post-content';
          postContent.textContent = post.content;

          postContainer.appendChild(postTitle);
          postContainer.appendChild(postContent);

          postsList.appendChild(postContainer);
        }
      } else {
        var noPostsMessage = document.createElement('p');
        noPostsMessage.className = 'no-results';
        noPostsMessage.textContent = '게시글이 없습니다.';

        postsList.appendChild(noPostsMessage);
      }
    })
    .catch(function (error) {
      console.error('게시글 가져오기 오류:', error);
    });
}

searchBooks();
displayBestsellers();
function initializePage() {
  if (isLoggedIn()) {
    displayFollowingPosts(); // 로그인 상태인 경우 displayFollowingPosts() 실행
  } else {
    displayPosts(); // 비로그인 상태인 경우 displayPosts() 실행
  }
}

initializePage();