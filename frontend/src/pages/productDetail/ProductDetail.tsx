import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducer/CartReducer";
import { Product } from "../../models";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { FaCartPlus, FaHeart, FaStar, FaChevronRight, FaPlus, FaMinus } from "react-icons/fa";
import { getBookCover } from "../../common/imageHelper";
import "./ProductDetail.css";

function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<"desc" | "shipping">("desc");

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/products/${id}`);
                if (response.data) {
                    setProduct(response.data);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    const handleQuantityChange = (type: "inc" | "dec") => {
        if (type === "dec") {
            if (quantity > 1) setQuantity(quantity - 1);
        } else {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                dispatch(addToCart(product));
            }
            setAddedToCartSuccess(true);
            setTimeout(() => setAddedToCartSuccess(false), 3000);
        }
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <Header />
                <div className="product-detail-container text-center my-5 py-5" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted fw-semibold">Đang tải chi tiết sản phẩm...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-page">
                <Header />
                <div className="product-detail-container text-center my-5 py-5" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
                    <h2 className="fw-bold">Không tìm thấy sản phẩm!</h2>
                    <p className="text-muted">Sản phẩm này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
                    <Link to="/" className="detail-add-btn mt-3 text-decoration-none">Quay lại Trang chủ</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const savings = product.oldPrice ? Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100) : 0;

    return (
        <div className="product-detail-page">
            <Header />

            {/* Breadcrumbs path */}
            <div className="breadcrumb-wrapper py-3 bg-light">
                <div className="container">
                    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "14px" }}>
                        <Link to="/" className="text-decoration-none text-muted">Trang chủ</Link>
                        <FaChevronRight size={10} />
                        {product.category && (
                            <>
                                <span className="text-muted">{product.category.name}</span>
                                <FaChevronRight size={10} />
                            </>
                        )}
                        <span className="text-dark fw-bold text-truncate" style={{ maxWidth: "250px" }}>{product.title}</span>
                    </div>
                </div>
            </div>

            <div className="product-detail-container">
                {addedToCartSuccess && (
                    <div className="custom-alert-banner">
                        <span><strong>Thành công!</strong> Đã thêm {quantity} cuốn sách vào giỏ hàng.</span>
                        <button className="custom-alert-close" onClick={() => setAddedToCartSuccess(false)}>&times;</button>
                    </div>
                )}

                <div className="product-detail-row">
                    {/* Left side: product image */}
                    <div className="product-detail-left">
                        <div className="detail-image-box">
                            <img
                                src={getBookCover(product.image, product.id)}
                                alt={product.title}
                            />
                        </div>
                    </div>

                    {/* Right side: product info */}
                    <div className="product-detail-right">
                        <div className="product-info-wrapper">
                            {product.category && (
                                <span className="detail-category-badge">{product.category.name}</span>
                            )}
                            <h1 className="detail-title">{product.title}</h1>

                            {/* Meta info */}
                            <div className="detail-meta-row">
                                <div className="detail-meta-item">Tác giả: <span>{product.author || "Chưa cập nhật"}</span></div>
                                <div className="detail-meta-item">Nhà xuất bản: <span>{product.publisher || "Chưa cập nhật"}</span></div>
                                <div className="detail-meta-item">Năm xuất bản: <span>{product.publishYear || "Chưa cập nhật"}</span></div>
                            </div>

                            {/* Ratings stars */}
                            <div className="detail-stars-row">
                                <div className="detail-stars">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                                <span className="detail-rating-count">(5.0 / 5.0 - 12 đánh giá)</span>
                            </div>

                            <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "24px 0" }} />

                            {/* Prices card */}
                            <div className="detail-price-card">
                                <span className="detail-price-current">
                                    {product.currentPrice.toLocaleString("vi-VN")} VNĐ
                                </span>
                                {product.oldPrice && (
                                    <>
                                        <span className="detail-price-old">
                                            {product.oldPrice.toLocaleString("vi-VN")} VNĐ
                                        </span>
                                        <span className="detail-discount-badge">Giảm {savings}%</span>
                                    </>
                                )}
                            </div>

                            {/* Brief Description */}
                            <div className="detail-brief">
                                <h5>Tóm tắt nội dung:</h5>
                                <p>
                                    {product.description || "Cuốn sách này hiện đang được biên soạn tóm tắt nội dung. Vui lòng quay lại sau."}
                                </p>
                            </div>

                            <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "24px 0" }} />

                            {/* Stock and quantities */}
                            <div className="detail-stock">
                                Trạng thái: <span className={`detail-stock-status ${product.quantity > 0 ? "in-stock" : "out-of-stock"}`}>
                                    {product.quantity > 0 ? `Còn hàng (Còn ${product.quantity} cuốn)` : "Hết hàng"}
                                </span>
                            </div>

                            {product.quantity > 0 && (
                                <div className="detail-actions-row">
                                    <div className="detail-qty-box">
                                        <button className="detail-qty-btn" onClick={() => handleQuantityChange("dec")} aria-label="Giảm số lượng">
                                            <FaMinus size={12} />
                                        </button>
                                        <input
                                            type="text"
                                            className="detail-qty-input"
                                            value={quantity}
                                            readOnly
                                        />
                                        <button className="detail-qty-btn" onClick={() => handleQuantityChange("inc")} aria-label="Tăng số lượng">
                                            <FaPlus size={12} />
                                        </button>
                                    </div>

                                    <button className="detail-add-btn" onClick={handleAddToCart}>
                                        <FaCartPlus size={18} />
                                        THÊM VÀO GIỎ HÀNG
                                    </button>

                                    <button className="detail-wishlist-btn" title="Yêu thích">
                                        <FaHeart size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs detailed section */}
                <div className="detail-tabs-container">
                    <div className="detail-tabs-header">
                        <button
                            className={`detail-tab-btn ${activeTab === "desc" ? "active" : ""}`}
                            onClick={() => setActiveTab("desc")}
                        >
                            Mô tả chi tiết
                        </button>
                        <button
                            className={`detail-tab-btn ${activeTab === "shipping" ? "active" : ""}`}
                            onClick={() => setActiveTab("shipping")}
                        >
                            Chính sách vận chuyển
                        </button>
                    </div>
                    <div className="detail-tabs-content">
                        {activeTab === "desc" ? (
                            <p style={{ margin: 0 }}>{product.description || "Nội dung đang được cập nhật."}</p>
                        ) : (
                            <p style={{ margin: 0 }}>
                                - Giao hàng toàn quốc với tốc độ nhanh chóng.<br />
                                - Miễn phí vận chuyển cho các đơn hàng từ 300.000đ trở lên.<br />
                                - Thời gian nhận hàng: Từ 1-3 ngày làm việc (nội thành TP.HCM và Hà Nội), từ 3-5 ngày làm việc (các tỉnh thành khác).<br />
                                - Được kiểm tra hàng trước khi nhận và thanh toán khi giao hàng (COD).
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ProductDetail;
