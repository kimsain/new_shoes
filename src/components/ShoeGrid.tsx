'use client';

import { useState, useMemo } from 'react';
import { Shoe } from '@/types/shoe';
import ShoeCard from './ShoeCard';
import ShoeModal from './ShoeModal';

// Priority brands - always shown first in this order
const PRIORITY_BRANDS = ['Nike', 'Adidas', 'Puma', 'Asics'];

interface ShoeGridProps {
  shoes: Shoe[];
}

// Helper function to sort brands with priority
function sortBrandsWithPriority(brands: string[]): string[] {
  return brands.sort((a, b) => {
    const aIndex = PRIORITY_BRANDS.indexOf(a);
    const bIndex = PRIORITY_BRANDS.indexOf(b);

    // Both are priority brands - sort by priority order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // Only a is priority brand - a comes first
    if (aIndex !== -1) return -1;
    // Only b is priority brand - b comes first
    if (bIndex !== -1) return 1;
    // Neither is priority - sort alphabetically
    return a.localeCompare(b);
  });
}

export default function ShoeGrid({ shoes }: ShoeGridProps) {
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'expiring'>('newest');

  // Get 4 newest shoes (by certification start date)
  const newestShoes = useMemo(() => {
    return [...shoes]
      .sort((a, b) => {
        const dateA = a.certificationStartDateExp ? new Date(a.certificationStartDateExp).getTime() : 0;
        const dateB = b.certificationStartDateExp ? new Date(b.certificationStartDateExp).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4);
  }, [shoes]);

  const newestShoeIds = useMemo(() => new Set(newestShoes.map(s => s.productApplicationuuid)), [newestShoes]);

  // Get unique brands with count - sorted with priority brands first
  const brandsWithCount = useMemo(() => {
    const brandMap = new Map<string, number>();
    shoes.forEach((shoe) => {
      const count = brandMap.get(shoe.manufacturerName) || 0;
      brandMap.set(shoe.manufacturerName, count + 1);
    });

    const entries = Array.from(brandMap.entries());
    // Sort: priority brands first, then by count
    entries.sort((a, b) => {
      const aIndex = PRIORITY_BRANDS.indexOf(a[0]);
      const bIndex = PRIORITY_BRANDS.indexOf(b[0]);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return b[1] - a[1]; // Sort by count descending
    });

    return entries.map(([name, count]) => ({ name, count }));
  }, [shoes]);

  // Filter and sort shoes
  const filteredShoes = useMemo(() => {
    let result = shoes.filter((shoe) => {
      const matchesBrand = selectedBrand === 'all' || shoe.manufacturerName === selectedBrand;
      const matchesSearch =
        searchQuery === '' ||
        shoe.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shoe.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shoe.modelNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesSearch;
    });

    // Sort
    if (sortBy === 'expiring') {
      result.sort((a, b) => {
        const dateA = a.certificationEndDateExp ? new Date(a.certificationEndDateExp).getTime() : Infinity;
        const dateB = b.certificationEndDateExp ? new Date(b.certificationEndDateExp).getTime() : Infinity;
        return dateA - dateB;
      });
    }

    return result;
  }, [shoes, selectedBrand, searchQuery, sortBy]);

  // Group by brand
  const groupedShoes = useMemo(() => {
    const grouped: Record<string, Shoe[]> = {};
    filteredShoes.forEach((shoe) => {
      if (!grouped[shoe.manufacturerName]) {
        grouped[shoe.manufacturerName] = [];
      }
      grouped[shoe.manufacturerName].push(shoe);
    });
    return grouped;
  }, [filteredShoes]);

  // Sort brands with priority (Nike, Adidas, Puma, Asics first)
  const sortedBrands = sortBrandsWithPriority(Object.keys(groupedShoes));

  // Quick filter brands - priority brands first, then top by count
  const quickFilterBrands = useMemo(() => {
    const priorityInData = PRIORITY_BRANDS.filter(b =>
      brandsWithCount.some(({ name }) => name === b)
    );
    const others = brandsWithCount
      .filter(({ name }) => !PRIORITY_BRANDS.includes(name))
      .slice(0, 5 - priorityInData.length);

    return [...priorityInData.map(name => ({ name, count: brandsWithCount.find(b => b.name === name)?.count || 0 })), ...others];
  }, [brandsWithCount]);

  return (
    <>
      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 -mx-4 px-4 py-4 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-gray-800/50 mb-8">
        <div className="flex flex-col gap-4">
          {/* Search and Select Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="신발명, 브랜드, 모델번호 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 text-white placeholder-gray-500 border border-gray-800 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-gray-900 text-white border border-gray-800 focus:outline-none focus:border-green-500/50 transition-all min-w-[140px]"
              >
                <option value="all">전체 브랜드</option>
                {brandsWithCount.map(({ name, count }) => (
                  <option key={name} value={name}>
                    {name} ({count})
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'expiring')}
                className="px-4 py-2.5 rounded-xl bg-gray-900 text-white border border-gray-800 focus:outline-none focus:border-green-500/50 transition-all min-w-[120px]"
              >
                <option value="newest">최신순</option>
                <option value="expiring">만료임박순</option>
              </select>
            </div>
          </div>

          {/* Quick Filters - Priority Brands */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-xs text-gray-500 shrink-0">브랜드:</span>
            {quickFilterBrands.map(({ name }) => (
              <button
                key={name}
                onClick={() => setSelectedBrand(selectedBrand === name ? 'all' : name)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedBrand === name
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {name}
              </button>
            ))}
            {selectedBrand !== 'all' && (
              <button
                onClick={() => setSelectedBrand('all')}
                className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                초기화
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <p className="text-gray-400">
          <span className="text-white font-medium">{filteredShoes.length}</span>개 제품
          {selectedBrand !== 'all' && (
            <span className="ml-2 text-green-400">
              in {selectedBrand}
            </span>
          )}
        </p>
      </div>

      {/* Newest Section - Only show when no filters applied */}
      {selectedBrand === 'all' && searchQuery === '' && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-semibold">NEW</span>
              <h2 className="text-xl font-bold text-white">Newest</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400 text-sm">
              {newestShoes.length}
            </span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {newestShoes.map((shoe) => (
              <ShoeCard
                key={`newest-${shoe.productApplicationuuid}`}
                shoe={shoe}
                onClick={() => setSelectedShoe(shoe)}
                isNew
              />
            ))}
          </div>
        </section>
      )}

      {/* Shoe Grid grouped by brand */}
      {sortedBrands.map((brand) => (
        <section key={brand} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-white">{brand}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400 text-sm">
              {groupedShoes[brand].length}
            </span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {groupedShoes[brand].map((shoe) => (
              <ShoeCard
                key={shoe.productApplicationuuid}
                shoe={shoe}
                onClick={() => setSelectedShoe(shoe)}
              />
            ))}
          </div>
        </section>
      ))}

      {filteredShoes.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-lg text-white mb-2">검색 결과가 없습니다</p>
          <p className="text-gray-500 text-sm">다른 검색어를 시도해보세요</p>
        </div>
      )}

      {/* Modal */}
      {selectedShoe && (
        <ShoeModal shoe={selectedShoe} onClose={() => setSelectedShoe(null)} />
      )}
    </>
  );
}
