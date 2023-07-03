// 회원가입 모달 관련 코드
const signupButton = document.getElementById("signup-button");
const signupModal = document.getElementById("signup-modal");
const signupModalClose = document.getElementById("signup-modal-close");
const signupForm = document.getElementById("signup-form");

// 회원가입 버튼 클릭 시 모달 표시
signupButton.addEventListener("click", () => {
  signupModal.style.display = "block";
});

// 모달 닫기 버튼 클릭 시 모달 닫기
signupModalClose.addEventListener("click", () => {
  signupModal.style.display = "none";
});

// 모달 외부 클릭 시 모달 닫기 <= 거슬려서 일단 주석
// window.addEventListener("click", e => {
//   if (e.target === signupModal) {
//     signupModal.style.display = "none";
//   }
// });

// 회원가입 폼 제출 시 처리
signupForm.addEventListener("submit", async e => {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const nickname = document.getElementById("signup-nickname").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;

  // 서버로 회원가입 폼 데이터 전송 및 처리
  try {
    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, nickname, password, confirmPassword, verifiedEmail })
    });

    if (response.ok) {
      alert("회원가입 성공.");
      location.reload();
      // 회원가입 성공 시 원하는 동작 수행
    } else {
      const errorData = await response.json();
      console.error(errorData.errorMessage);

      const errMessage = document.querySelector("#errMessage");
      errMessage.innerText = errorData.errorMessage;
      errMessage.style.color = "red";
    }
  } catch (error) {
    console.error("회원가입에 실패했습니다.", error);
  }
});

// 로그인 폼 처리 코드는 그대로 유지합니다.
document.getElementById("login-form").addEventListener("submit", async e => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (result.message) {
      window.location.href = "/"; // 로그인 성공 후 이동할 페이지의 경로
    } else {
      window.alert(`${result.errorMessage}`);
      console.error(result.errorMessage);
    }
  } catch (error) {
    console.error("로그인에 실패했습니다.", error);
  }
});

// 이메일 전송 로직
let auhNum;
let verifiedEmail = 0;

const emailAuthButton = document.querySelector("#emailAuthButton");
emailAuthButton.addEventListener("click", async e => {
  try {
    const email = document.getElementById("signup-email").value;
    const authNumform = document.getElementById("email-auth");
    const emailHelp = document.getElementById("emailHelp");

    const response = await fetch("/api/auth/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const result = await response.json();
    //   이메일 형식이 틀리면?
    if (result.errorMessage) {
      // 인증코드 입력칸 아래에 메시지를 나타내는 태그가 보이도록한다.
      emailHelp.style.color = "red";
      emailHelp.innerText = result.errorMessage;
      emailHelp.style.display = "block";
      return;
    }
    // 이메일 보내기에 성공하면 프론트로 코드를 보낸다.그리고 인증코드 입력칸을 보이게 한다. 그리고 '인증코드가 입력된 이메일로 전송되었습니다.'
    auhNum = result.authNum;
    authNumform.classList.replace("d-none", "show");

    emailAuthButton.classList.toggle("invisible");
    emailHelp.innerText = "인증코드가 입력된 이메일로 전송되었습니다.";
    emailHelp.style.color = "green";
    emailHelp.style.display = "block";
  } catch (error) {
    console.error(error);
  }
  // 인증코드 확인
  const submitCodeButton = document.querySelector("#submitCode");
  submitCodeButton.addEventListener("click", e => {
    try {
      const inputCode = document.getElementById("inputCode").value;
      const authNumform = document.getElementById("email-auth");
      const emailHelp = document.getElementById("emailHelp");

      // 인증코드 일치하면 인증코드폼을 감춘다.
      if (inputCode === auhNum) {
        verifiedEmail = 1;
        authNumform.classList.replace("show", "d-none");
        emailHelp.style.color = "green";
        emailHelp.innerText = "인증이 완료되었습니다.";
      } else {
        emailHelp.style.color = "red";
        emailHelp.innerText = "인증코드가 일치하지 않습니다.";
      }
    } catch (error) {
      console.error(error);
    }
  });
});
