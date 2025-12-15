import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print"; // We need to install this

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  
  // State for Receipt
  const [lastSale, setLastSale] = useState(null);
  
  // Ref for Printing
  const componentRef = useRef();

  // 1. Fetch Products
  const getProducts = async () => {
    try {
      const response = await fetch("https://pos-server-km8a.onrender.com/products", {
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

  // 2. Add to Cart
  const addToCart = (product) => {
    const exist = cart.find((x) => x.id === product.id);
    if (exist) {
      setCart(cart.map((x) => x.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : x));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // 3. Remove from Cart
  const removeFromCart = (product) => {
    const exist = cart.find((x) => x.id === product.id);
    if (exist.quantity === 1) {
      setCart(cart.filter((x) => x.id !== product.id));
    } else {
      setCart(cart.map((x) => x.id === product.id ? { ...exist, quantity: exist.quantity - 1 } : x));
    }
  };

  useEffect(() => {
    setTotal(cart.reduce((acc, item) => acc + item.quantity * item.selling_price, 0));
  }, [cart]);

  // 4. Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    try {
        const body = { total_amount: total, cart: cart };
        const response = await fetch("https://pos-server-km8a.onrender.com/sales/checkout", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                token: localStorage.getItem("token") 
            },
            body: JSON.stringify(body)
        });
        
        const parseRes = await response.json();
        
        if (parseRes.message === "Sale Successful") {
            // Save sale details for printing
            setLastSale({
                receipt_no: parseRes.receipt_no,
                items: cart,
                total: total,
                date: new Date().toLocaleString()
            });

            setCart([]); // Clear cart
            getProducts(); // Refresh stock
        } else {
            alert("Error processing sale");
        }

    } catch (err) {
        console.error(err.message);
    }
  };

  // 5. Print Function logic
  // We need to trigger the browser print window
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        
        {/* LEFT SIDE: PRODUCT LIST */}
        <div className="col-md-8 bg-light p-4 overflow-auto d-print-none">
            <div className="d-flex justify-content-between mb-4">
                <h2>Point of Sale</h2>
                <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
            </div>
            
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-3 mb-3" key={product.id}>
                        <div className="card shadow-sm h-100" style={{cursor: "pointer"}} onClick={() => addToCart(product)}>
                            <div className="card-body text-center">
                                <h6 className="card-title">{product.name}</h6>
                                <p className="text-success fw-bold m-0">₦{product.selling_price}</p>
                                <small className="text-muted">Stock: {product.stock_quantity}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* RIGHT SIDE: CART & RECEIPT */}
        <div className="col-md-4 bg-white border-start p-4 d-flex flex-column">
            
            {/* If a sale just finished, show the receipt view */}
            {lastSale ? (
                <div className="text-center mt-5">
                    <div className="receipt-box border p-3 mb-3" id="printable-receipt">
                        <h4>Sales Receipt</h4>
                        <p><strong>Receipt #:</strong> {lastSale.receipt_no}</p>
                        <p>{lastSale.date}</p>
                        <hr/>
                        <ul className="list-unstyled text-start">
                            {lastSale.items.map((item, index) => (
                                <li key={index} className="d-flex justify-content-between">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>₦{item.selling_price * item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                        <hr/>
                        <h3>Total: ₦{lastSale.total}</h3>
                        <p className="mt-3">Thank you for your business!</p>
                    </div>

                    <button className="btn btn-primary w-100 mb-2 d-print-none" onClick={() => window.print()}>
                        <i className="bi bi-printer"></i> Print Receipt
                    </button>
                    <button className="btn btn-secondary w-100 d-print-none" onClick={() => setLastSale(null)}>
                        New Sale
                    </button>
                </div>
            ) : (
                <>
                    {/* CART VIEW */}
                    <h3 className="mb-4">Current Cart</h3>
                    <div className="flex-grow-1 overflow-auto">
                        {cart.length === 0 ? <p className="text-muted text-center">Select products to add</p> : (
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
                            PAY & PRINT
                        </button>
                    </div>
                </>
            )}
        </div>

      </div>

      {/* PRINT STYLES: Hides everything except the receipt when printing */}
      <style>
        {`
            @media print {
                .d-print-none { display: none !important; }
                #printable-receipt { display: block !important; border: none !important; }
                body * { visibility: hidden; }
                #printable-receipt, #printable-receipt * { visibility: visible; }
                #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; }
            }
        `}
      </style>
    </div>
  );
};

export default POS;