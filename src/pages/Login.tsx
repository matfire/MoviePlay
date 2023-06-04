import { account } from "../utils/appwrite";
import { Icon } from "@iconify/react";

export default function Login() {
  const login = (provider: string) => {
    account.createOAuth2Session(
      provider,
      `${import.meta.env.VITE_APP_URL}/auth/callback`
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center shadow-md">
      <div className="card shadow-md">
        <div className="card-body">
          <h1 className="card-title">Login</h1>
          <p>Please choose one of the following providers</p>
          <div className="space-x-2">
            <button
              onClick={() => login("google")}
              className="btn btn-primary gap-2"
            >
              <Icon icon="devicon:google" className="text-lg" />
              Google
            </button>
            <button
              onClick={() => login("github")}
              className="btn btn-secondary gap-2"
            >
              <Icon icon="devicon:github" className="text-lg" />
              Github
            </button>
            <button onClick={() => login("discord")} className="btn btn-accent gap-2">
              <Icon icon="skill-icons:discord" className="text-lg" />
              Discord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
