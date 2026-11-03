import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { CategoryItem, Language } from '../../types/marketplace';
import { getStoredDepartments, subscribeToDepartments } from '../../services/departmentService';
import { DepartmentIcon } from '../Common/DepartmentIcon';

interface CategorySidebarProps {
  isOpen: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  language?: Language;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  isOpen,
  selectedCategory,
  onSelectCategory,
  language = 'en',
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [departments, setDepartments] = useState<CategoryItem[]>(() => getStoredDepartments());

  useEffect(() => {
    setDepartments(getStoredDepartments());
    const unsubscribe = subscribeToDepartments((latest) => {
      setDepartments(latest);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="bg-white border border-slate-200 border-t-0 shadow-sm relative z-30">
      <ul className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
        {departments.map((cat) => {
          const catName = language === 'si' && cat.nameSi ? cat.nameSi : cat.name;
          const isSelected = selectedCategory === cat.name || selectedCategory === cat.nameSi;
          const isHovered = hoveredCategory === cat.id;
          const subcategories = language === 'si' && cat.subcategoriesSi ? cat.subcategoriesSi : cat.subcategories;

          return (
            <li
              key={cat.id}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => onSelectCategory(cat.name)}
                className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer group-hover:bg-slate-50 group-hover:text-[#ea580c] ${
                  isSelected ? 'bg-orange-50/70 text-[#ea580c] font-semibold border-l-3 border-[#ea580c]' : 'border-l-3 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="text-slate-400 group-hover:text-[#ea580c] transition-colors shrink-0">
                    <DepartmentIcon iconName={cat.iconName} className="w-4 h-4" />
                  </div>
                  <span className="truncate">{catName}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ea580c] shrink-0 transition-colors" />
              </button>

              {/* Flyout Submenu on Hover */}
              {isHovered && subcategories && subcategories.length > 0 && (
                <div className="absolute left-full top-0 ml-[-1px] w-64 bg-white border border-slate-200 shadow-xl rounded-r py-2 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-1 font-bold border-b border-slate-100 text-[11px] uppercase tracking-wider text-[#ea580c] font-display flex items-center gap-2">
                    <DepartmentIcon iconName={cat.iconName} className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span className="truncate">{catName}</span>
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {subcategories.map((sub, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectCategory(cat.subcategories[idx] || sub)}
                        className="w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-[#ea580c] text-slate-600 transition-colors text-xs cursor-pointer truncate block"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                  <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between font-mono-numbers">
                    <span>{language === 'si' ? 'සත්‍යාපිත සැපයුම්කරුවන්' : 'Verified Suppliers'}</span>
                    <span className="font-semibold text-slate-700">{cat.itemCount}+</span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
