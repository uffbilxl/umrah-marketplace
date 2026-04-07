import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PatternOverlay from '@/components/PatternOverlay';

const stores = [
  { name: 'Leicester — HQ', address: '9 St Georges Retail Park, Leicester, LE1 1SG', hours: 'Mon–Sun: 8:00am – 10:00pm', tel: '0116 000 0000', open: true, maps: 'https://maps.google.com/?q=9+St+Georges+Retail+Park+Leicester+LE1+1SG', embed: '9+St+Georges+Retail+Park+Leicester+LE1+1SG' },
  { name: 'Liverpool', address: '22 Lodge Lane, Liverpool, L8 0QH', hours: 'Mon–Sun: 8:00am – 10:00pm', tel: '0151 000 0000', open: true, maps: 'https://maps.google.com/?q=22+Lodge+Lane+Liverpool+L8+0QH', embed: '22+Lodge+Lane+Liverpool+L8+0QH' },
  { name: 'Huddersfield', address: 'Umrah Supermarket, Huddersfield', hours: 'Mon–Sun: 8:00am – 10:00pm', tel: '01484 000 000', open: true, maps: 'https://maps.google.com/?q=Umrah+Supermarket+Huddersfield', embed: 'Umrah+Supermarket+Huddersfield' },
  { name: 'Northampton', address: 'Harlestone Road, Northampton, NN5 7AE', hours: 'Mon–Sun: 8:00am – 10:00pm', tel: '01604 000 000', open: true, maps: 'https://maps.google.com/?q=Harlestone+Road+Northampton+NN5+7AE', embed: 'Harlestone+Road+Northampton+NN5+7AE' },
  { name: 'Birmingham', address: '', hours: '', tel: '', open: false, maps: '', embed: '' },
  { name: 'Manchester', address: '', hours: '', tel: '', open: false, maps: '', embed: '' },
  { name: 'Leeds', address: '', hours: '', tel: '', open: false, maps: '', embed: '' },
];

const StoresPage = () => {
  const [search, setSearch] = useState('');

  useEffect(() => { document.title = 'Store Locator | Umrah Supermarket'; }, []);

  const filtered = stores.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen bg-muted relative overflow-hidden">
        <PatternOverlay opacity={0.06} />
        <div className="container-umrah">
          <div className="text-center mb-12">
            <span className="section-label">Find Us</span>
            <h1 className="section-title">Our Stores</h1>
            <div className="gold-line mx-auto" />
          </div>

          <div className="max-w-[500px] mx-auto mb-12 flex gap-3">
            <input type="text" placeholder="Enter postcode or city..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-5 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold tracking-[0.1em] uppercase hover:bg-primary/90 transition-all">Find</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(store => (
              <div key={store.name} className={`bg-card rounded-lg overflow-hidden relative ${!store.open ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]'} transition-all`}>
                {store.open && store.embed && (
                  <div className="w-full h-[200px]">
                    <iframe
                      title={`Map of ${store.name}`}
                      src={`https://maps.google.com/maps?q=${store.embed}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
                {!store.open && (
                  <span className="absolute top-4 right-4 bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Opening Soon</span>
                )}
                <div className="p-6">
                  <h3 className="font-header text-lg tracking-[0.08em] uppercase mb-3">{store.name}</h3>
                  {store.open ? (
                    <>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <i className="fas fa-map-marker-alt text-secondary mt-0.5" />{store.address}
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <i className="fas fa-clock text-secondary mt-0.5" />{store.hours}
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <i className="fas fa-phone text-secondary mt-0.5" />{store.tel}
                        </div>
                      </div>
                      <a href={store.maps} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-[2px] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-primary/90 transition-all">
                        Get Directions <i className="fas fa-arrow-right" />
                      </a>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Coming soon to {store.name}!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StoresPage;
