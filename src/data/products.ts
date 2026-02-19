import pantheonImage from "@/assets/pantheon.jpg";
import eclipseImage from "@/assets/eclipse.jpg";
import haloImage from "@/assets/halo.jpg";
import obliqueImage from "@/assets/oblique.jpg";
import lintelImage from "@/assets/lintel.jpg";
import shadowlineImage from "@/assets/shadowline.jpg";
import organicEarring from "@/assets/organic-earring.png";
import linkBracelet from "@/assets/link-bracelet.png";
import earringsCollectionHover from "@/assets/earrings-collection.png";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  priceNumeric: number;
  image: string;
  hoverImage: string;
  isNew?: boolean;
  material?: string;
  dimensions?: string;
  weight?: string;
  editorNotes?: string;
}

export const products: Product[] = [
  // ─── EARRINGS ───────────────────────────────────────
  {
    id: 1,
    name: "Pantheon",
    category: "Earrings",
    price: "AED 10,450",
    priceNumeric: 10450,
    image: pantheonImage,
    hoverImage: earringsCollectionHover,
    isNew: true,
    material: "18k Gold Plated Sterling Silver",
    dimensions: "2.5cm x 1.2cm",
    weight: "4.2g per earring",
    editorNotes: "A modern interpretation of classical architecture, these earrings bridge timeless elegance with contemporary minimalism.",
  },
  {
    id: 2,
    name: "Halo",
    category: "Earrings",
    price: "AED 7,150",
    priceNumeric: 7150,
    image: haloImage,
    hoverImage: "/circleear.png",
    isNew: true,
    material: "Sterling Silver with Gold Vermeil",
    dimensions: "2.0cm x 2.0cm",
    weight: "3.8g per earring",
    editorNotes: "A luminous circle of light, these earrings evoke an ethereal glow that complements any ensemble.",
  },
  {
    id: 3,
    name: "Oblique",
    category: "Earrings",
    price: "AED 6,050",
    priceNumeric: 6050,
    image: obliqueImage,
    hoverImage: "/square.png",
    material: "Sterling Silver",
    dimensions: "3.0cm x 0.8cm",
    weight: "3.2g per earring",
    editorNotes: "Angled lines create a dynamic sense of movement, making these earrings a striking statement of modern geometry.",
  },
  {
    id: 4,
    name: "Lintel",
    category: "Earrings",
    price: "AED 8,250",
    priceNumeric: 8250,
    image: lintelImage,
    hoverImage: organicEarring,
    material: "18k Gold Plated Sterling Silver",
    dimensions: "2.8cm x 1.0cm",
    weight: "4.5g per earring",
    editorNotes: "Architectural precision meets wearable art in these structural earrings inspired by classical building elements.",
  },
  {
    id: 5,
    name: "Apex",
    category: "Earrings",
    price: "AED 5,690",
    priceNumeric: 5690,
    image: haloImage,
    hoverImage: "/circleear.png",
    material: "Sterling Silver",
    dimensions: "1.8cm x 1.8cm",
    weight: "3.0g per earring",
    editorNotes: "Reaching the highest point of elegance, these earrings are a celebration of minimalist craftsmanship.",
  },
  {
    id: 6,
    name: "Nebula",
    category: "Earrings",
    price: "AED 6,790",
    priceNumeric: 6790,
    image: obliqueImage,
    hoverImage: "/square.png",
    material: "Sterling Silver",
    dimensions: "2.5cm x 1.0cm",
    weight: "3.4g per earring",
    editorNotes: "Soft, cloud-like forms give these earrings an otherworldly quality that captivates.",
  },

  // ─── BRACELETS ──────────────────────────────────────
  {
    id: 7,
    name: "Eclipse",
    category: "Bracelets",
    price: "AED 11,750",
    priceNumeric: 11750,
    image: eclipseImage,
    hoverImage: linkBracelet,
    material: "18k Rose Gold",
    dimensions: "18cm adjustable chain",
    weight: "12.8g",
    editorNotes: "Inspired by the celestial phenomenon, this bracelet captures the dramatic beauty of a solar eclipse in precious metal.",
  },
  {
    id: 8,
    name: "Shadowline",
    category: "Bracelets",
    price: "AED 14,500",
    priceNumeric: 14500,
    image: shadowlineImage,
    hoverImage: linkBracelet,
    material: "18k Gold",
    dimensions: "17.5cm adjustable chain",
    weight: "15.2g",
    editorNotes: "The interplay of light and shadow is captured in every link of this luxurious bracelet.",
  },
  {
    id: 9,
    name: "Arcus",
    category: "Bracelets",
    price: "AED 9,850",
    priceNumeric: 9850,
    image: eclipseImage,
    hoverImage: "/arcus-bracelet.png",
    isNew: true,
    material: "18k Gold Plated Sterling Silver",
    dimensions: "17cm adjustable chain",
    weight: "11.0g",
    editorNotes: "A graceful arc of gold traces the wrist, embodying the perfect curve where strength meets beauty.",
  },
  {
    id: 10,
    name: "Span",
    category: "Bracelets",
    price: "AED 12,300",
    priceNumeric: 12300,
    image: shadowlineImage,
    hoverImage: "/span-bracelet.png",
    material: "18k Rose Gold",
    dimensions: "18cm adjustable",
    weight: "13.5g",
    editorNotes: "Bridging the gap between art and adornment, this bracelet spans the full range of modern elegance.",
  },

  // ─── RINGS ──────────────────────────────────────────
  {
    id: 11,
    name: "Aurora Ring",
    category: "Rings",
    price: "AED 8,900",
    priceNumeric: 8900,
    image: "/ring-aurora.jpg",
    hoverImage: "/model-ring.webp",
    isNew: true,
    material: "18k Gold",
    dimensions: "Band width 3mm",
    weight: "5.2g",
    editorNotes: "The northern lights translated into sculptural form — a ring of shimmering, ethereal beauty.",
  },
  {
    id: 12,
    name: "Prism Ring",
    category: "Rings",
    price: "AED 7,520",
    priceNumeric: 7520,
    image: "/ring-prism.jpg",
    hoverImage: "/model-ring.webp",
    material: "18k Gold Plated Sterling Silver",
    dimensions: "Band width 2.5mm",
    weight: "4.8g",
    editorNotes: "Light refracts through geometric forms, creating an ever-changing display of brilliance on the finger.",
  },
  {
    id: 13,
    name: "Zenith Ring",
    category: "Rings",
    price: "AED 6,790",
    priceNumeric: 6790,
    image: "/ring-zenith.jpg",
    hoverImage: "/model-ring.webp",
    isNew: true,
    material: "Sterling Silver with Gold Vermeil",
    dimensions: "Band width 2mm",
    weight: "4.0g",
    editorNotes: "The peak of modern ring design, where clean lines meet luxurious materials in perfect harmony.",
  },

  // ─── NECKLACES ──────────────────────────────────────
  {
    id: 14,
    name: "Cosmos Necklace",
    category: "Necklaces",
    price: "AED 13,200",
    priceNumeric: 13200,
    image: "/necklace-cosmos.jpg",
    hoverImage: "/model-necklace.jpg",
    isNew: true,
    material: "18k Gold",
    dimensions: "42cm chain, pendant 1.5cm",
    weight: "8.5g",
    editorNotes: "The vastness of the universe distilled into an intimate pendant that rests close to the heart.",
  },
  {
    id: 15,
    name: "Orbit Necklace",
    category: "Necklaces",
    price: "AED 10,850",
    priceNumeric: 10850,
    image: "/necklace-orbit.jpg",
    hoverImage: "/model-necklace.jpg",
    material: "18k Rose Gold",
    dimensions: "45cm chain, pendant 2cm",
    weight: "7.2g",
    editorNotes: "Circular motion captured in gold — a necklace that revolves around the idea of perpetual elegance.",
  },

  // ─── WATCHES ────────────────────────────────────────
  {
    id: 16,
    name: "Apex Watch",
    category: "Watches",
    price: "AED 24,500",
    priceNumeric: 24500,
    image: "/watch-apex.jpg",
    hoverImage: "/model-watch.jpg",
    isNew: true,
    material: "Stainless Steel with Sapphire Crystal",
    dimensions: "38mm case diameter",
    weight: "85g",
    editorNotes: "Reaching the highest point of watchmaking elegance, the Apex combines Swiss precision with minimalist design.",
  },
  {
    id: 17,
    name: "Eclipse Watch",
    category: "Watches",
    price: "AED 28,750",
    priceNumeric: 28750,
    image: "/watch-eclipse.jpg",
    hoverImage: "/model-watch.jpg",
    material: "18k Gold with Leather Strap",
    dimensions: "40mm case diameter",
    weight: "92g",
    editorNotes: "Inspired by the celestial phenomenon, this timepiece captures the dramatic beauty of a solar eclipse on the dial.",
  },
  {
    id: 18,
    name: "Meridian Watch",
    category: "Watches",
    price: "AED 22,300",
    priceNumeric: 22300,
    image: "/watch-meridian.jpg",
    hoverImage: "/model-watch.jpg",
    isNew: true,
    material: "Titanium with Sapphire Crystal",
    dimensions: "36mm case diameter",
    weight: "68g",
    editorNotes: "Tracing the invisible lines of longitude, the Meridian brings global inspiration to refined timekeeping.",
  },
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(p => p.id === id);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
};

export const filterAndSortProducts = (
  sortBy: string,
  categoryFilters: string[] = [],
  searchQuery: string = ""
): Product[] => {
  let filtered = [...products];

  // Filter by search query
  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }

  // Filter by categories
  if (categoryFilters.length > 0) {
    filtered = filtered.filter(p =>
      categoryFilters.includes(p.category)
    );
  }

  // Sort
  switch (sortBy) {
    case "price-low":
      filtered.sort((a, b) => a.priceNumeric - b.priceNumeric);
      break;
    case "price-high":
      filtered.sort((a, b) => b.priceNumeric - a.priceNumeric);
      break;
    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    default: // "featured" - keep original order
      break;
  }

  return filtered;
};
