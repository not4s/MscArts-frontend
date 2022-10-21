export default function authHeader() {
  const user = JSON.parse(sessionStorage.getItem("token"));

  if (user && user.accessToken) {
    return { Authorization: "Bearer " + user.accessToken };
  } else {
    return {};
  }
}
