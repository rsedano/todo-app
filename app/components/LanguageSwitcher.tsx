"use client";

import { useRouter, usePathname } from "next/navigation";
import { Locale } from "../[lang]/dictionaries";

interface LanguageSwitcherProps {
  currentLang: Locale;
  labels: Record<Locale, string>;
}

export default function LanguageSwitcher({ currentLang, labels }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(locale: Locale) {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex gap-1" role="navigation" aria-label="Language switcher">
      {(["en", "es", "fr"] as Locale[]).map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          disabled={currentLang === locale}
          aria-current={currentLang === locale ? "true" : undefined}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
            currentLang === locale
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          {labels[locale]}
        </button>
      ))}
    </div>
  );
}
