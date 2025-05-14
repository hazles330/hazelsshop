import ProductGrid from './ProductGrid';

interface ProductSectionProps {
  title: string;
  products: any[];
}

export default function ProductSection({ title, products }: ProductSectionProps) {
  return (    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  )
}