import React from 'react';
import { X, BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Language } from '../../types/marketplace';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReadArticle: (title: string) => void;
  language?: Language;
}

export const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  onReadArticle,
  language = 'si',
}) => {
  if (!isOpen) return null;

  const isSi = language === 'si';

  const articles = [
    {
      title: isSi
        ? '2026 වසරේ නවීන කාර්යාල සඳහා ප්‍රමුඛතම කාර්යක්ෂම කාර්යාල ගෘහ භාණ්ඩ ප්‍රවණතා 10'
        : 'Top 10 Office Furniture Ergonomic Trends for Modern Workspaces in 2026',
      date: isSi ? '2026 ඔක් 29' : 'Oct 29, 2026',
      readTime: isSi ? 'මිනිත්තු 4ක කියවීමක්' : '4 min read',
      category: isSi ? 'අභ්‍යන්තර නිර්මාණ' : 'Interiors & Design',
      snippet: isSi
        ? 'උස සකස් කළ හැකි මේස, සුවපහසු ආසන සහ ශබ්ද-පාලක බිත්ති පැනල් ගෝලීය කාර්යාලවල ඵලදායිතාව ඉහළ නංවන ආකාරය සොයා බලන්න.'
        : 'Discover how height-adjustable desks, active seating, and acoustic wall panels are transforming productivity across global remote and hybrid offices.'
    },
    {
      title: isSi
        ? 'දේශසීමා ඉක්මවූ B2B ගනුදෙනු සඳහා බහු-විකුණුම්කාර ඇපකර ක්‍රමය (Escrow) උපකාරී වන අයුරු'
        : 'How Multi-Vendor Escrow Safeguards Cross-Border B2B Transactions',
      date: isSi ? '2026 ඔක් 26' : 'Oct 26, 2026',
      readTime: isSi ? 'මිනිත්තු 6ක කියවීමක්' : '6 min read',
      category: isSi ? 'වෙළඳාම සහ වාණිජ්‍යය' : 'Trade & Commerce',
      snippet: isSi
        ? 'සුරක්ෂිත ගිවිසුම් සත්‍යාපනය සහ නිල කුරියර් භාරදීම් මඟින් ජාත්‍යන්තර ගැනුම්කරුවන් සඳහා නියම භාණ්ඩ සහ ආරක්ෂිත ගෙවීම් මුදාහැරීම සහතික කරන අයුරු දැනගන්න.'
        : 'Learn how smart contract verification and bonded courier handoffs guarantee genuine goods and secure payment releases for international buyers.'
    },
    {
      title: isSi
        ? 'උසස් තත්ත්වයේ මයික්‍රෝෆයිබර් සහ ලිනන් ඇඳ ඇතිරිලි තෝරාගැනීමේ මඟපෙන්වීම'
        : 'The Ultimate Guide to Choosing High-Density Microfiber and Linen Bedding',
      date: isSi ? '2026 ඔක් 22' : 'Oct 22, 2026',
      readTime: isSi ? 'මිනිත්තු 5ක කියවීමක්' : '5 min read',
      category: isSi ? 'රෙදිපිළි සහ ගෘහ අලංකරණය' : 'Textiles & Living',
      snippet: isSi
        ? 'දිගුකාලීන සුඛෝපභෝගී ගෘහ සුවපහසුව සඳහා වියන ඝනත්වය සහ අසාත්මිකතා-විරෝධී සහතික තේරුම් ගැනීම.'
        : 'Understanding warp knitted yarn, weave densities, and hypoallergenic certifications for long-lasting luxury home comfort.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-md shadow-2xl max-w-2xl w-full overflow-hidden z-10 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#ff5c00]" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 font-display">
              {isSi ? 'වෙළඳපල බ්ලොග් සහ තීක්ෂ්ණ බුද්ධිය' : 'Market Blog & Insights'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {articles.map((art, idx) => (
            <div
              key={idx}
              className="p-4 border border-slate-200 rounded-sm hover:border-[#ff5c00]/50 hover:bg-orange-50/20 transition-all cursor-pointer group"
              onClick={() => onReadArticle(art.title)}
            >
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-1">
                <span className="font-bold text-[#ff5c00] uppercase font-display">{art.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono-numbers">
                  <Calendar className="w-3 h-3" />
                  {art.date}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono-numbers">
                  <Clock className="w-3 h-3" />
                  {art.readTime}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#ff5c00] transition-colors">
                {art.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {art.snippet}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#ff5c00] font-display">
                <span>{isSi ? 'සම්පූර්ණ ලිපිය කියවන්න' : 'Read Full Article'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
