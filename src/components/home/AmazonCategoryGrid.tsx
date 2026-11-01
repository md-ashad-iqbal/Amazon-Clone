import QuadrantCard, { QuadrantCardProps } from './QuadrantCard';

const QUADRANT_CARDS: QuadrantCardProps[] = [
  {
    title: 'Level up your beauty routine',
    seeAllHref: '/products?category=beauty',
    items: [
      {
        label: 'Makeup & Serums',
        image: 'https://images.pexels.com/photos/39452544/pexels-photo-39452544.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=beauty&q=serum',
      },
      {
        label: 'Brushes & Tools',
        image: 'https://images.pexels.com/photos/39281912/pexels-photo-39281912.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=beauty',
      },
      {
        label: 'Cleansers',
        image: 'https://images.pexels.com/photos/39281910/pexels-photo-39281910.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=beauty&q=cleanser',
      },
      {
        label: 'Moisturizers',
        image: 'https://images.pexels.com/photos/24602077/pexels-photo-24602077.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=beauty&q=hydration',
      },
    ],
  },
  {
    title: 'Plug in with our electronics',
    seeAllHref: '/products?category=electronics',
    items: [
      {
        label: 'Headphones',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=electronics&q=headphones',
      },
      {
        label: 'Speakers',
        image: 'https://images.pexels.com/photos/29581125/pexels-photo-29581125.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=electronics&q=speakers',
      },
      {
        label: 'Smartphones',
        image: 'https://images.pexels.com/photos/30909364/pexels-photo-30909364.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=electronics&q=smartphones',
      },
      {
        label: 'Smartwatches',
        image: 'https://images.pexels.com/photos/11677077/pexels-photo-11677077.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=electronics&q=smartwatches',
      },
    ],
  },
  {
    title: 'Fantastic finds for home',
    seeAllHref: '/products?category=home-kitchen',
    items: [
      {
        label: 'Coffee Brewers',
        image: 'https://images.pexels.com/photos/35240184/pexels-photo-35240184.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=home-kitchen&q=coffee',
      },
      {
        label: 'Espresso Machines',
        image: 'https://images.pexels.com/photos/36573009/pexels-photo-36573009.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=home-kitchen&q=espresso',
      },
      {
        label: 'Lounge Chairs',
        image: 'https://images.pexels.com/photos/12269764/pexels-photo-12269764.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=home-kitchen&q=chair',
      },
      {
        label: 'Dining Sets',
        image: 'https://images.pexels.com/photos/35589991/pexels-photo-35589991.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=home-kitchen&q=dining',
      },
    ],
  },
  {
    title: 'Look your best this season',
    seeAllHref: '/products?category=fashion',
    items: [
      {
        label: 'For Him',
        image: 'https://images.pexels.com/photos/4295983/pexels-photo-4295983.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: "/products?category=fashion&q=Men's",
      },
      {
        label: 'For Her',
        image: 'https://images.pexels.com/photos/4428388/pexels-photo-4428388.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: "/products?category=fashion&q=Women's",
      },
      {
        label: 'Footwear',
        image: 'https://images.pexels.com/photos/19845610/pexels-photo-19845610.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=fashion&q=sneakers',
      },
      {
        label: 'Bags & Accessories',
        image: 'https://images.pexels.com/photos/26965825/pexels-photo-26965825.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=fashion&q=bag',
      },
    ],
  },
  {
    title: 'Score the top PCs & Accessories',
    seeAllHref: '/products?category=electronics&q=laptop',
    items: [
      {
        label: 'Laptops',
        image: 'https://images.pexels.com/photos/12200696/pexels-photo-12200696.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=electronics&q=laptop',
      },
      {
        label: 'Keyboards',
        image: 'https://images.pexels.com/photos/18311171/pexels-photo-18311171.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=electronics&q=keyboard',
      },
      {
        label: 'Monitors',
        image: 'https://images.pexels.com/photos/5552789/pexels-photo-5552789.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=electronics&q=monitor',
      },
      {
        label: 'Gaming Gear',
        image: 'https://images.pexels.com/photos/4225229/pexels-photo-4225229.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=electronics&q=gamepad',
      },
    ],
  },
  {
    title: 'Gear up to get fit',
    seeAllHref: '/products?category=sports',
    items: [
      {
        label: 'Dumbbells',
        image: 'https://images.pexels.com/photos/11433027/pexels-photo-11433027.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=sports&q=dumbbell',
      },
      {
        label: 'Kettlebells',
        image: 'https://images.pexels.com/photos/16552841/pexels-photo-16552841.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=sports&q=kettlebell',
      },
      {
        label: 'Resistance Bands',
        image: 'https://images.pexels.com/photos/28970127/pexels-photo-28970127.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=sports&q=resistance',
      },
      {
        label: 'Shakers & Bottles',
        image: 'https://images.pexels.com/photos/16412053/pexels-photo-16412053.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=sports&q=shaker',
      },
    ],
  },
  {
    title: 'Books, learning & play',
    seeAllHref: '/products?category=books',
    items: [
      {
        label: 'Classics',
        image: 'https://images.pexels.com/photos/8207315/pexels-photo-8207315.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=books&q=classics',
      },
      {
        label: 'Coding & Tech',
        image: 'https://images.pexels.com/photos/34889792/pexels-photo-34889792.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=books&q=code',
      },
      {
        label: 'Board Games',
        image: 'https://images.pexels.com/photos/792051/pexels-photo-792051.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=toys&q=game',
      },
      {
        label: 'Building Blocks',
        image: 'https://images.pexels.com/photos/12442773/pexels-photo-12442773.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=toys&q=blocks',
      },
    ],
  },
  {
    title: 'Today\'s Deals & Best Value',
    seeAllHref: '/products?deals=1',
    items: [
      {
        label: 'Over 30% Off',
        image: 'https://images.pexels.com/photos/2659939/pexels-photo-2659939.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?deals=1&discount=30',
      },
      {
        label: 'Audio Deals',
        image: 'https://images.pexels.com/photos/3756912/pexels-photo-3756912.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=electronics&deals=1',
      },
      {
        label: 'Fashion Savings',
        image: 'https://images.pexels.com/photos/28967487/pexels-photo-28967487.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=fashion&deals=1',
      },
      {
        label: 'Home Kitchen Deals',
        image: 'https://images.pexels.com/photos/20557063/pexels-photo-20557063.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
        href: '/products?category=home-kitchen&deals=1',
      },
    ],
  },
];

export default function AmazonCategoryGrid() {
  return (
    <section aria-label="Featured Categories Grid" className="my-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {QUADRANT_CARDS.map((card, idx) => (
          <QuadrantCard key={idx} {...card} />
        ))}
      </div>
    </section>
  );
}
