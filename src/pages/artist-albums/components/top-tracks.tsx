import { Alert, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtistTopTracks } from "@/hooks/useArtistTopTracks";
import { CircleX } from "lucide-react";

type TopTracksProps = {
  artistId: string;
};

type Track = {
  id: string;
  name: string;
  popularity: number;
  album: {
    images: Array<{ url: string }>;
  };
};

const TopTracksTitle = () => (
  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
    Principais faixas
  </h2>
);

const TrackSkeleton = () => (
  <div className="flex items-center justify-between rounded-lg border border-gray-200 pr-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
    <div className="flex items-center space-x-3">
      <Skeleton className="h-12 w-12 rounded-l-md" />
      <Skeleton className="h-4 w-[250px]" />
    </div>
    <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
      Popularidade: <Skeleton className="h-4 w-[20px]" />
    </span>
  </div>
);

const TrackCard = ({ track }: { track: Track }) => (
  <div className="flex items-center justify-between rounded-lg border border-gray-200 pr-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
    <div className="flex items-center space-x-3">
      {track.album.images[0]?.url && (
        <img
          src={track.album.images[0].url}
          alt={track.name}
          className="h-12 w-12 rounded-l-md object-cover"
          loading="lazy"
        />
      )}
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {track.name}
      </span>
    </div>
    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
      Popularidade: {track.popularity}
    </span>
  </div>
);

const LoadingState = () => (
  <div className="space-y-4">
    <TopTracksTitle />
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, id) => (
        <TrackSkeleton key={id} />
      ))}
    </div>
  </div>
);

const ErrorState = () => (
  <div>
    <TopTracksTitle />
    <Alert variant="destructive">
      <CircleX />
      <AlertTitle>Erro ao recuperar as faixas do artista.</AlertTitle>
    </Alert>
  </div>
);

const EmptyState = () => (
  <div className="space-y-4">
    <TopTracksTitle />
    <p className="py-8 text-center text-gray-500 dark:text-gray-400">
      No top tracks found for this artist.
    </p>
  </div>
);

const TracksContent = ({ tracks }: { tracks: Track[] }) => (
  <div className="space-y-4">
    <TopTracksTitle />
    <div className="space-y-3">
      {tracks.slice(0, 5).map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  </div>
);

export default function TopTracks({ artistId }: TopTracksProps) {
  const { data: topTracks, isLoading, error } = useArtistTopTracks(artistId);

  if (error) {
    return <ErrorState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  const hasTracks = topTracks?.tracks && topTracks.tracks.length > 0;

  return hasTracks ? (
    <TracksContent tracks={topTracks.tracks} />
  ) : (
    <EmptyState />
  );
}
