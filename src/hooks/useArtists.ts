import { useQuery } from "@tanstack/react-query";
import { getArtists } from "../services/api";
import { useEffect, useState } from "react";

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
}

interface ArtistsResponse {
  artists: {
    items: Artist[];
    total: number;
    limit: number;
    offset: number;
  };
}

export const useArtists = (query: string, enabled: boolean = true) => {
  return useQuery<ArtistsResponse, Error>({
    queryKey: ["artists", query],
    queryFn: () => getArtists(query),
    enabled: enabled && query.length > 0,
  });
};

export const useDebouncedArtists = (query: string, delay: number = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return useArtists(debouncedQuery, debouncedQuery.length > 0);
};
