import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Items() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  async function load() {
    const params = {};
    if (q) params.q = q;
    if (category) params.category = category;
    if (minPrice) params.minPrice = Number(minPrice);
    if (maxPrice) params.maxPrice = Number(maxPrice);
    const res = await API.get('/items', { params });
    setItems(res.data);
  }

  useEffect(() => { load(); }, []);

  async function addToCart(itemId) {
    const token = localStorage.getItem('token');
    if (!token) {
      const anon = JSON.parse(localStorage.getItem('anon_cart') || '[]');
      const ex = anon.find(a => a.itemId === itemId);
      if (ex) ex.qty += 1; else anon.push({ itemId, qty: 1 });
      localStorage.setItem('anon_cart', JSON.stringify(anon));
      alert('Added to cart anonymously. Login to persist to your account.');
      return;
    }
    await API.post('/cart/add', { itemId, quantity: 1 });
    alert('Added to cart');
  }

  return (
    <div>
      <div className="card">
        <h3>Filters</h3>
        <div>
          <input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
          <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <input placeholder="Min price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          <input placeholder="Max price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          <button onClick={load}>Apply</button>
        </div>
      </div>

      <div className="grid">
        {items.map(it => (
          <div className="card product" key={it._id}>
            <h4>{it.name}</h4>
            <div className="small">{it.description}</div>
            <div>Category: {it.category}</div>
            <div>Price: ₹{it.price}</div>
            <button onClick={() => addToCart(it._id)}>Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
