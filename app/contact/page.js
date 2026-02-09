import Contact from '@/components/page-contact/Contact';
import Header from '@/components/page-contact/Header';
import Map from '@/components/page-contact/Map';

export const metadata = {
  title: "Contact",
};

export default function PageContact() {
  return (
    <>
      <main className="main-bg o-hidden">
        <Header />
        <Contact />
        <Map />
      </main>
    </>
  );
}
