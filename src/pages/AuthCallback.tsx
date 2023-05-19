import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    toast.success("Welcome back!");
    navigate("/");
  }, []);
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-2xl">Welcome!</h1>
      <p>we're finishing signing you in, please wait...</p>
    </div>
  );
}
