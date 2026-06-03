import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="w-full flex-1 flex flex-col pb-24 md:pb-6">
        {children}
      </main>
      <MobileNav />
    </>
  );
}
