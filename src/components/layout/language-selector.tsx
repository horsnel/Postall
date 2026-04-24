"use client";

import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation, useLanguageStore } from "@/lib/i18n";
import { locales, type Locale } from "@/lib/i18n/translations";
import { toast } from "sonner";

export default function LanguageSelector() {
  const { locale, setLocale, locales: localeList } = useTranslation();
  const setLocaleStore = useLanguageStore((s) => s.setLocale);

  const currentLocale = localeList.find((l) => l.code === locale);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setLocaleStore(newLocale);
    const info = localeList.find((l) => l.code === newLocale);
    if (info) {
      toast.success(`Language changed to ${info.name}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 shrink-0 text-muted-foreground hover:text-foreground"
          title="Change language"
        >
          <span className="text-sm">{currentLocale?.flag}</span>
          <span className="text-xs font-medium hidden sm:inline">{currentLocale?.name}</span>
          <Languages className="h-3.5 w-3.5 sm:hidden" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-1">
        {localeList.map((l) => (
          <button
            key={l.code}
            onClick={() => handleLocaleChange(l.code)}
            className={`flex items-center gap-2 w-full rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-accent ${
              locale === l.code ? "bg-accent font-medium text-emerald-700" : "text-foreground"
            }`}
          >
            <span className="text-base">{l.flag}</span>
            <span className="flex-1 text-left">{l.name}</span>
            {locale === l.code && (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
