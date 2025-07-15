"use client";
import HomeNavCard from "@/components/HomeNavCard";

const navCards = [
  {
    href: "/words",
    title: "単語一覧",
    description: "登録済みの単語を確認・編集",
    buttonLabel: "開く",
  },
  {
    href: "/quiz",
    title: "クイズ",
    description: "ランダム出題で実力チェック",
    buttonLabel: "挑戦する",
  },
  {
    href: "/progress",
    title: "進捗",
    description: "学習状況・統計を確認",
    buttonLabel: "見る",
  },
];

export default function Home() {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-10 mt-16">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 drop-shadow">
        Use It Or Lose It
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl">
        {navCards.map((card) => (
          <HomeNavCard key={card.href} {...card} />
        ))}
      </div>
    </section>
  );
}
