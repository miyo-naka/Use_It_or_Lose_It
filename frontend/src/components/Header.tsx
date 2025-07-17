'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'ホーム' },
  { href: '/words', label: '単語一覧' },
  { href: '/quiz', label: 'クイズ' },
  { href: '/progress', label: '進捗' },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="w-full shadow bg-white/80 sticky top-0 z-10">
      <nav className="max-w-3xl mx-auto flex gap-4 px-4 py-3 items-center">
        <span className="font-bold text-xl tracking-tight mr-6 text-indigo-700">Use It Or Lose It</span>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1 rounded transition font-medium ${pathname === item.href ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50 text-gray-700'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
} 