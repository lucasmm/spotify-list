import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedArtists } from "@/hooks/useArtists";
import { CircleX, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

type Artist = {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  followers: {
    total: number;
  };
  genres: string[];
};

const SearchInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const { t } = useTranslation();
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("searchArtist")}
      startIcon={Search}
    />
  );
};

const ArtistSkeleton = () => (
  <div className="flex items-center gap-4 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700">
    <Skeleton className="h-20 w-20 rounded-l-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[250px]" />
    </div>
  </div>
);

const ArtistImage = ({ artist }: { artist: Artist }) => {
  if (!artist.images[0]?.url) {
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-l-lg bg-gray-200 dark:bg-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          No Image
        </span>
      </div>
    );
  }

  return (
    <img
      src={artist.images[0].url}
      alt={artist.name}
      className="h-20 w-20 rounded-l-lg object-cover"
      loading="lazy"
    />
  );
};

const ArtistInfo = ({ artist }: { artist: Artist }) => {
  const { t } = useTranslation();
  return (
    <div>
      <p
        className="font-medium text-gray-900 dark:text-gray-100"
        title={artist.name}
      >
        {artist.name}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {t("followers")}: {artist.followers.total.toLocaleString()}
      </p>
      <p
        className="text-sm text-gray-600 dark:text-gray-400"
        title={artist.genres.join(", ")}
      >
        {t("genres")}:{" "}
        {artist.genres.length > 0 ? artist.genres.join(", ") : "No genres"}
      </p>
    </div>
  );
};

const ArtistCard = ({ artist }: { artist: Artist }) => (
  <Link key={artist.id} to={`/artist/${artist.id}`}>
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700">
      <ArtistImage artist={artist} />
      <ArtistInfo artist={artist} />
    </div>
  </Link>
);

const LoadingState = () => (
  <div className="flex flex-col space-y-3">
    {Array.from({ length: 5 }, (_, id) => (
      <ArtistSkeleton key={id} />
    ))}
  </div>
);

const ErrorState = () => {
  const { t } = useTranslation();
  return (
    <Alert variant="destructive">
      <CircleX />
      <AlertTitle>{t("fetchError")}</AlertTitle>
    </Alert>
  );
};

const EmptyState = ({ hasSearched }: { hasSearched: boolean }) => {
  const { t } = useTranslation();
  if (!hasSearched) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        <p>{t("typeNameToStart")}</p>
      </div>
    );
  }

  return (
    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
      <p>{t("emptyData")}</p>
    </div>
  );
};

const ArtistsList = ({ artists }: { artists: Artist[] }) => (
  <div className="flex flex-col space-y-3">
    {artists.map((artist) => (
      <ArtistCard key={artist.id} artist={artist} />
    ))}
  </div>
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useDebouncedArtists(searchQuery);

  const hasSearched = searchQuery.trim().length > 0;
  const hasArtists = data?.artists?.items && data.artists.items.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <SearchInput value={searchQuery} onChange={setSearchQuery} />

      {isError && <ErrorState />}

      {isLoading && hasSearched && <LoadingState />}

      {!isLoading && !isError && (
        <>
          {hasArtists ? (
            <ArtistsList artists={data.artists.items} />
          ) : (
            <EmptyState hasSearched={hasSearched} />
          )}
        </>
      )}
    </div>
  );
}
