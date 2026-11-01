import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/products?${searchParams.toString()}`, { replace: true });
  }, [searchParams, navigate]);

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-sm font-semibold text-slate-500">Searching marketplace...</div>
    </div>
  );
}
