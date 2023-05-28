import { useLoaderData } from "react-router-dom";
import { LoaderPlaylist } from "../utils/types";
import PlaylistCard from "../components/PlaylistCard";

export default function Search() {
    const data = useLoaderData() as LoaderPlaylist;

    return (
        <div className="flex justify-evenly flex-wrap">
            {data.playlists.map((playlist) => <PlaylistCard playlist={playlist} />)}
        </div>
    )
}