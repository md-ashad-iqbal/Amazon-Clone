import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { readStorage, writeStorage } from '@/utils/storage';

const STORAGE_KEY = 'shopsphere-delivery-location';
const LOCATIONS = ['Mumbai 400001', 'Delhi 110001', 'Bengaluru 560001', 'Hyderabad 500081'];

export default function DeliverTo() {
  const [location, setLocation] = useState(() => readStorage<string>(STORAGE_KEY, LOCATIONS[0]));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    writeStorage(STORAGE_KEY, location);
  }, [location]);

  return (
    <div
      className="relative hidden shrink-0 lg:block"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex items-end gap-1 rounded-md px-2 py-1 text-left transition hover:ring-1 hover:ring-white/60"
      >
        <MapPin className="mb-0.5 h-5 w-5 text-slate-300" />
        <span>
          <span className="block text-xs text-slate-300">Deliver to</span>
          <span className="block text-sm font-semibold leading-none">{location.split(' ')[0]}</span>
        </span>
      </button>
      {open && (
        <ul className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg bg-white py-1 text-slate-800 shadow-lift">
          {LOCATIONS.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  setLocation(option);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition hover:bg-slate-100 ${
                  option === location ? 'font-semibold text-sky-700' : ''
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
