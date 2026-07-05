import React, { FormEvent, useEffect, useRef, useState } from "react";
import "./Header.css";
import axios from "axios";

import {
    FaMapMarkerAlt,
    FaSearch,
    FaShoppingCart
} from "react-icons/fa";

import { IoMdPhonePortrait } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Product } from "../../models";
import { getBookCover } from "../../common/imageHelper";
import { useNavigate } from "react-router-dom";

import logo from "../../images/logo_green.png";

export const Header = () => {
    const navigate = useNavigate();
    const { cartItems } = useSelector((state: RootState) => state.carts);
    const cartCount = cartItems.reduce((total, item) => total + (item.cartTotal || 1), 0);
    const searchFormRef = useRef<HTMLFormElement | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!searchFormRef.current?.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const keyword = searchTerm.trim();

        if (!keyword) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(async () => {
            setIsSearching(true);

            try {
                const response = await axios.get<Product[]>("http://localhost:8080/api/products/suggestions", {
                    params: {
                        keyword,
                        limit: 6
                    },
                    signal: controller.signal
                });

                setSuggestions(response.data || []);
                setIsSearchOpen(true);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Lỗi khi tải gợi ý tìm kiếm:", error);
                    setSuggestions([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsSearching(false);
                }
            }
        }, 300);

        return () => {
            controller.abort();
            window.clearTimeout(timeoutId);
        };
    }, [searchTerm]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const handleSelectSuggestion = (productId: number) => {
        setSearchTerm("");
        setSuggestions([]);
        setIsSearchOpen(false);
        navigate(`/product/${productId}`);
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (suggestions.length > 0) {
            handleSelectSuggestion(suggestions[0].id);
        }
    };

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
                                {user ? (
                                    <>
                                        {user.role === "ADMIN" && (
                                            <li className="menu-item">
                                                <a href="/admin" style={{ color: "#fef08a", fontWeight: "bold" }}>Quản trị</a>
                                            </li>
                                        )}
                                        <li className="menu-item">
                                            <a href="/profile" style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "600", textDecoration: "none" }} title="Xem thông tin cá nhân">
                                                Hi, {user.fullName || user.username}
                                            </a>
                                        </li>
                                        <li className="menu-item">
                                            <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#feb2b2", fontWeight: "600", cursor: "pointer", padding: 0 }}>
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li className="menu-item">
                                        <a href="/login">Đăng nhập</a>
                                    </li>
                                )}
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
                                <form
                                    ref={searchFormRef}
                                    className="search-form"
                                    role="search"
                                    onSubmit={handleSearchSubmit}
                                >
                                    <input
                                        type="search"
                                        placeholder="Tìm kiếm sách..."
                                        value={searchTerm}
                                        autoComplete="off"
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => {
                                            if (searchTerm.trim()) {
                                                setIsSearchOpen(true);
                                            }
                                        }}
                                    />
                                    <button type="submit" aria-label="Tìm kiếm" className="search-submit-btn">
                                        <FaSearch />
                                    </button>

                                    {searchTerm.trim() && isSearchOpen && (
                                        <div className="search-suggestions" aria-label="Gợi ý sản phẩm">
                                            {isSearching ? (
                                                <div className="search-suggestion-state">Đang tìm sản phẩm...</div>
                                            ) : suggestions.length > 0 ? (
                                                suggestions.map((product) => (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        className="search-suggestion-item"
                                                        onClick={() => handleSelectSuggestion(product.id)}
                                                    >
                                                        <img
                                                            className="search-suggestion-image"
                                                            src={getBookCover(product.image, product.id)}
                                                            alt={product.title}
                                                        />
                                                        <div className="search-suggestion-content">
                                                            <span className="search-suggestion-title">{product.title}</span>
                                                            <span className="search-suggestion-meta">
                                                                {product.author || "Đang cập nhật tác giả"}
                                                            </span>
                                                        </div>
                                                        <span className="search-suggestion-price">
                                                            {product.currentPrice.toLocaleString("vi-VN")}đ
                                                        </span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="search-suggestion-state">
                                                    Không tìm thấy sản phẩm phù hợp.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </form>

                                {/* CART */}
                                <a href="/cart" className="mini-cart-link" aria-label="Giỏ hàng">
                                    <div className="mini-cart">
                                        <FaShoppingCart />
                                        <span className="cart-count">{cartCount}</span>
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
