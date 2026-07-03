import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducer/CartReducer";
import { Product } from "../../models";
import { Link } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { FaCartPlus, FaRegHeart } from "react-icons/fa";
import centerImg4 from "../../images/center-4.jpg"; // Default cover
import { getBookCover } from "../../common/imageHelper";

function Novel() {
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [priceSort, setPriceSort] = useState<"default" | "asc" | "desc">("default");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/api/products?categoryId=2");
                if (response.data && response.data.content) {
                    setProducts(response.data.content);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching novel products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart(product));
    };

    const displayedProducts = (() => {
        const list = [...products];
        if (priceSort === "asc") return list.sort((a, b) => (a.currentPrice || 0) - (b.currentPrice || 0));
        if (priceSort === "desc") return list.sort((a, b) => (b.currentPrice || 0) - (a.currentPrice || 0));
        return list;
    })();

    return (
        <div className="category-page">
            <Header />
            <div className="about-hero" style={{ background: "linear-gradient(135deg, #17479D, #1e5fc4)", padding: "80px 20px", textAlign: "center" }}>
                <div className="hero-overlay">
                    <h1 className="hero-title" style={{ color: "white", fontSize: "36px", fontWeight: "bold", margin: 0 }}>Sách Tiểu Thuyết</h1>
                    <div className="breadcrumbs" style={{ color: "rgba(255,255,255,0.8)", marginTop: "10px" }}>
                        <a href="/" style={{ color: "white", textDecoration: "none" }}>Trang chủ</a>
                        <span style={{ margin: "0 10px" }}>/</span>
                        <span>Tiểu thuyết</span>
                    </div>
                </div>
            </div>
            
            <div className="container" style={{ padding: "60px 20px", minHeight: "50vh" }}>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">Đang tải danh sách sách...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-5">
                        <h2>Danh mục sách Tiểu thuyết đang được cập nhật...</h2>
                        <p style={{ color: "#718096", marginTop: "10px" }}>Vui lòng quay lại sau nhé!</p>
                    </div>
                ) : (
                    <>
                        <div className="product-toolbar product-toolbar--compact">
                            <span className="sort-label">Sắp xếp</span>
                            <select
                                className="sort-select"
                                value={priceSort}
                                onChange={(e) => setPriceSort(e.target.value as any)}
                            >
                                <option value="default">Mặc định</option>
                                <option value="asc">Giá: Thấp → Cao</option>
                                <option value="desc">Giá: Cao → Thấp</option>
                            </select>
                        </div>

                        <div className="row">
                            {displayedProducts.map((product) => (
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product.id}>
                                <div className="product-wrap m-0 h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="product-img" style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                            <Link to={`/product/${product.id}`} className="w-100 h-100 d-flex align-items-center justify-content-center">
                                                <img
                                                    src={getBookCover(product.image, product.id)}
                                                    alt={product.title}
                                                    style={{ maxHeight: "200px", maxWidth: "100%", objectFit: "contain" }}
                                                />
                                            </Link>
                                            <div className="product-buttons d-flex justify-content-evenly">
                                                <FaCartPlus className="product-btn-icon" onClick={() => handleAddToCart(product)} title="Thêm vào giỏ hàng" />
                                                <FaRegHeart className="product-btn-icon" title="Yêu thích" />
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <Link to={`/product/${product.id}`} className="text-decoration-none">
                                                <h4 title={product.title} style={{ color: "#1a202c" }}>{product.title}</h4>
                                            </Link>
                                            <p style={{ fontSize: "12px", color: "#718096", margin: "2px 0 6px" }}>{product.author}</p>
                                        </div>
                                    </div>
                                    <div className="product-content pb-3">
                                        <span className="price">{product.currentPrice.toLocaleString("vi-VN")} VNĐ</span>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Novel;
