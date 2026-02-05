'use client';

import { useState, useMemo } from 'react';
import { Shoe } from '@/types/shoe';
import ShoeCard from './ShoeCard';
import ShoeModal from './ShoeModal';

interface ShoeGridProps {
  shoes: Shoe[];
}

export default function ShoeGrid({ shoes }: ShoeGridProps) {
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get unique brands
  const brands = useMemo(() => {
    const brandSet = new Set(shoes.map((shoe) => shoe.manufacturerName));
    return Array.from(brandSet).sort();
  }, [shoes]);

  // Filter shoes
  const filteredShoes = useMemo(() => {
    return shoes.filter((shoe) => {
      const matchesBrand = selectedBrand === 'all' || shoe.manufacturerName === selectedBrand;
      const matchesSearch =
        searchQuery === '' ||
        shoe.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shoe.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shoe.modelNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesSearch;
    });
  }, [shoes, selectedBrand, searchQuery]);

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

  const sortedBrands = Object.keys(groupedShoes).sort();

  return (
    <>
      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <input
          type="text"
          placeholder="신발명, 브랜드, 모델번호 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-purple-400"
        />
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-purple-400"
        >
          <option value="all" className="bg-slate-800">전체 브랜드</option>
          {brands.map((brand) => (
            <option key={brand} value={brand} className="bg-slate-800">
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-center text-gray-400 mb-6">
        {filteredShoes.length}개 제품 표시 중
      </p>

      {/* Shoe Grid grouped by brand */}
      {sortedBrands.map((brand) => (
        <div key={brand} className="mb-10">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-500/30">
            <h2 className="text-2xl font-bold text-white">{brand}</h2>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
              {groupedShoes[brand].length}개
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groupedShoes[brand].map((shoe) => (
              <ShoeCard
                key={shoe.productApplicationuuid}
                shoe={shoe}
                onClick={() => setSelectedShoe(shoe)}
              />
            ))}
          </div>
        </div>
      ))}

      {filteredShoes.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          <p>검색 결과가 없습니다.</p>
        </div>
      )}

      {/* Modal */}
      {selectedShoe && (
        <ShoeModal shoe={selectedShoe} onClose={() => setSelectedShoe(null)} />
      )}
    </>
  );
}
