export async function registerUser(userName: string, email: string, password: string) {
    return await fetch("https://myproject24.ru/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName,
          email,
          password
        })
      });
}