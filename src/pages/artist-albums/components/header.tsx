import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtist } from "@/hooks/useArtist";
import { ChevronLeft } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router";

type HeaderProps = {
  artistId: string;
};

type Artist = {
  id: string;
  name: string;
  popularity?: number;
  images: Array<{ url: string }>;
};

const BackButton = ({ onBack }: { onBack: () => void }) => (
  <Button
    variant="outline"
    size="icon"
    className="rounded-full"
    onClick={onBack}
  >
    <ChevronLeft className="h-5 w-5" />
  </Button>
);

const ArtistImage = ({ artist }: { artist: Artist }) => {
  if (!artist.images[0]?.url) return null;

  return (
    <img
      src={artist.images[0].url}
      alt={artist.name}
      className="h-16 w-16 rounded-full object-cover"
      loading="lazy"
    />
  );
};

const ArtistInfo = ({ artist }: { artist: Artist }) => (
  <div className="flex flex-col justify-center">
    <span
      className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
      title={artist.name}
    >
      {artist.name}
    </span>
    {artist.popularity && (
      <span className="text-lg text-gray-600 dark:text-gray-400">
        Popularidade: {artist.popularity}
      </span>
    )}
  </div>
);

const HeaderSkeleton = ({ onBack }: { onBack: () => void }) => (
  <div className="flex items-center gap-4">
    <BackButton onBack={onBack} />
    <Skeleton className="h-16 w-16 rounded-full" />
    <div className="flex flex-col justify-center gap-2">
      <Skeleton className="h-6 w-[250px]" />
      <Skeleton className="h-4 w-[250px]" />
    </div>
  </div>
);

const HeaderContent = ({
  artist,
  onBack,
}: {
  artist: Artist;
  onBack: () => void;
}) => (
  <div className="flex items-center gap-4">
    <BackButton onBack={onBack} />
    <ArtistImage artist={artist} />
    <ArtistInfo artist={artist} />
  </div>
);

export default function Header({ artistId }: HeaderProps) {
  const navigate = useNavigate();
  const { data: artist, isLoading } = useArtist(artistId);

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  if (isLoading) {
    return <HeaderSkeleton onBack={handleBack} />;
  }

  if (!artist) {
    return (
      <div className="flex items-center gap-4">
        <BackButton onBack={handleBack} />
        <span className="text-lg text-gray-500 dark:text-gray-400">
          Artist not found
        </span>
      </div>
    );
  }

  return <HeaderContent artist={artist} onBack={handleBack} />;
}
