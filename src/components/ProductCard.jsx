import { useContext } from "react";
import ProductContext from "../context/Products/ProductContext";

function ProductCard({ product }) {
  const stock = Number.isFinite(Number(product.stock)) ? Number(product.stock) : 12;
  const rating = typeof product.rating === "object" ? product.rating?.rate : product.rating;
  const reviewCount = typeof product.rating === "object" ? product.rating?.count : product.sales;
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(product.price) || 0);

  const [addToCart] = useContext(ProductContext);

  function stockStatus() {
    if (stock === 0) {
      return "Out of Stock";
    }

    if (stock <= 10) {
      return "Low Stock";
    }

    return "Ready to Ship";
  }

  return (
    <article className="product-card">
      <div className="product-media">
        <span className={`stock-pill ${stock === 0 ? "stock-out" : stock <= 10 ? "stock-low" : "stock-ready"}`}>
          {stockStatus()}
        </span>
        <img src={product.image} alt={product.title} />
      </div>

      <div className="product-card-body">
        <div className="product-card-kicker">
          <span>{product.category}</span>
          {rating && <span>{rating} stars</span>}
        </div>

        <h2>{product.title}</h2>
        <p>{product.description}</p>

        <div className="product-meta">
          <div>
            <span className="meta-label">Inventory</span>
            <strong>{stock} units</strong>
          </div>
          <div>
            <span className="meta-label">Demand</span>
            <strong>{reviewCount || "New"}</strong>
          </div>
        </div>

        <div className="product-card-footer">
          <strong>{price}</strong>
          <div style={{display: 'flex', gap: '8px'}}>
            <button type="button">View</button>
            <button type="button" onClick={() => addToCart(product)}>Buy</button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard;
