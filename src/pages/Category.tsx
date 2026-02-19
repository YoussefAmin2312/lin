import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import { filterAndSortProducts } from "@/data/products";

const Category = () => {
  const { category } = useParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);

  // Get category-specific filter based on URL
  const urlCategoryFilter = (() => {
    if (!category) return [];
    const lower = category.toLowerCase();
    if (lower === "earrings") return ["Earrings"];
    if (lower === "bracelets") return ["Bracelets"];
    if (lower === "rings") return ["Rings"];
    if (lower === "necklaces") return ["Necklaces"];
    if (lower === "watches") return ["Watches"];
    return []; // "shop", "new-in", etc. show all
  })();

  // Merge URL-based category filter with user-selected filters
  const activeFilters = urlCategoryFilter.length > 0
    ? urlCategoryFilter
    : categoryFilters;

  const filteredProducts = filterAndSortProducts(sortBy, activeFilters);

  const handleCategoryFilterChange = (cat: string, checked: boolean) => {
    if (checked) {
      setCategoryFilters(prev => [...prev, cat]);
    } else {
      setCategoryFilters(prev => prev.filter(c => c !== cat));
    }
  };

  const handleClearFilters = () => {
    setCategoryFilters([]);
  };

  const displayCategory = (() => {
    if (!category) return "All Products";
    const lower = category.toLowerCase();
    if (lower === "shop") return "All Products";
    if (lower === "new-in") return "New Arrivals";
    return category.charAt(0).toUpperCase() + category.slice(1);
  })();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <CategoryHeader
          category={displayCategory}
        />

        <FilterSortBar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={filteredProducts.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categoryFilters={categoryFilters}
          onCategoryFilterChange={handleCategoryFilterChange}
          onClearFilters={handleClearFilters}
          showCategoryFilter={urlCategoryFilter.length === 0}
        />

        <ProductGrid products={filteredProducts} />
      </main>

      <Footer />
    </div>
  );
};

export default Category;