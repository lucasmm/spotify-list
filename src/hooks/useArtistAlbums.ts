import { useQuery } from "@tanstack/react-query";
import { getArtistAlbums } from "../services/api";

interface Album {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  album_type: string;
  album_group: string;
  artists: Array<{
    id: string;
    name: string;
    external_urls: {
      spotify: string;
    };
  }>;
  external_urls: {
    spotify: string;
  };
  available_markets: string[];
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export const useArtistAlbums = (
  artistId: string,
  page: number = 0,
  enabled: boolean = true,
) => {
  return useQuery<PaginatedResponse<Album>, Error>({
    queryKey: ["artistAlbums", artistId],
    queryFn: () => getArtistAlbums(artistId, page),
    enabled: enabled && !!artistId,
  });
};
