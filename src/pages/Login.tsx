import { account } from "../utils/appwrite";
import { Icon } from "@iconify/react";

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
        className="btn btn-primary gap-2"
      >
        <Icon icon="devicon:google" className="text-lg" />
        Google
      </button>
    </div>
  );
}
