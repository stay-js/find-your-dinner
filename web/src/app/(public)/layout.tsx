import { Header } from '~/components/header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-6">
      <div className="min-h-screen">
        <Header />

        {children}
      </div>

      {/* <Footer /> */}
    </div>
  );
}
