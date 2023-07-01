function allUsers() {
  try {
    console.log("모든 유저 가져오기");
    fetch("api/users/all-users")
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        const userList = document.getElementById("user-list");
        const { usersData } = response;
        console.log("users = ", usersData);
        if (usersData) {
          usersData.forEach(x => {
            console.log(x);
            // console.log(x)
            const userCard = document.createElement("div");
            userCard.innerHTML = `<div class="item" >
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
            userList.append(userCard);
          });
        } else {
          var noPostsMessage = document.createElement("li");
          noPostsMessage.className = "no-results";
          noPostsMessage.textContent = "게시글이 없습니다.";
          userList.appendChild(noPostsMessage);
        }
      })
      .catch(function (error) {
        console.error("Error fetching posts:", error);
      });
  } catch (error) {
    console.log(error);
  }
}

allUsers();
