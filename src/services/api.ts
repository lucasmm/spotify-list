import axios from "axios";

const accountsApi = axios.create({
  baseURL: "https://accounts.spotify.com/api",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const defaultApi = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

defaultApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

defaultApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export const getToken = async (data: {
  code: string;
  codeVerifier: string;
}): Promise<{ access_token: string }> => {
  const redirectUri = "https://127.0.0.1:5173/auth";

  const response = await accountsApi.post(
    "token",
    {
      client_id: import.meta.env.VITE_CLIENT_ID,
      grant_type: "authorization_code",
      code: data.code,
      redirect_uri: redirectUri,
      code_verifier: data.codeVerifier,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
};

export const getArtists = async (query: string) => {
  const response = await defaultApi.get("/search", {
    params: {
      q: query,
      type: "artist",
      market: "BR",
    },
  });

  return response.data;
};

export const getArtist = async (id: string) => {
  const response = await defaultApi.get(`/artists/${id}`);

  return response.data;
};

export const getArtistTopTracks = async (id: string) => {
  const response = await defaultApi.get(`/artists/${id}/top-tracks`);

  return response.data;
};

export const getArtistAlbums = async (id: string, offset: number = 0) => {
  const response = await defaultApi.get(`/artists/${id}/albums`, {
    params: {
      limit: 20,
      offset,
    },
  });

  return response.data;
};
