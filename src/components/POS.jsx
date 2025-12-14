import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // 1. Fetch Products
  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products", {
        headers: { token: localStorage.getItem("token") }
      });
      const jsonData = await response.json();
      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // 2. Add to Cart Logic
  const addToCart = (product) => {
    // Check if item already exists
    const exist = cart.find((x) => x.id === product.id);
    
    if (exist) {
      // If exists, increase quantity
      setCart(
        cart.map((x) =>
          x.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      // If new, add to cart with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // 3. Remove from Cart
  const removeFromCart = (product) => {
    const exist = cart.find((x) => x.id === product.id);
    if (exist.quantity === 1) {
      setCart(cart.filter((x) => x.id !== product.id));
    } else {
      setCart(
        cart.map((x) =>
          x.id === product.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };

  // 4. Calculate Total Automatically
  useEffect(() => {
    const newTotal = cart.reduce((acc, item) => acc + item.quantity * item.selling_price, 0);
    setTotal(newTotal);
  }, [cart]);

  // 5. Checkout (Send to Backend)
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    try {
        const body = { total_amount: total, cart: cart };
        const response = await fetch("https://pos-management-system-a8i5.onrender.com/sales/checkout", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                token: localStorage.getItem("token") 
            },
            body: JSON.stringify(body)
        });
        
        const parseRes = await response.json();
        
        if (parseRes.message === "Sale Successful") {
            alert(`Sale Complete! Receipt: ${parseRes.receipt_no}`);
            setCart([]); // Clear cart
            getProducts(); // Refresh stock quantities
        } else {
            alert("Error processing sale");
        }

    } catch (err) {
        console.error(err.message);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        
        {/* LEFT SIDE: PRODUCT LIST */}
        <div className="col-md-8 bg-light p-4 overflow-auto">
            <div className="d-flex justify-content-between mb-4">
                <h2>Point of Sale</h2>
                <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
            </div>
            
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-3 mb-3" key={product.id}>
                        <div 
                            className="card shadow-sm" 
                            style={{cursor: "pointer"}} 
                            onClick={() => addToCart(product)}
                        >
                            <div className="card-body text-center">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text text-success fw-bold">₦{product.selling_price}</p>
                                <small className="text-muted">Stock: {product.stock_quantity}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* RIGHT SIDE: CART */}
        <div className="col-md-4 bg-white border-start p-4 d-flex flex-column">
            <h3 className="mb-4">Current Sale</h3>
            
            <div className="flex-grow-1 overflow-auto">
                {cart.length === 0 ? <p className="text-muted text-center">Cart is empty</p> : (
                    <ul className="list-group list-group-flush">
                        {cart.map((item) => (
                            <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                                <div>
                                    <h6>{item.name}</h6>
                                    <small>₦{item.selling_price} x {item.quantity}</small>
                                </div>
                                <div>
                                    <span className="fw-bold me-3">₦{item.selling_price * item.quantity}</span>
                                    <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item)}>-</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mt-auto pt-3 border-top">
                <div className="d-flex justify-content-between mb-3">
                    <h4>Total:</h4>
                    <h4 className="text-primary">₦{total}</h4>
                </div>
                <button className="btn btn-success w-100 btn-lg" onClick={handleCheckout}>
                    CHECKOUT (PAY)
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default POS;