const profileUrl = window.location.pathname;
let userId = profileUrl.split("/profile/")[1];

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
            userCard.innerHTML = `<div id="${x.userId}" >
                                    <div class="user-card">
                                      <div class="img-box">
                                        <img src="${x.profileImage}" alt="" onerror="src='https://item.kakaocdn.net/do/dc9561970173c28a13654c3f14180b4b617ea012db208c18f6e83b1a90a7baa7'" />
                                      </div>
                                      <h3>${x.nickname}</h3>                                      
                                    </div>
                                  </div>`;
            userList.append(userCard);
            userCard.addEventListener("click", e => {
              const userId = userCard.firstChild.id;
              window.location.href = `/profile/${userId}`;
              console.log("userId = ", userId);
            });
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

// allUsers();
