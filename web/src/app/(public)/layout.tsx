import { Header } from '~/components/header';
import { Footer } from '~/components/footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-6">
      <div className="min-h-screen">
        <Header />

        <div className="py-8">{children}</div>
      </div>

      <Footer />
    </div>
  );
}
