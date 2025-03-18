import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import adminLoginImg from '../assets/images/admin-login.jpg';
import adminRegisterImg from '../assets/images/adm-reg.jpg';
import associateLoginImg from '../assets/images/associate-login.jpg';
import associateRegisterImg from '../assets/images/associate-reg.jpg';

const HomePage = () => {
    return (
        <div className="container mt-5">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="navbar-brand" to="/">Rocket Computers</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Admin Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Admin Register</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/associate-login">Associate Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/associate-register">Associate Register</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Home Page with Cards */}
            <hr />
            <div className="row">
                {/* Admin Login Card */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <img src={adminLoginImg} className="card-img-top" alt="Admin Login" />
                        <div className="card-body text-center">
                            <h5 className="card-title">Admin Login</h5>
                            <Link to="/login" className="btn btn-primary">Go to Login</Link>
                        </div>
                    </div>
                </div>

                {/* Admin Register Card */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <img src={adminRegisterImg} className="card-img-top" alt="Admin Register" />
                        <div className="card-body text-center">
                            <h5 className="card-title">Admin Register</h5>
                            <Link to="/register" className="btn btn-primary">Go to Register</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                {/* Associate Login Card */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <img src={associateLoginImg} className="card-img-top" alt="Associate Login" />
                        <div className="card-body text-center">
                            <h5 className="card-title">Associate Login</h5>
                            <Link to="/associate-login" className="btn btn-primary">Go to Login</Link>
                        </div>
                    </div>
                </div>

                {/* Associate Register Card */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <img src={associateRegisterImg} className="card-img-top" alt="Associate Register" />
                        <div className="card-body text-center">
                            <h5 className="card-title">Associate Register</h5>
                            <Link to="/associate-register" className="btn btn-primary">Go to Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
