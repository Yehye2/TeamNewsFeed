export async function isLoggedIn() {
  try {
    const response = await fetch("/api/check-login");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

export async function updateLoginStatus() {
  const result = await isLoggedIn(); // 로그인 상태 확인
  const loginStatusElement = document.getElementById("loginStatus");
  if (result.isLoggedIn) {
    loginStatusElement.textContent = "로그인 완료";
  } else {
    loginStatusElement.textContent = "로그인 안됨";
  }
}
