import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    company_name: "",
    full_name: "",
    email: "",
    password: ""
  });

  const { company_name, full_name, email, password } = inputs;

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { company_name, full_name, email, password };
      const response = await fetch("https://pos-server-km8a.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
      } else {
        setAuth(false);
        alert(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8"> {/* Wider card for more inputs */}
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Create Business Account</h2>
              
              <form onSubmit={onSubmitForm}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Company Name</label>
                        <input
                            type="text"
                            name="company_name"
                            className="form-control"
                            value={company_name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            className="form-control"
                            value={full_name}
                            onChange={onChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </div>

                <button className="btn btn-success w-100 btn-lg">Get Started</button>
              </form>

              <div className="text-center mt-3">
                <small>
                  Already have an account? <Link to="/login">Login here</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;