import { useQuery } from "@tanstack/react-query";
import { getArtist } from "../services/api";

interface Artist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
  genres: string[];
  popularity: number;
  external_urls: {
    spotify: string;
  };
  type: string;
  uri: string;
  href: string;
}

export const useArtist = (artistId: string, enabled: boolean = true) => {
  return useQuery<Artist, Error>({
    queryKey: ["artist", artistId],
    queryFn: () => getArtist(artistId),
    enabled: enabled && !!artistId,
  });
};
