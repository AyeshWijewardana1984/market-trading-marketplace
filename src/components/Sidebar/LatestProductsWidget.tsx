import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { LATEST_PRODUCTS } from '../../data/products';
import { Currency, Language, Product } from '../../types/marketplace';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { getProductName, t } from '../../i18n/translations';

interface LatestProductsWidgetProps {
  currency: Currency;
  language?: Language;
  onSelectProduct: (product: Product) => void;
  onOpenProductPage?: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const LatestProductsWidget: React.FC<LatestProductsWidgetProps> = ({
  currency,
  language = 'en',
  onSelectProduct,
  onOpenProductPage,
  onAddToCart,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  // 2 pages of products
  const pages = [
    LATEST_PRODUCTS,
    [
      ...LATEST_PRODUCTS.slice(2),
      ...LATEST_PRODUCTS.slice(0, 2),
    ]
  ];

  const currentProducts = pages[currentPage];

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-xs mt-6">
      {/* Header with Title and Dot Pagination */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 font-display">
          {t('latestProducts', language)}
        </h3>
        <div className="flex items-center gap-1.5">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                currentPage === idx ? 'bg-[#ea580c] w-3' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Page ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3.5">
        {currentProducts.map((product) => {
          const formattedPrice = (product.price * currencyRate).toFixed(2);
          const formattedOriginal = product.originalPrice
            ? (product.originalPrice * currencyRate).toFixed(2)
            : null;
          const productName = getProductName(product, language);

          return (
            <div
              key={product.id}
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => (onOpenProductPage || onSelectProduct)(product)}
            >
              {/* Product Thumbnail */}
              <div className="w-16 h-16 shrink-0 bg-slate-50 border border-slate-100 rounded p-1 flex items-center justify-center overflow-hidden group-hover:border-[#ea580c]/50 transition-colors">
                <ProductImageRenderer name={product.imageUrl} className="w-14 h-14 object-contain" />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                {/* 5 Gold Stars */}
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-2.5 h-2.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Product Name */}
                <h4 className="text-[11px] font-semibold text-slate-800 line-clamp-1 group-hover:text-[#ea580c] transition-colors leading-tight">
                  {productName}
                </h4>

                {/* Price */}
                <div className="flex items-center gap-2 mt-1 font-mono-numbers">
                  <span className="text-[#ea580c] font-bold text-xs">
                    {currencySymbol}{formattedPrice}
                  </span>
                  {formattedOriginal && (
                    <span className="text-slate-400 line-through text-[11px]">
                      {currencySymbol}{formattedOriginal}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
