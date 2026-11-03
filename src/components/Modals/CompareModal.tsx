import React from 'react';
import { X, ArrowLeftRight, Trash2, ShoppingCart } from 'lucide-react';
import { Currency, Language, Product } from '../../types/marketplace';
import { ProductImageRenderer } from '../Images/ProductImageRenderer';
import { getCategoryName, getProductName, getVendorName, t } from '../../i18n/translations';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onClearCompare: () => void;
  onAddToCart: (product: Product) => void;
  currency: Currency;
  language?: Language;
  onSelectProduct?: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
  currency,
  language = 'si',
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'USD' ? 1 : currency === 'EUR' ? 0.92 : 0.79;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-md shadow-2xl max-w-4xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-[#ea580c]" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 font-display">
              {language === 'si' ? `නිෂ්පාදන සංසන්දනය (${products.length})` : `Product Comparison (${products.length})`}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <ArrowLeftRight className="w-12 h-12 stroke-1 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600 font-display">
              {language === 'si' ? 'සංසන්දනය සඳහා කිසිදු නිෂ්පාදනයක් තෝරාගෙන නැත' : 'No products selected for comparison'}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              {language === 'si'
                ? 'නිෂ්පාදනවල ඇති සංසන්දන අයිකනය ක්ලික් කර තාක්ෂණික පිරිවිතර එක ළඟ සංසන්දනය කරන්න.'
                : 'Click the compare icon on product cards to view technical specs side-by-side.'}
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-3 bg-slate-50 font-bold text-slate-600 w-36 font-display">
                    {language === 'si' ? 'විශේෂාංගය' : 'Feature'}
                  </th>
                  {products.map((p) => {
                    const pName = getProductName(p, language);
                    return (
                      <th key={p.id} className="p-3 min-w-[200px] text-center font-semibold text-slate-800">
                        <div className="flex justify-end mb-1">
                          <button
                            onClick={() => onRemoveFromCompare(p.id)}
                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                            title={language === 'si' ? 'ඉවත් කරන්න' : 'Remove'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div
                          onClick={() => {
                            if (onSelectProduct) {
                              onSelectProduct(p);
                              onClose();
                            }
                          }}
                          className="w-24 h-24 mx-auto mb-2 flex items-center justify-center bg-slate-50 rounded border border-slate-100 cursor-pointer hover:border-[#ea580c] transition-colors"
                        >
                          <ProductImageRenderer name={p.imageUrl} className="w-20 h-20 object-contain" />
                        </div>
                        <div
                          onClick={() => {
                            if (onSelectProduct) {
                              onSelectProduct(p);
                              onClose();
                            }
                          }}
                          className="line-clamp-2 text-xs font-bold text-slate-800 mb-2 cursor-pointer hover:text-[#ea580c] transition-colors font-display"
                        >
                          {pName}
                        </div>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer font-display"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>{t('addToCart', language)}</span>
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-600">{language === 'si' ? 'මිල' : 'Price'}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-center font-bold text-[#ea580c] font-mono-numbers text-sm">
                      {currencySymbol}{(p.price * currencyRate).toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-600">{language === 'si' ? 'වෙළෙන්දා' : 'Vendor'}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-700">
                      {getVendorName(p.vendor, language)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-600">{language === 'si' ? 'කාණ්ඩය' : 'Category'}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-700">
                      {getCategoryName(p.category, language)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-600">{language === 'si' ? 'ශ්‍රේණිගත කිරීම' : 'Rating'}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-center text-slate-700">
                      {p.rating} / 5 ({p.reviewsCount} {language === 'si' ? 'සමාලෝචන' : 'reviews'})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-semibold text-slate-600">{language === 'si' ? 'තොග ලබාගත හැකි බව' : 'Stock Availability'}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-center text-emerald-600 font-semibold">
                      {language === 'si' ? `තොග ඇත (${p.stock || 20})` : `In Stock (${p.stock || 20})`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6 pt-3 border-t border-slate-200">
              <button
                onClick={onClearCompare}
                className="text-xs text-red-600 hover:underline cursor-pointer"
              >
                {language === 'si' ? 'සියලු සංසන්දන ඉවත් කරන්න' : 'Clear All Compared'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer font-display"
              >
                {language === 'si' ? 'වසන්න' : 'Close Comparison'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
