import { useState, useRef, useEffect } from 'react';
import { Star, X, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Fatima A.',
    date: '2 weeks ago',
    text: 'Amazing halal supermarket! Fresh meat, great variety of spices and everything you need. Staff are always friendly and helpful. My go-to shop every week.',
    avatar: 'FA',
  },
  {
    name: 'Mohammed K.',
    date: '1 month ago',
    text: 'Best halal grocery store in the area. The prices are very reasonable and the quality of the fresh produce is outstanding. Highly recommend!',
    avatar: 'MK',
  },
  {
    name: 'Sarah J.',
    date: '3 weeks ago',
    text: 'Love the U Points loyalty scheme — saved so much already! The store is always clean and well-organised. Wide range of international foods too.',
    avatar: 'SJ',
  },
  {
    name: 'Ahmed R.',
    date: '1 week ago',
    text: 'Fantastic selection of fresh fruits and vegetables. The bakery section is brilliant — fresh naan bread every morning. Will keep coming back!',
    avatar: 'AR',
  },
  {
    name: 'Aisha M.',
    date: '2 months ago',
    text: 'I drive 20 minutes just to shop here. The quality is unmatched, especially the meat counter. Customer service is always top-notch. Five stars!',
    avatar: 'AM',
  },
];

const ReviewsWidget = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const next = () => setCurrent((c) => (c + 1) % REVIEWS.length);
  const prev = () => setCurrent((c) => (c - 1 + REVIEWS.length) % REVIEWS.length);
  const review = REVIEWS[current];

  return (
    <>
      {/* Floating badge button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-5 z-[1099] flex items-center gap-1.5 bg-card border border-border rounded-full pl-3 pr-3.5 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
        aria-label="View Google Reviews"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden>
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />
          ))}
        </div>
        <span className="text-xs font-bold text-foreground">5.0</span>
      </button>

      {/* Reviews panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-40 right-5 z-[1100] w-[340px] bg-card rounded-xl border border-border shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Google Reviews</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Rating summary */}
          <div className="px-4 pt-3 pb-2 flex items-center gap-3">
            <span className="text-3xl font-bold text-foreground">5.0</span>
            <div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">Based on {REVIEWS.length} reviews</span>
            </div>
          </div>

          {/* Review card */}
          <div className="px-4 pb-3">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {review.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{review.name}</div>
                  <div className="text-[0.65rem] text-muted-foreground">{review.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">{review.text}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between px-4 pb-4">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-muted hover:bg-muted-foreground/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <div className="flex gap-1">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-border'}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-muted hover:bg-muted-foreground/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewsWidget;
