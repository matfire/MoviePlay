import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { account } from "../utils/appwrite";
import { useSetAtom } from "jotai";
import userAtom from "../atoms/userAtom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useSetAtom(userAtom);
  useEffect(() => {
    const login = async () => {
      try {
        const u = await account.get();
        setUser(u);
        toast.success(`Welcome back, ${u.name}!}`);
        navigate("/");
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
        navigate("/login");
      }
    };
    login();
  }, []);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-2xl">Welcome!</h1>
      <p>we're finishing signing you in, please wait...</p>
    </div>
  );
}
