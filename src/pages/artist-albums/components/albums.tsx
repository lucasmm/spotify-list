import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtistAlbums } from "@/hooks/useArtistAlbums";
import { ChevronLeft, ChevronRight, CircleX } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import dayjs from "dayjs";

type AlbumsProps = {
  artistId: string;
};

type Album = {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  release_date: string;
  total_tracks: number;
  album_type: string;
};

const AlbumsTitle = () => (
  <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
    Albums
  </h2>
);

const AlbumSkeleton = () => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
    <Skeleton className="h-64 w-full" />
    <div className="space-y-2 p-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  </div>
);

const AlbumCard = ({ album }: { album: Album }) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
    {album.images[0] && (
      <img
        src={album.images[0].url}
        alt={album.name}
        className="h-64 w-full object-cover"
        loading="lazy"
      />
    )}
    <div className="space-y-2 p-4">
      <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
        {album.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Lançamento: {dayjs(album.release_date).format("DD/MM/YYYY")}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Faixas: {album.total_tracks}
      </p>
      <p className="text-sm text-gray-600 capitalize dark:text-gray-300">
        Tipo: {album.album_type}
      </p>
    </div>
  </div>
);

const LoadingState = ({
  albumRef,
}: {
  albumRef: React.RefObject<HTMLDivElement | null>;
}) => (
  <div ref={albumRef}>
    <AlbumsTitle />
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, id) => (
        <AlbumSkeleton key={id} />
      ))}
    </div>
  </div>
);

const ErrorState = () => (
  <div>
    <AlbumsTitle />
    <Alert variant="destructive">
      <CircleX />
      <AlertTitle>Erro ao recuperar os álbuns</AlertTitle>
    </Alert>
  </div>
);

const EmptyState = () => (
  <p className="py-8 text-center text-gray-500 dark:text-gray-400">
    Nenhum álbum encontrado para este artista.
  </p>
);

const PaginationControls = ({
  page,
  hasNext,
  hasPrevious,
  onPageChange,
}: {
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}) => (
  <div className="mt-8 flex items-center justify-center gap-4">
    <Button
      variant="outline"
      onClick={() => onPageChange(page - 1)}
      disabled={!hasPrevious}
      aria-label="Previous page"
    >
      <ChevronLeft />
      Voltar
    </Button>
    <Button
      variant="outline"
      onClick={() => onPageChange(page + 1)}
      disabled={!hasNext}
      aria-label="Next page"
    >
      Próximo
      <ChevronRight />
    </Button>
  </div>
);

export default function Albums({ artistId }: AlbumsProps) {
  const albumRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const page = Math.max(0, Number(searchParams.get("page")) || 0);

  const {
    data: albums,
    isLoading,
    error,
    refetch,
  } = useArtistAlbums(artistId, page);

  const goToPage = useCallback(
    (newPage: number) => {
      if (albumRef.current) {
        albumRef.current.scrollIntoView({ behavior: "smooth" });
      }
      navigate(`${location.pathname}?page=${newPage}`);
    },
    [navigate, location.pathname],
  );

  useEffect(() => {
    refetch();
  }, [searchParams, refetch]);

  if (error) {
    return <ErrorState />;
  }

  if (isLoading) {
    return <LoadingState albumRef={albumRef} />;
  }

  const hasAlbums = albums?.items && albums.items.length > 0;

  return (
    <div ref={albumRef}>
      <AlbumsTitle />
      {hasAlbums ? (
        <div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {albums.items.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>

          <PaginationControls
            page={page}
            hasNext={!!albums.next}
            hasPrevious={!!albums.previous}
            onPageChange={goToPage}
          />
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
