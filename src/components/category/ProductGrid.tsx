import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import pantheonImage from "@/assets/pantheon.jpg";
import eclipseImage from "@/assets/eclipse.jpg";
import haloImage from "@/assets/halo.jpg";
import obliqueImage from "@/assets/oblique.jpg";
import lintelImage from "@/assets/lintel.jpg";
import shadowlineImage from "@/assets/shadowline.jpg";
import organicEarring from "@/assets/organic-earring.png";
import linkBracelet from "@/assets/link-bracelet.png";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  isNew?: boolean;
}

// Extended product list for category page
const products: Product[] = [
  {
    id: 1,
    name: "Pantheon",
    category: "Earrings",
    price: "AED 10,450",
    image: pantheonImage,
    isNew: true,
  },
  {
    id: 2,
    name: "Eclipse",
    category: "Bracelets",
    price: "AED 11,750",
    image: eclipseImage,
  },
  {
    id: 3,
    name: "Halo",
    category: "Earrings",
    price: "AED 7,150",
    image: haloImage,
    isNew: true,
  },
  {
    id: 4,
    name: "Oblique",
    category: "Earrings",
    price: "AED 6,050",
    image: obliqueImage,
  },
  {
    id: 5,
    name: "Lintel",
    category: "Earrings",
    price: "AED 8,250",
    image: lintelImage,
  },
  {
    id: 6,
    name: "Shadowline",
    category: "Bracelets",
    price: "AED 14,500",
    image: shadowlineImage,
  },
  {
    id: 7,
    name: "Meridian",
    category: "Earrings",
    price: "AED 8,990",
    image: pantheonImage,
  },
  {
    id: 8,
    name: "Vertex",
    category: "Bracelets",
    price: "AED 10,270",
    image: eclipseImage,
  },
  {
    id: 9,
    name: "Apex",
    category: "Earrings",
    price: "AED 5,690",
    image: haloImage,
  },
  {
    id: 10,
    name: "Zenith",
    category: "Earrings",
    price: "AED 6,790",
    image: obliqueImage,
  },
  {
    id: 11,
    name: "Prism",
    category: "Earrings",
    price: "AED 7,520",
    image: lintelImage,
  },
  {
    id: 12,
    name: "Radiant",
    category: "Bracelets",
    price: "AED 13,390",
    image: shadowlineImage,
  },
  {
    id: 13,
    name: "Stellar",
    category: "Earrings",
    price: "AED 7,890",
    image: pantheonImage,
  },
  {
    id: 14,
    name: "Cosmos",
    category: "Bracelets",
    price: "AED 10,820",
    image: eclipseImage,
  },
  {
    id: 15,
    name: "Aurora",
    category: "Earrings",
    price: "AED 6,420",
    image: haloImage,
  },
  {
    id: 16,
    name: "Nebula",
    category: "Earrings",
    price: "AED 6,790",
    image: obliqueImage,
  },
  {
    id: 17,
    name: "Orbit",
    category: "Earrings",
    price: "AED 8,620",
    image: lintelImage,
  },
  {
    id: 18,
    name: "Galaxy",
    category: "Bracelets",
    price: "AED 12,660",
    image: shadowlineImage,
  },
  {
    id: 19,
    name: "Lunar",
    category: "Earrings",
    price: "AED 7,520",
    image: pantheonImage,
  },
  {
    id: 20,
    name: "Solar",
    category: "Bracelets",
    price: "AED 11,560",
    image: eclipseImage,
  },
  {
    id: 21,
    name: "Astral",
    category: "Earrings",
    price: "AED 6,050",
    image: haloImage,
  },
  {
    id: 22,
    name: "Cosmic",
    category: "Earrings",
    price: "AED 7,150",
    image: obliqueImage,
  },
  {
    id: 23,
    name: "Celestial",
    category: "Earrings",
    price: "AED 8,250",
    image: lintelImage,
  },
  {
    id: 24,
    name: "Ethereal",
    category: "Bracelets",
    price: "AED 13,760",
    image: shadowlineImage,
  },
];

const ProductGrid = () => {
  return (
    <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card 
                className="border-none shadow-none bg-transparent group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                    />
                    <img
                      src={product.category === "Earrings" ? organicEarring : linkBracelet}
                      alt={`${product.name} lifestyle`}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/[0.03]"></div>
                    {product.isNew && (
                      <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light text-foreground">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm font-light text-foreground">
                        {product.price}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      
      <Pagination />
    </section>
  );
};

export default ProductGrid;