
import React from "react";
import "./Footer.css";

import { CiLocationOn, CiMail } from "react-icons/ci";
import { FaPhone } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";

import logo_green from "../../images/logo_green.png";
import store_locations from "../../images/store locations.jpg";

export const Footer = () => {
    return (
        <>
            <footer>

                <div className="container">

                    <div className="row gy-5">

                        {/* LOGO + CONTACT */}
                        <div className="col-lg-3 col-md-6">

                            <div className="footer-logo">

                                <a href="/">
                                    <img
                                        src={logo_green}
                                        alt="Book Store Logo"
                                    />
                                </a>

                            </div>

                            <ul className="widget">

                                <li className="widget-list">
                                    <CiLocationOn className="widget-icon" />

                                    <p>
                                        Đại học Nông Lâm TP.HCM,
                                        Linh Trung, Thủ Đức
                                    </p>
                                </li>

                                <li className="widget-list">
                                    <FaPhone className="widget-icon" />

                                    <p>
                                        Phone: 0793684680
                                    </p>
                                </li>

                                <li className="widget-list">
                                    <CiMail className="widget-icon" />

                                    <p>
                                        Email:
                                        201030277@st.hcmuaf.edu.vn
                                    </p>
                                </li>

                            </ul>

                        </div>

                        {/* SHOPPING GUIDE */}
                        <div className="col-lg-3 col-md-6">

                            <div className="widget-nav-menu">

                                <h2 className="widget-title">
                                    Shopping Guide
                                </h2>

                                <ul className="menu-footer-container">

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">How to Buy</a>
                                    </li>

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">FAQ</a>
                                    </li>

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">Store Locations</a>
                                    </li>

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">Return Policy</a>
                                    </li>

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">Payment</a>
                                    </li>

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">Shipment</a>
                                    </li>

                                </ul>

                            </div>

                        </div>

                        {/* INFORMATION */}
                        <div className="col-lg-3 col-md-6">

                            <div className="widget-nav-menu">

                                <h2 className="widget-title">
                                    Information
                                </h2>

                                <ul className="menu-footer-container">

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">About Us</a>
                                    </li>

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">Delivery Information</a>
                                    </li>

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">Privacy Policy</a>
                                    </li>

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">Discount</a>
                                    </li>

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">Customer Service</a>
                                    </li>

                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon" />
                                        <a href="/">Terms & Conditions</a>
                                    </li>

                                </ul>

                            </div>

                        </div>

                        {/* STORE IMAGE */}
                        <div className="col-lg-3 col-md-6">

                            <div className="widget-nav-menu">

                                <h2 className="widget-title">
                                    Store Locations
                                </h2>

                                <div className="text-widget">

                                    <img
                                        src={store_locations}
                                        alt="Store Locations"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* COPYRIGHT */}
                <div className="copy-right">

                    <div className="container">

                        <small>
                            Copyright © 2026 Book Store.
                            All Rights Reserved.
                        </small>

                    </div>

                </div>

            </footer>
        </>
    );
};