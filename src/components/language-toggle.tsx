import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import enFlag from "../assets/en-flag.svg";
import esFlag from "../assets/es-flag.svg";
import ptFlag from "../assets/pt-flag.svg";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getCurrentFlag = () => {
    switch (i18n.language) {
      case "en":
        return enFlag;
      case "es":
        return esFlag;
      case "pt":
        return ptFlag;
      default:
        return enFlag;
    }
  };

  const getCurrentLanguageCode = () => {
    switch (i18n.language) {
      case "en":
        return "English";
      case "es":
        return "Español";
      case "pt":
        return "Português";
      default:
        return "Português";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="language-toggle flex items-center gap-2"
        >
          <img
            src={getCurrentFlag()}
            alt="Current language flag"
            className="h-4 w-4"
          />
          {getCurrentLanguageCode()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className="flex items-center gap-2"
        >
          <img src={enFlag} alt="English flag" className="h-4 w-4" />
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("es")}
          className="flex items-center gap-2"
        >
          <img src={esFlag} alt="Spanish flag" className="h-4 w-4" />
          Español
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("pt")}
          className="flex items-center gap-2"
        >
          <img src={ptFlag} alt="Portuguese flag" className="h-4 w-4" />
          Português
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
