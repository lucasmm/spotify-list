import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      searchArtist: "Search artist...",
      followers: "Followers",
      genres: "Genres",
      fetchError: "Error loading data.",
      typeNameToStart: "Type an artist name to start searching.",
      emptyData: "No artists found. Try a different search.",
      dark: "Dark",
      light: "Light",
      system: "System",
    },
  },
  pt: {
    translation: {
      searchArtist: "Pesquisar artista...",
      followers: "Seguidores",
      genres: "Gêneros",
      fetchError: "Erro ao carregar os dados.",
      typeNameToStart: "Digite o nome de um artista para começar a pesquisa.",
      emptyData: "Nenhum artista encontrado. Tente uma pesquisa diferente.",
      dark: "Escuro",
      light: "Claro",
      system: "Sistema",
    },
  },
};

i18n.use(initReactI18next).init({
  fallbackLng: "pt",
  lng: "pt",
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
