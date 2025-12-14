import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <div className="container">
            <Link className="navbar-brand fw-bold text-primary" to="/">
                <i className="bi bi-shop-window me-2"></i> 
                BizManager SaaS
            </Link>
            <div>
                <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="container flex-grow-1 d-flex align-items-center mt-5">
        <div className="row align-items-center">
            <div className="col-md-6">
                <h1 className="display-4 fw-bold text-dark">
                    Manage Your Business <br/>
                    <span className="text-primary">Like a Pro.</span>
                </h1>
                <p className="lead text-muted my-4">
                    The all-in-one POS, Inventory, and Financial Management system designed for entrepreneurs. 
                    Track sales, manage stock, and see your profits in real-time.
                </p>
                <div className="d-flex gap-3">
                    <Link to="/register" className="btn btn-primary btn-lg px-4">Start Free Trial</Link>
                    <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">Log In</Link>
                </div>
                <p className="mt-3 small text-muted">
                    <i className="bi bi-check-circle-fill text-success me-1"></i> No credit card required 
                    <i className="bi bi-check-circle-fill text-success ms-3 me-1"></i> Cancel anytime
                </p>
            </div>
            
            {/* ILLUSTRATION (Using a placeholder image) */}
            <div className="col-md-6 mt-5 mt-md-0 text-center">
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/3076/3076404.png" 
                    alt="Dashboard Illustration" 
                    className="img-fluid" 
                    style={{maxHeight: "400px"}}
                />
            </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="bg-white py-5 mt-5">
        <div className="container">
            <div className="row text-center">
                <div className="col-md-4 mb-4">
                    <div className="p-4 border rounded shadow-sm h-100">
                        <h1 className="text-primary"><i className="bi bi-calculator"></i></h1>
                        <h4 className="mt-3">Point of Sale</h4>
                        <p className="text-muted">Fast checkout, receipt generation, and automatic stock deduction.</p>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="p-4 border rounded shadow-sm h-100">
                        <h1 className="text-success"><i className="bi bi-box-seam"></i></h1>
                        <h4 className="mt-3">Inventory</h4>
                        <p className="text-muted">Track products, set prices, and never run out of stock again.</p>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="p-4 border rounded shadow-sm h-100">
                        <h1 className="text-warning"><i className="bi bi-graph-up-arrow"></i></h1>
                        <h4 className="mt-3">Analytics</h4>
                        <p className="text-muted">Visual dashboards showing your total sales, income, and profit.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">&copy; 2025 BizManager SaaS. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Landing;