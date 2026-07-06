
import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

import { CiLocationOn, CiMail } from "react-icons/ci";
import { FaPhone } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";

import logo_green from "../../images/logo_green.png";
import store_locations from "../../images/store locations.jpg";

export const Footer = () => {
    const shoppingGuideLinks = [
        { label: "Hướng dẫn mua hàng", path: "/info/how-to-buy" },
        { label: "Câu hỏi thường gặp", path: "/info/faq" },
        { label: "Hệ thống cửa hàng", path: "/info/store-locations" },
        { label: "Chính sách đổi trả", path: "/info/return-policy" },
        { label: "Chính sách thanh toán", path: "/info/payment-policy" },
        { label: "Chính sách vận chuyển", path: "/info/shipment" }
    ];

    const informationLinks = [
        { label: "Giới thiệu", path: "/about" },
        { label: "Thông tin giao hàng", path: "/info/delivery-information" },
        { label: "Chính sách bảo mật", path: "/info/privacy-policy" },
        { label: "Chính sách khuyến mãi", path: "/info/discount" },
        { label: "Chăm sóc khách hàng", path: "/info/customer-service" },
        { label: "Điều khoản và điều kiện", path: "/info/terms-conditions" }
    ];

    return (
        <>
            <footer>

                <div className="container">

                    <div className="row gy-5">

                        {/* LOGO + CONTACT */}
                        <div className="col-lg-3 col-md-6">

                            <div className="footer-logo">

                                <Link to="/">
                                    <img
                                        src={logo_green}
                                        alt="Book Store Logo"
                                    />
                                </Link>

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
                                    Hướng dẫn mua sắm
                                </h2>

                                <ul className="menu-footer-container">
                                    {shoppingGuideLinks.map((item) => (
                                        <li className="menu-item" key={item.path}>
                                            <FaRegCircle className="menu-item-icon" />
                                            <Link to={item.path}>{item.label}</Link>
                                        </li>
                                    ))}

                                </ul>

                            </div>

                        </div>

                        {/* INFORMATION */}
                        <div className="col-lg-3 col-md-6">

                            <div className="widget-nav-menu">

                                <h2 className="widget-title">
                                    Thông tin
                                </h2>

                                <ul className="menu-footer-container">
                                    {informationLinks.map((item) => (
                                        <li className="menu-item" key={item.path}>
                                            <FaRegCircle className="menu-item-icon" />
                                            <Link to={item.path}>{item.label}</Link>
                                        </li>
                                    ))}

                                </ul>

                            </div>

                        </div>

                        {/* STORE IMAGE */}
                        <div className="col-lg-3 col-md-6">

                            <div className="widget-nav-menu">

                                <h2 className="widget-title">
                                    <Link to="/info/store-locations" className="footer-title-link">
                                        Hệ thống cửa hàng
                                    </Link>
                                </h2>

                                <div className="text-widget">

                                    <Link to="/info/store-locations" className="footer-image-link">
                                        <img
                                            src={store_locations}
                                            alt="Hệ thống cửa hàng"
                                        />
                                    </Link>

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
