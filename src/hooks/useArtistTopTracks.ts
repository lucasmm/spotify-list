import { useQuery } from "@tanstack/react-query";
import { getArtistTopTracks } from "../services/api";

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  disc_number: number;
  artists: Array<{
    id: string;
    name: string;
    external_urls: {
      spotify: string;
    };
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    release_date: string;
    album_type: string;
  };
  external_urls: {
    spotify: string;
  };
  uri: string;
  href: string;
}

interface ArtistTopTracksResponse {
  tracks: Track[];
}

export const useArtistTopTracks = (
  artistId: string,
  enabled: boolean = true,
) => {
  return useQuery<ArtistTopTracksResponse, Error>({
    queryKey: ["artistTopTracks", artistId],
    queryFn: () => getArtistTopTracks(artistId),
    enabled: enabled && !!artistId,
  });
};
