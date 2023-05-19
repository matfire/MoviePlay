import { useEffect } from "react";
import { account } from "../utils/appwrite";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSetAtom } from "jotai";
import userAtom from "../atoms/userAtom";

export default function Logout() {
  const navigate = useNavigate();
  const setUser = useSetAtom(userAtom);
  useEffect(() => {
    const logout = async () => {
      await account.deleteSession("current");
      toast.success("See you, space cowboy");
      setUser(null);
      navigate("/");
    };
    logout();
  }, []);

  return (
    <div>
      <p>logging you out</p>
    </div>
  );
}
