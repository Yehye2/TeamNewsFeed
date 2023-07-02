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
            userCard.innerHTML = `<div id="user-list">
                                    <div class="user-card">
                                      <div class="img-box">
                                        <img src="${x.profileImage}" alt="" onerror="src='https://item.kakaocdn.net/do/dc9561970173c28a13654c3f14180b4b617ea012db208c18f6e83b1a90a7baa7'" />
                                      </div>
                                      <h3>${x.nickname}</h3>
                                      <div>
                                        <button onclick="follow(${x.userId})">팔로우</button>
                                        <button onclick="unfollow(${x.userId})">팔로우취소</button>
                                      </div>
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

function follow(userId) {
  console.log("팔로우", userId);
  fetch(`api/users/${userId}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
    })
    .catch(err => console.log(err));
}

function unfollow(userId) {
  console.log("팔로우취소", userId);
  fetch(`api/users/${userId}/unfollow`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
    })
    .catch(err => console.log(err));
}

allUsers();