import { useAtomValue } from "jotai";
import userAtom from "../atoms/userAtom";
import { avatars } from "../utils/appwrite";
import { NavLink, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";

export default function Header() {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  const {register, handleSubmit} = useForm();

  const onSearch = (data: FieldValues) => {
    navigate(`/search?query=${data.search}`);
  };

  return (
    <header>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost normal-case text-xl">
            MoviePlay
          </NavLink>
        </div>
        <div className="flex-none gap-2">
          <form className="flex" onSubmit={handleSubmit(onSearch)}>
            <div className="form-control">
              <input className="input input-bordered" type="search" {...register("search", {required:true})} placeholder="search..."/>
            </div>
          </form>
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
                  <NavLink to="/profile">Profile</NavLink>
                </li>
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
