import Navigation from '@/components/Navigation';
import MobileNav from '@/components/MobileNav';

export default function LayoutWithNav({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Navigation desktop (fixe, cachée sur mobile) */}
      <Navigation />

      {/* Navigation mobile (drawer + header) */}
      <MobileNav />

      {/* Main content - margin pour desktop, padding-top pour mobile */}
      <main className="h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900 pt-14 pb-20 md:pt-0 md:pb-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}
