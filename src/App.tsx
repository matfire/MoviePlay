import { Outlet, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import userAtom from "./atoms/userAtom";
import { account } from "./utils/appwrite";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

function App() {
  const setUser = useSetAtom(userAtom);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const u = await account.get();
        setUser(u);
      } catch (error) {
        setUser(null);
      }
    };
    getCurrentUser();
  }, []);
  return (
    <>
      <Header />
      {searchParams.get("error") && (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{searchParams.get("error")}</span>
          </div>
        </div>
      )}
      <Toaster />
      <main className="container mx-auto">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
