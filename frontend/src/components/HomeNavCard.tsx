'use client';
import Link from 'next/link';

type Props = {
  href: string;
  title: string;
  description: string;
  buttonLabel: string;
};

export default function HomeNavCard({ href, title, description, buttonLabel }: Props) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:bg-indigo-50 transition"
    >
      <span className="text-2xl font-bold text-indigo-600 mb-2">{title}</span>
      <span className="text-gray-500">{description}</span>
      <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition">
        {buttonLabel}
      </button>
    </Link>
  );
} 