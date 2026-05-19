import { useState, useContext } from "react";
import ProductContext from "../context/Products/ProductContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

function ProductPage() {
  const [products, setProducts] = useContext(ProductContext);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const averagePrice = products.length
    ? products.reduce((total, product) => total + (Number(product.price) || 0), 0) / products.length
    : 0;
  const premiumCount = products.filter((product) => Number(product.price) >= averagePrice).length;

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
    const searchable = `${product.title || ""} ${product.description || ""} ${product.category || ""}`.toLowerCase();
    const matchesSearch = searchable.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleDelete(id) {
    setProducts(products.filter((product) => product.id !== id));
  }

  function handleUpdatePrice(id, newPrice) {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, price: Number(newPrice) } : product
      )
    );
  }

  return (
    <>
        <Navbar />
      <main className="catalog-page">
        <section className="catalog-hero">
          <div className="hero-content">
            <span className="eyebrow">Curated essentials</span>
            <h1>Premium goods for sharper everyday living.</h1>
            <p>
              Discover a refined collection of technology, fashion, accessories, and lifestyle pieces selected for quality,
              performance, and lasting appeal.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#collection">Explore Collection</a>
              <a className="button button-secondary" href="/Admin">Manage Inventory</a>
            </div>
          </div>

          <div className="hero-showcase" aria-label="Featured collection preview">
            {products.slice(0, 3).map((product) => (
              <div className="showcase-tile" key={product.id}>
                <img src={product.image} alt={product.title} />
                <span>{product.category}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="catalog-stats" aria-label="Collection statistics">
          <div>
            <span>{products.length}</span>
            <p>Curated products</p>
          </div>
          <div>
            <span>{categories.length}</span>
            <p>Categories</p>
          </div>
          <div>
            <span>{premiumCount}</span>
            <p>Premium picks</p>
          </div>
        </section>

        <section id="collection" className="collection-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">The collection</span>
              <h2>Shop the edit</h2>
            </div>
            <p>{filteredProducts.length} products matching your selection</p>
          </div>

          <div className="filter-bar">
            <label htmlFor="category">
              <span>Category</span>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <label htmlFor="search">
              <span>Search</span>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, details, or categories"
              />
            </label>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                  onUpdatePrice={handleUpdatePrice}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try another search term or clear the selected category.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default ProductPage;
