import { Outlet } from "react-router";
import { ModeToggle } from "./mode-toggle";
import LanguageToggle from "./language-toggle";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <div className="flex justify-between rounded-lg bg-white px-6 py-4 shadow-sm dark:bg-gray-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Spotify List
            </h1>
            <div className="flex space-x-2">
              <ModeToggle />
              <LanguageToggle />
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
