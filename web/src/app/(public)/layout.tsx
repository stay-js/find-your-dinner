import { Header } from '~/components/header';
import { Footer } from '~/components/footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[1fr_auto] gap-6">
      <div className="h-full min-h-[75vh]">
        <Header />

        <main className="py-6">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
