export interface SearchableProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  tags?: string[];
  specs?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
}

const SYNONYMS: Record<string, string[]> = {
  mobile: ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones', 'cellphone'],
  mobiles: ['mobile', 'mobiles', 'smartphone', 'smartphones', 'phone', 'phones'],
  smartphone: ['smartphone', 'smartphones', 'mobile', 'mobiles', 'phone', 'phones'],
  smartphones: ['smartphone', 'smartphones', 'mobile', 'mobiles', 'phone'],
  phone: ['phone', 'phones', 'mobile', 'mobiles', 'smartphone', 'smartphones'],
  phones: ['phone', 'phones', 'mobile', 'mobiles', 'smartphone'],
  tshirt: ['tshirt', 't-shirt', 'tee', 'tshirts', 't-shirts', 'tees'],
  't-shirt': ['t-shirt', 'tshirt', 'tee', 't-shirts', 'tshirts', 'tees'],
  tshirts: ['tshirt', 't-shirt', 'tee', 'tees'],
  't-shirts': ['t-shirt', 'tshirt', 'tee', 'tees'],
  tee: ['tee', 't-shirt', 'tshirt', 'tees'],
  tees: ['tee', 't-shirt', 'tshirt', 'tees'],
  shirt: ['shirt', 'shirts', 'oxford', 'button-up'],
  shirts: ['shirt', 'shirts', 'oxford', 'button-up'],
  pant: ['pant', 'pants', 'trouser', 'trousers', 'chinos', 'bottomwear'],
  pants: ['pant', 'pants', 'trouser', 'trousers', 'chinos', 'bottomwear'],
  trouser: ['trouser', 'trousers', 'pant', 'pants', 'chinos'],
  trousers: ['trouser', 'trousers', 'pant', 'pants', 'chinos'],
  jeans: ['jeans', 'jean', 'denim'],
  jean: ['jeans', 'jean', 'denim'],
  salwar: ['salwar', 'suit', 'salwar suit', 'salwarkameez', 'kameez', 'churidar', 'ethnic'],
  suit: ['suit', 'salwar', 'salwar suit', 'salwarkameez', 'ethnic'],
  'salwar suit': ['salwar suit', 'salwar', 'suit', 'salwarkameez', 'kameez', 'churidar', 'ethnic'],
  kurta: ['kurta', 'kurti', 'kurtas', 'kurtis', 'tunic', 'ethnic', 'traditional'],
  kurti: ['kurti', 'kurta', 'kurtis', 'kurtas', 'tunic', 'ethnic', 'traditional'],
  kurtas: ['kurta', 'kurti', 'tunic', 'ethnic'],
  kurtis: ['kurti', 'kurta', 'tunic', 'ethnic'],
  saree: ['saree', 'sari', 'sarees', 'saris', 'traditional', 'ethnic'],
  sari: ['sari', 'saree', 'saris', 'sarees', 'traditional', 'ethnic'],
  sarees: ['saree', 'sari', 'sarees', 'saris', 'traditional', 'ethnic'],
  dress: ['dress', 'dresses', 'midi', 'maxi', 'skirt', 'gown'],
  dresses: ['dress', 'dresses', 'midi', 'maxi', 'skirt', 'gown'],
  shoes: ['shoes', 'shoe', 'sneakers', 'sneaker', 'footwear', 'oxford', 'loafers'],
  shoe: ['shoes', 'shoe', 'sneakers', 'sneaker', 'footwear'],
  sneakers: ['sneakers', 'sneaker', 'shoes', 'shoe', 'footwear'],
  sneaker: ['sneakers', 'sneaker', 'shoes', 'shoe', 'footwear'],
  watch: ['watch', 'watches', 'smartwatch', 'smartwatches', 'timepiece'],
  watches: ['watch', 'watches', 'smartwatch', 'smartwatches', 'timepiece'],
  smartwatch: ['smartwatch', 'smartwatches', 'watch', 'watches', 'fitband'],
  laptop: ['laptop', 'laptops', 'notebook', 'ultrabook', 'computer', 'pc'],
  laptops: ['laptop', 'laptops', 'notebook', 'ultrabook', 'computer', 'pc'],
  headphones: ['headphones', 'headphone', 'headset', 'headsets', 'earphones', 'earphone', 'earbuds', 'earbud', 'audio'],
  headphone: ['headphones', 'headphone', 'headset', 'headsets', 'earphones', 'earbuds', 'audio'],
  headset: ['headset', 'headphones', 'earphones', 'earbuds'],
  earbuds: ['earbuds', 'earbud', 'earphones', 'headphones', 'audio'],
  earbud: ['earbuds', 'earbud', 'earphones', 'headphones'],
  electronics: ['electronics', 'electronic', 'gadget', 'gadgets', 'tech', 'device', 'devices'],
  electronic: ['electronics', 'electronic', 'gadget', 'tech'],
  fashion: ['fashion', 'clothing', 'apparel', 'wear', 'clothes', 'outfit', 'style'],
  accessories: ['accessories', 'accessory', 'charger', 'hub', 'adapter', 'cable', 'bag', 'bags'],
  accessory: ['accessories', 'accessory', 'charger', 'hub', 'adapter', 'cable', 'bag'],
};

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesWordOrPhrase(haystack: string, needle: string): boolean {
  if (!needle || needle.length < 2) return false;
  if (needle.length <= 3) {
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|\\s)${escaped}(?:$|\\s)`, 'i').test(haystack);
  }
  return haystack.includes(needle);
}

export function getWordVariants(word: string): string[] {
  const normalized = word.toLowerCase().trim();
  const variants = new Set<string>([normalized]);

  if (normalized.includes('-')) {
    variants.add(normalized.replace(/-/g, ''));
    variants.add(normalized.replace(/-/g, ' '));
  } else if (normalized.startsWith('t') && normalized.length > 2) {
    variants.add(`t-${normalized.slice(1)}`);
  }

  if (normalized.endsWith('ies') && normalized.length > 4) {
    variants.add(`${normalized.slice(0, -3)}y`);
  } else if (normalized.endsWith('es') && normalized.length > 3) {
    variants.add(normalized.slice(0, -2));
    if (normalized.endsWith('sses')) {
      variants.add(normalized.slice(0, -2));
    }
  } else if (normalized.endsWith('s') && !normalized.endsWith('ss') && normalized.length > 2) {
    variants.add(normalized.slice(0, -1));
  } else {
    variants.add(`${normalized}s`);
    variants.add(`${normalized}es`);
  }

  return Array.from(variants).filter((v) => v.length > 1);
}

export function getExpandedTokens(query: string): string[] {
  const rawClean = query.toLowerCase().trim();
  const normalized = normalizeText(query);
  const words = normalized.split(/\s+/).filter((w) => w.length > 1);
  const expanded = new Set<string>();

  if (rawClean && rawClean.length > 1) expanded.add(rawClean);
  if (normalized && normalized.length > 1) expanded.add(normalized);

  // If query is hyphenated (like t-shirt), also add compact version (tshirt)
  if (rawClean.includes('-')) {
    expanded.add(rawClean.replace(/-/g, ''));
  }

  if (SYNONYMS[rawClean]) {
    SYNONYMS[rawClean].forEach((s) => expanded.add(s));
  }
  if (SYNONYMS[normalized]) {
    SYNONYMS[normalized].forEach((s) => expanded.add(s));
  }

  for (const word of words) {
    expanded.add(word);
    const variants = getWordVariants(word);
    variants.forEach((v) => {
      expanded.add(v);
      if (SYNONYMS[v]) {
        SYNONYMS[v].forEach((s) => expanded.add(s));
      }
    });

    if (SYNONYMS[word]) {
      SYNONYMS[word].forEach((s) => {
        expanded.add(s);
        getWordVariants(s).forEach((v) => expanded.add(v));
      });
    }
  }

  return Array.from(expanded).filter((t) => t.length > 1);
}

export function calculateProductMatchScore(
  product: SearchableProduct,
  rawQuery: string,
): number {
  if (!rawQuery || !rawQuery.trim()) return 0;

  const queryNorm = normalizeText(rawQuery);
  const rawLower = rawQuery.toLowerCase().trim();
  const queryTokens = queryNorm.split(/\s+/).filter((w) => w.length > 1);
  const expandedTokens = getExpandedTokens(rawQuery);

  const nameNorm = normalizeText(product.name);
  const brandNorm = normalizeText(product.brand);
  const catNorm = normalizeText(product.category);
  const subcatNorm = normalizeText(product.subcategory);
  const descNorm = normalizeText(product.description);
  const tagsNorm = (product.tags || []).map((t) => normalizeText(t));
  const specsNorm = product.specs
    ? Object.entries(product.specs)
        .map(([k, v]) => `${normalizeText(k)} ${normalizeText(v)}`)
        .join(' ')
    : '';

  let score = 0;

  // 1. Exact or whole phrase matches (Highest weight)
  if (nameNorm === queryNorm || product.name.toLowerCase() === rawLower) {
    score += 150;
  } else if (matchesWordOrPhrase(nameNorm, queryNorm)) {
    score += 90;
  }

  // Tags phrase match
  if (tagsNorm.some((t) => t === queryNorm || t === rawLower)) {
    score += 80;
  } else if (tagsNorm.some((t) => matchesWordOrPhrase(t, queryNorm))) {
    score += 60;
  }

  // Category and subcategory phrase match
  if (catNorm === queryNorm || subcatNorm === queryNorm) {
    score += 70;
  } else if (matchesWordOrPhrase(subcatNorm, queryNorm) || matchesWordOrPhrase(catNorm, queryNorm)) {
    score += 50;
  }

  // Brand phrase match
  if (brandNorm === queryNorm || matchesWordOrPhrase(brandNorm, queryNorm)) {
    score += 45;
  }

  // Description phrase match
  if (matchesWordOrPhrase(descNorm, queryNorm)) {
    score += 30;
  }

  // 2. Token-by-token evaluation
  let matchedAllOriginalTokens = true;
  for (const token of queryTokens) {
    const tokenVariants = getWordVariants(token);
    const tokenSynonyms = SYNONYMS[token] || [];
    const candidateTerms = Array.from(new Set([token, ...tokenVariants, ...tokenSynonyms])).filter(
      (t) => t.length > 1,
    );

    let tokenMatched = false;

    if (candidateTerms.some((term) => matchesWordOrPhrase(nameNorm, term))) {
      score += 40;
      tokenMatched = true;
    }
    if (tagsNorm.some((tag) => candidateTerms.some((term) => matchesWordOrPhrase(tag, term)))) {
      score += 35;
      tokenMatched = true;
    }
    if (candidateTerms.some((term) => matchesWordOrPhrase(subcatNorm, term) || matchesWordOrPhrase(catNorm, term))) {
      score += 30;
      tokenMatched = true;
    }
    if (candidateTerms.some((term) => matchesWordOrPhrase(brandNorm, term))) {
      score += 25;
      tokenMatched = true;
    }
    if (candidateTerms.some((term) => matchesWordOrPhrase(descNorm, term))) {
      score += 15;
      tokenMatched = true;
    }
    if (candidateTerms.some((term) => matchesWordOrPhrase(specsNorm, term))) {
      score += 10;
      tokenMatched = true;
    }

    if (!tokenMatched) {
      matchedAllOriginalTokens = false;
    }
  }

  if (matchedAllOriginalTokens && queryTokens.length > 1) {
    score += 40;
  }

  // 3. Expanded synonyms check
  for (const exp of expandedTokens) {
    if (exp === queryNorm || queryTokens.includes(exp)) continue;
    if (matchesWordOrPhrase(nameNorm, exp)) {
      score += 25;
    }
    if (tagsNorm.some((t) => matchesWordOrPhrase(t, exp))) {
      score += 20;
    }
    if (matchesWordOrPhrase(subcatNorm, exp) || matchesWordOrPhrase(catNorm, exp)) {
      score += 15;
    }
    if (matchesWordOrPhrase(descNorm, exp)) {
      score += 8;
    }
  }

  return score;
}

export function searchAndRankProducts<T extends SearchableProduct>(
  products: T[],
  rawQuery: string,
): T[] {
  const query = rawQuery.trim();
  if (!query) return products;

  const scored = products
    .map((product) => ({
      product,
      score: calculateProductMatchScore(product, query),
    }))
    .filter((item) => item.score > 0);

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const pA = a.product as { rating?: number; reviewCount?: number };
    const pB = b.product as { rating?: number; reviewCount?: number };
    return (pB.rating ?? 0) - (pA.rating ?? 0) || (pB.reviewCount ?? 0) - (pA.reviewCount ?? 0);
  });

  return scored.map((item) => item.product);
}
