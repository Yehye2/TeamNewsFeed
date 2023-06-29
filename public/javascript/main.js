const searchBooks = () => {
  var query = document.getElementById("searchInput").value;
  console.log("query = ", query);
  var url = "/search?q=" + encodeURIComponent(query);
  console.log("url = ", url);
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (books) {
      // console.log("books = ", books);
      var resultsContainer = document.getElementById("searchResults");
      resultsContainer.innerHTML = "";
      console.log("resultsContainer = ", resultsContainer);
      books.forEach(x => {
        console.log(x);
        const searchResults = document.createElement("div");
        searchResults.innerHTML = `<div class="list-item">
                                    <div class="img-box">
                                      <img class="book-img" src="${x.cover}" alt="" srcset="">
                                    </div>
                                  </div>`;
        resultsContainer.append(searchResults);
      });
      if (!books && books.length < 0) {
        var noResultsMessage = document.createElement("p");
        noResultsMessage.className = "no-results";
        noResultsMessage.textContent = "찾을 수 없습니다.";
        resultsContainer.appendChild(noResultsMessage);
      }
    })
    .catch(function (error) {
      console.error("Error searching books:", error);
    });
};

function displayBestsellers() {
  console.log("displayBestsellers");
  const bestsellersList = document.getElementById("bestsellersList");

  fetch("/bestsellers")
    .then(function (response) {
      return response.json();
    })
    .then(function (bestsellers) {
      if (bestsellers && bestsellers.length > 0) {
        bestsellers.map(x => {
          const bestsellerItem = document.createElement("div");
          console.log(x);
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
  fetch("/posts")
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      const { posts } = response;
      console.log("posts = ", posts);
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
      if (posts) {
        // for (var i = 0; i < posts.length; i++) {
        //   var post = posts[i];
        //   var postContainer = document.createElement("div");
        //   postContainer.className = "post-container";
        //   var postTitle = document.createElement("h3");
        //   postTitle.className = "post-title";
        //   postTitle.textContent = post.title;
        //   var postContent = document.createElement("p");
        //   postContent.className = "post-content";
        //   postContent.textContent = post.content;
        //   postContainer.appendChild(postTitle);
        //   postContainer.appendChild(postContent);
        //   postsList.appendChild(postContainer);
        // }
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
displayPosts();