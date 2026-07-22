export async function loginAPI(email: string, password: string){
  return await fetch("https://myproject24.ru/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
      );
}