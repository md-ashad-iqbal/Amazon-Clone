import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CategoryPage() {
  const { categoryKey } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryKey) {
      navigate(`/products?category=${categoryKey}`, { replace: true });
    } else {
      navigate('/products', { replace: true });
    }
  }, [categoryKey, navigate]);

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-sm font-semibold text-slate-500">Loading department...</div>
    </div>
  );
}
