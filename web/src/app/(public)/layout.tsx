import { Footer } from '~/components/footer';
import { Header } from '~/components/header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[1fr_auto] gap-6">
      <div className="h-full min-h-[85vh]">
        <Header />

        <main className="h-full scroll-mt-22 pt-22 pb-12">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
