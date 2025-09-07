import React, { useEffect, useState } from "react";
import API from "../api";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.items || []);
      } catch (err) {
        console.error("❌ Error loading cart:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  // Remove a single item
  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.delete(`/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items);
    } catch (err) {
      console.error("❌ Remove cart error:", err);
    }
  };

  // Update quantity via input
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return; // Prevent invalid quantities
    try {
      const token = localStorage.getItem("token");
      const res = await API.patch(
        `/cart/update/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items);
    } catch (err) {
      console.error("❌ Update quantity error:", err);
    }
  };

  if (loading) return <p className="loading">Loading cart...</p>;
  if (!cart.length) return <p className="empty">🛍️ Your cart is empty.</p>;

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 My Cart</h2>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <div className="cart-info">
              <h3>{item.name}</h3>
              <p className="desc">{item.description}</p>

              <p className="price-line">
                <span className="label">Price per item:</span> ₹{item.price}
              </p>

              <p className="price-line">
                <span className="label">Quantity:</span>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                  style={{ width: "60px", marginLeft: "8px" }}
                />
              </p>

              <p className="price-line total">
                <span className="label">Total:</span> ₹{item.total}
              </p>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
