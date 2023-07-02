async function createPost() {
  try {
    const nickname = document.getElementById("nickname").value;
    const comment = document.getElementById("comment").value;
    const data = {
      nickname,
      comment
    };
    await fetch("/api/comments", {
      method: "COMMENT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    location.reload();
  } catch (error) {
    console.error(error);
  }
}
