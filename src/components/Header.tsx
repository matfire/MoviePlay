import { useAtomValue } from "jotai";
import userAtom from "../atoms/userAtom";
import { avatars } from "../utils/appwrite";
import { NavLink } from "react-router-dom";

export default function Header() {
  const user = useAtomValue(userAtom);

  return (
    <header>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost normal-case text-xl">
            MoviePlay
          </NavLink>
        </div>
        <div className="flex-none gap-2">
          {user && (
            <NavLink
              to="/playlist/new"
              className="btn btn-ghost btn-sm rounded-btn"
            >
              New Playlist
            </NavLink>
          )}
          {!user && (
            <NavLink to="/login" className="btn btn-ghost btn-sm rounded-btn">
              Login
            </NavLink>
          )}
          {user && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={avatars.getInitials().toString()} alt="initials" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <NavLink to="/logout">Logout</NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}