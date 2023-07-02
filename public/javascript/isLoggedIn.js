export default async function isLoggedIn() {
  try {
    const response = await fetch("/api/check-login");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}
