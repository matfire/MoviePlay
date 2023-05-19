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
    <div>
      <h1>AuthCallback</h1>
      <p>AuthCallback page content</p>
    </div>
  );
}
