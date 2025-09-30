import Navigation from '@/components/Navigation';

export default function LayoutWithNav({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 bg-slate-50">
        {children}
      </main>
    </div>
  );
}
