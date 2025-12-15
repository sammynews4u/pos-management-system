import React from "react";
import { usePaystackPayment } from "react-paystack";

const Subscription = () => {
  const token = localStorage.getItem("token");

  // ⚠️ REPLACE WITH YOUR PAYSTACK PUBLIC KEY
  const publicKey = "pk_test_YOUR_OWN_PUBLIC_KEY_HERE"; 

  // Payment Config (5000 Naira)
  const config = {
    reference: (new Date()).getTime().toString(),
    email: "user@example.com", // You can fetch real email if you want
    amount: 500000, // 5000 Naira (in Kobo)
    publicKey: publicKey,
  };

  // What happens after payment
  const onSuccess = async (reference) => {
    try {
        const response = await fetch("https://pos-server-km8a.onrender.com/payment/verify", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                token: token 
            },
            body: JSON.stringify({ reference: reference.reference })
        });

        const parseRes = await response.json();

        if (parseRes.message === "Payment Successful") {
            alert("Payment Successful! Access Granted.");
            window.location.href = "/dashboard"; // Redirect to Dashboard
        }
    } catch (err) {
        console.error("Verification Error:", err);
    }
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="card shadow-lg p-5 text-center" style={{maxWidth: "500px"}}>
            <h1 className="text-primary mb-3">Activate Account</h1>
            <p className="lead text-muted">
                To access the POS System and Inventory Manager, you need an active subscription.
            </p>
            <hr />
            <h2 className="display-4 fw-bold">₦5,000</h2>
            <p className="text-muted">Per Month</p>
            
            <button 
                className="btn btn-success btn-lg w-100 mt-4"
                onClick={() => {
                    initializePayment(onSuccess, onClose)
                }}
            >
                Pay Now (Secure)
            </button>
            
            <button className="btn btn-link mt-3" onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }}>
                Logout
            </button>
        </div>
    </div>
  );
};

export default Subscription;