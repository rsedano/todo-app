import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales, Locale } from "./dictionaries";
import LanguageSwitcher from "../components/LanguageSwitcher";
import TodoApp from "../components/TodoApp";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {dict.nav.title}
          </h1>
          <LanguageSwitcher
            currentLang={lang as Locale}
            labels={dict.lang as Record<Locale, string>}
          />
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {dict.page.heading}
        </h2>
        <TodoApp dict={dict} />
      </main>
    </div>
  );
}
