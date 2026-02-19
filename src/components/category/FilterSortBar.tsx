import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterSortBarProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  itemCount: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  categoryFilters: string[];
  onCategoryFilterChange: (category: string, checked: boolean) => void;
  onClearFilters: () => void;
  showCategoryFilter: boolean;
}

const FilterSortBar = ({
  filtersOpen,
  setFiltersOpen,
  itemCount,
  sortBy,
  onSortChange,
  categoryFilters,
  onCategoryFilterChange,
  onClearFilters,
  showCategoryFilter,
}: FilterSortBarProps) => {

  const categories = ["Earrings", "Bracelets", "Rings", "Necklaces", "Watches"];

  return (
    <>
      <section className="w-full px-6 mb-8 border-b border-border pb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-light text-muted-foreground">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>

          <div className="flex items-center gap-4">
            {showCategoryFilter && (
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-light hover:bg-transparent"
                  >
                    Filters
                    {categoryFilters.length > 0 && (
                      <span className="ml-1 text-xs">({categoryFilters.length})</span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-background border-none shadow-none">
                  <SheetHeader className="mb-6 border-b border-border pb-4">
                    <SheetTitle className="text-lg font-light">Filters</SheetTitle>
                  </SheetHeader>

                  <div className="space-y-8">
                    {/* Category Filter */}
                    <div>
                      <h3 className="text-sm font-light mb-4 text-foreground">Category</h3>
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-3">
                            <Checkbox
                              id={category}
                              checked={categoryFilters.includes(category)}
                              onCheckedChange={(checked) => onCategoryFilterChange(category, checked as boolean)}
                              className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                            />
                            <Label htmlFor={category} className="text-sm font-light text-foreground cursor-pointer">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="border-border" />

                    <div className="flex flex-col gap-2 pt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full border-none hover:bg-transparent hover:underline font-light text-left justify-start"
                        onClick={() => {
                          onClearFilters();
                          setFiltersOpen(false);
                        }}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-auto border-none bg-transparent text-sm font-light shadow-none rounded-none pr-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="shadow-none border-none rounded-none bg-background">
                <SelectItem value="featured" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Featured</SelectItem>
                <SelectItem value="price-low" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Price: High to Low</SelectItem>
                <SelectItem value="newest" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Newest</SelectItem>
                <SelectItem value="name" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </>
  );
};

export default FilterSortBar;