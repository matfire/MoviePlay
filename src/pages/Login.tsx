import { account } from "../utils/appwrite";

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <p>Login page content</p>
      <button
        onClick={() =>
          account.createOAuth2Session(
            "google",
            `${import.meta.env.VITE_APP_URL}/auth/callback`
          )
        }
      >
        Google
      </button>
    </div>
  );
}
