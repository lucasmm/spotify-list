import { Routes, Route } from "react-router";
import AuthProvider from "./providers/auth-provider";
import Home from "./pages/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ArtistAlbums from "./pages/artist-albums";
import Layout from "./components/layout";
import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/artist/:artistId" element={<ArtistAlbums />} />
              <Route path="/auth" element={<>Carregando...</>} />
            </Route>
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
