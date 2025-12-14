import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Optional: if you installed toastify

const Products = () => {
  const [products, setProducts] = useState([]);
  
  const [inputs, setInputs] = useState({
    name: "",
    cost_price: "",
    selling_price: "",
    stock_quantity: ""
  });

  const { name, cost_price, selling_price, stock_quantity } = inputs;

  // 1. GET PRODUCTS
  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "GET",
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

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // 2. ADD PRODUCT
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { name, cost_price, selling_price, stock_quantity };
      
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            token: localStorage.getItem("token") 
        },
        body: JSON.stringify(body)
      });

      const newProduct = await response.json();

      // Update UI immediately
      setProducts([newProduct, ...products]);
      setInputs({ name: "", cost_price: "", selling_price: "", stock_quantity: "" });
      alert("Product Added!");

    } catch (err) {
      console.error(err.message);
    }
  };

  // 3. DELETE PRODUCT (NEW)
  const deleteProduct = async (id) => {
    try {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        await fetch(`https://pos-server-km8a.onrender.com/products/${id}`, {
            method: "DELETE",
            headers: { token: localStorage.getItem("token") }
        });

        // Remove from UI immediately (filter out the deleted one)
        setProducts(products.filter(product => product.id !== id));
    
    } catch (err) {
        console.error(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Product Inventory</h3>

      {/* ADD FORM */}
      <div className="card p-4 shadow-sm mb-5 border-0 bg-light">
        <h5 className="mb-3 text-primary">Add New Product</h5>
        <form onSubmit={onSubmitForm}>
            <div className="row g-2">
                <div className="col-md-4">
                    <input type="text" name="name" placeholder="Product Name (e.g. Rice)" className="form-control" value={name} onChange={onChange} required />
                </div>
                <div className="col-md-2">
                    <input type="number" name="cost_price" placeholder="Cost (₦)" className="form-control" value={cost_price} onChange={onChange} required />
                </div>
                <div className="col-md-2">
                    <input type="number" name="selling_price" placeholder="Price (₦)" className="form-control" value={selling_price} onChange={onChange} required />
                </div>
                <div className="col-md-2">
                    <input type="number" name="stock_quantity" placeholder="Qty" className="form-control" value={stock_quantity} onChange={onChange} required />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-success w-100">Add Product</button>
                </div>
            </div>
        </form>
      </div>

      {/* PRODUCT LIST */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
            <table className="table table-hover mb-0">
                <thead className="bg-dark text-white">
                    <tr>
                        <th scope="col" className="ps-4">Product Name</th>
                        <th scope="col">Cost Price</th>
                        <th scope="col">Selling Price</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-4">No products in inventory yet.</td></tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td className="ps-4 fw-bold">{product.name}</td>
                                <td>₦{product.cost_price}</td>
                                <td className="text-success fw-bold">₦{product.selling_price}</td>
                                <td>
                                    <span className={`badge ${product.stock_quantity < 5 ? 'bg-danger' : 'bg-secondary'}`}>
                                        {product.stock_quantity}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => deleteProduct(product.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Products;