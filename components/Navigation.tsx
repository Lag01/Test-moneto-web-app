'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/onboarding', label: 'Onboarding' },
  { href: '/repartition', label: 'Répartition' },
  { href: '/visualisation', label: 'Visualisation' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-800 dark:bg-slate-950 text-white w-64 min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-emerald-400 dark:text-emerald-300">Moneto</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Gestion financière</p>
      </div>

      <ul className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-600 dark:bg-emerald-700 text-white font-medium'
                    : 'text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="px-2">
          <ThemeToggle />
        </div>

        {/* Retour accueil */}
        <div className="pt-4 border-t border-slate-700 dark:border-slate-800">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-slate-400 dark:text-slate-500 hover:text-white transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </nav>
  );
}
