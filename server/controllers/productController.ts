import { Request, Response } from 'express';
import { isDbConnected } from '../config/db';
import { ProductModel } from '../models/Product';
import { inMemoryStore } from '../store/inMemoryStore';
import { INITIAL_PRODUCTS, ProductData } from '../data/initialProducts';

const CATEGORIES = [
  { key: 'electronics', label: 'Electronics' },
  { key: 'fashion', label: 'Fashion' },
  { key: 'home-kitchen', label: 'Home & Kitchen' },
  { key: 'beauty', label: 'Beauty' },
  { key: 'books', label: 'Books' },
  { key: 'toys', label: 'Toys' },
  { key: 'sports', label: 'Sports & Fitness' },
];

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      minRating,
      brands,
      inStockOnly,
      dealsOnly,
      sort = 'featured',
      page = '1',
      pageSize = '12',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(pageSize as string, 10) || 12));

    // Get all products from either DB or In-Memory
    let allProducts: ProductData[] = [];
    if (isDbConnected()) {
      allProducts = await ProductModel.find().lean();
      if (!allProducts.length) {
        allProducts = INITIAL_PRODUCTS;
      }
    } else {
      allProducts = inMemoryStore.getAllProducts();
    }

    let filtered = [...allProducts];

    // Search query
    if (q && typeof q === 'string') {
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter((p) => {
        const text = `${p.name} ${p.brand} ${p.subcategory} ${p.category} ${p.description}`.toLowerCase();
        return terms.every((t) => text.includes(t));
      });
    }

    // Category
    if (category && typeof category === 'string') {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Min Price
    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (!isNaN(min)) filtered = filtered.filter((p) => p.price >= min);
    }

    // Max Price
    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (!isNaN(max)) filtered = filtered.filter((p) => p.price <= max);
    }

    // Min Rating
    if (minRating) {
      const rating = parseFloat(minRating as string);
      if (!isNaN(rating)) filtered = filtered.filter((p) => p.rating >= rating);
    }

    // Brands
    if (brands) {
      const brandList = Array.isArray(brands)
        ? (brands as string[])
        : (brands as string).split(',').map((b) => b.trim());
      if (brandList.length > 0) {
        filtered = filtered.filter((p) => brandList.includes(p.brand));
      }
    }

    // In Stock Only
    if (inStockOnly === 'true' || inStockOnly === '1') {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // Deals Only (>= 25% discount)
    if (dealsOnly === 'true' || dealsOnly === '1') {
      filtered = filtered.filter((p) => {
        if (!p.originalPrice || p.originalPrice <= p.price) return false;
        const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        return discount >= 25;
      });
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'bestseller':
        filtered.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.reviewCount - a.reviewCount);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => Number(b.featured) - Number(a.featured) || b.reviewCount - a.reviewCount);
        break;
    }

    const total = filtered.length;
    const pageCount = Math.max(1, Math.ceil(total / limit));
    const validPage = Math.min(pageNum, pageCount);
    const start = (validPage - 1) * limit;
    const items = filtered.slice(start, start + limit);

    res.json({
      success: true,
      items,
      total,
      page: validPage,
      pageCount,
      pageSize: limit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    let product: ProductData | undefined | null = null;
    if (isDbConnected()) {
      product = await ProductModel.findOne({ id }).lean();
      if (!product) {
        product = inMemoryStore.getProductById(id);
      }
    } else {
      product = inMemoryStore.getProductById(id);
    }

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getCategories(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, categories: CATEGORIES });
}

export async function getBrands(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.query;
    const all = inMemoryStore.getAllProducts();
    const filtered = category ? all.filter((p) => p.category === category) : all;
    const brands = Array.from(new Set(filtered.map((p) => p.brand))).sort((a, b) => a.localeCompare(b));
    res.json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getSuggestions(req: Request, res: Response): Promise<void> {
  try {
    const q = (req.query.q as string || '').trim().toLowerCase();
    if (!q) {
      res.json({ success: true, suggestions: [] });
      return;
    }

    const all = inMemoryStore.getAllProducts();
    const matches = all
      .filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 6);

    res.json({ success: true, suggestions: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function getRelatedProducts(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const product = inMemoryStore.getProductById(id);
    if (!product) {
      res.json({ success: true, related: [] });
      return;
    }

    const all = inMemoryStore.getAllProducts();
    const related = all
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 10);

    res.json({ success: true, related });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
