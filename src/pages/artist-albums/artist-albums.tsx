import { useParams } from "react-router";
import Albums from "./components/albums";
import Header from "./components/header";
import TopTracks from "./components/top-tracks";

export default function ArtistAlbums() {
  const { artistId } = useParams<{
    artistId: string;
  }>();

  return (
    <div className="flex flex-col gap-4">
      <Header artistId={artistId!} />

      <TopTracks artistId={artistId!} />

      <Albums artistId={artistId!} />
    </div>
  );
}
