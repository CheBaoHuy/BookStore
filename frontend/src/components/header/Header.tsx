
import React from "react";
import "./Header.css";

import {
    FaMapMarkerAlt,
    FaSearch,
    FaShoppingCart
} from "react-icons/fa";

import { IoMdPhonePortrait } from "react-icons/io";

import logo from "../../images/logo_green.png";

export const Header = () => {
    return (
        <>
            {/* TOP BAR */}
            <div className="top-bar">
                <div className="container">
                    <div className="row align-items-center">

                        <div className="col-lg-6 col-md-6 col-sm-12 top-left">
                            <div className="top-contact">
                                <span>
                                    <FaMapMarkerAlt className="top-bar-icon" />
                                    <a
                                        href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+N%C3%B4ng+L%C3%A2m+TP.+H%E1%BB%93+Ch%C3%AD+Minh/@10.8712764,106.7891868,865m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3175276398969f7b:0x9672b7efd0893fc4!8m2!3d10.8712764!4d106.7917617!16s%2Fm%2F02q4yqq?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: "inherit", textDecoration: "none" }}
                                    >
                                        Đại học Nông Lâm TP.HCM
                                    </a>
                                </span>

                                <span>
                                    <IoMdPhonePortrait className="top-bar-icon" />
                                    0123456789
                                </span>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                            <ul className="top-menu mb-0">
                                <li className="menu-item">
                                    <a href="/">Yêu thích</a>
                                </li>
                                <li className="menu-item">
                                    <a href="/login">Tài khoản</a>
                                </li>
                                <li className="menu-item">
                                    <a href="/checkout">Thanh toán</a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

            {/* HEADER */}
            <header className="header">
                <div className="container">
                    <div className="row align-items-center">

                        {/* LOGO */}
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="logo">
                                <a href="/">
                                    <img src={logo} alt="Book Store Logo" />
                                </a>
                            </div>
                        </div>

                        {/* SEARCH + CART */}
                        <div className="col-lg-8 col-md-8 col-sm-12">
                            <div className="header-right">

                                {/* SEARCH */}
                                <form className="search-form" role="search">
                                    <input
                                        type="search"
                                        placeholder="Tìm kiếm sách..."
                                    />
                                    <button type="submit" aria-label="Tìm kiếm">
                                        <FaSearch />
                                    </button>
                                </form>

                                {/* CART */}
                                <a href="/cart" className="mini-cart-link" aria-label="Giỏ hàng">
                                    <div className="mini-cart">
                                        <FaShoppingCart />
                                        <span className="cart-count">0</span>
                                    </div>
                                </a>

                            </div>
                        </div>

                    </div>
                </div>
            </header>

            {/* MAIN MENU */}
            <nav className="main-menu">
                <div className="container">
                    <ul className="menu">
                        <li className="menu-item">
                            <a href="/">Trang chủ</a>
                        </li>
                        <li className="menu-item">
                            <a href="/learning">Học tập</a>
                        </li>
                        <li className="menu-item">
                            <a href="/novel">Tiểu thuyết</a>
                        </li>
                        <li className="menu-item">
                            <a href="/business">Kinh doanh</a>
                        </li>
                        <li className="menu-item">
                            <a href="/health">Sức khỏe</a>
                        </li>
                        <li className="menu-item">
                            <a href="/about">Về chúng tôi</a>
                        </li>
                    </ul>
                </div>
            </nav>

        </>
    );
};