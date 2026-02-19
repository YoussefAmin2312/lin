import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDescription from "../components/product/ProductDescription";
import ProductCarousel from "../components/content/ProductCarousel";
import { getProductById, products } from "@/data/products";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const ProductDetail = () => {
  const { productId } = useParams();
  const product = getProductById(Number(productId));

  // Fallback for unknown product IDs
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-6 px-6">
          <div className="text-center py-20">
            <h1 className="text-2xl font-light text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Link to="/category/shop" className="text-sm font-light underline text-foreground hover:text-muted-foreground">
              Browse All Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get related products from same category (exclude current product)
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);
  // Get other products from a different category
  const otherProducts = products.filter(p => p.category !== product.category).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <section className="w-full px-6">
          {/* Breadcrumb - Show above image on smaller screens */}
          <div className="lg:hidden mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/category/${product.category.toLowerCase()}`}>{product.category}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <ProductImageGallery productImage={product.image} hoverImage={product.hoverImage} productName={product.name} />

            <div className="lg:pl-12 mt-8 lg:mt-0 lg:sticky lg:top-6 lg:h-fit">
              <ProductInfo product={product} />
              <ProductDescription />
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="w-full mt-16 lg:mt-24">
            <div className="mb-4 px-6">
              <h2 className="text-sm font-light text-foreground">You might also like</h2>
            </div>
            <ProductCarousel filterProducts={relatedProducts} />
          </section>
        )}

        {otherProducts.length > 0 && (
          <section className="w-full">
            <div className="mb-4 px-6">
              <h2 className="text-sm font-light text-foreground">Our other {product.category === "Earrings" ? "Bracelets" : "Earrings"}</h2>
            </div>
            <ProductCarousel filterProducts={otherProducts} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;