import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import ProductContext from "../context/Products/ProductContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [, , cart, , cartCount, cartTotal, removeFromCart] = useContext(ProductContext);

  return (
    <header className="topbar">
      <NavLink className="brand" to="/">
        Maison Market
      </NavLink>
      <nav className="main-nav">
        <NavLink className="nav-link" to="/ProductPage">Products</NavLink>
        <NavLink className="nav-link" to="/Admin" end>Admin</NavLink>
        <NavLink className="nav-link" to="/ContactUs">Contact Us</NavLink>
        <div className="cart-wrap" style={{position: 'relative'}}>
          <button className="nav-link cart-button" onClick={() => setOpen(!open)} aria-expanded={open}>
            <FontAwesomeIcon icon={faCartShopping} style={{color: "hsv(0, 90%, 73%)"}} />
            <span className="cart-badge">{cartCount}</span>
          </button>

          {open && (
            <div className="cart-dropdown">
              <h4>Cart ({cartCount})</h4>
              {cart.length === 0 ? (
                <p className="muted">Your cart is empty.</p>
              ) : (
                <ul className="cart-items">
                  {cart.map((item) => (
                    <li key={item.id} className="cart-item">
                      <img src={item.image} alt={item.title} />
                      <div>
                        <div className="cart-item-title">{item.title}</div>
                        <div className="cart-item-meta">{item.qty} * ${Number(item.price).toFixed(2)}</div>
                      </div>
                      <button className="button button-secondary" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="cart-footer">
                <div>Total</div>
                <div><strong>${cartTotal.toFixed(2)}</strong></div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
