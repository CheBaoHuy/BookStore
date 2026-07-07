import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducer/CartReducer";
import { Product, Review, ReviewEligibility, ReviewStats, ReviewsPage } from "../../models";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { FaCartPlus, FaHeart, FaPaperPlane, FaStar, FaChevronRight, FaPlus, FaMinus } from "react-icons/fa";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getBookCover } from "../../common/imageHelper";
import PopupRating from "../../components/address/PopupRating";
import "./ProductDetail.css";

function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewStats, setReviewStats] = useState<ReviewStats>({ averageRating: 0, totalReviews: 0 });
    const [reviewEligibility, setReviewEligibility] = useState<ReviewEligibility | null>(null);
    const [reviewEligibilityLoading, setReviewEligibilityLoading] = useState(false);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
    const [submittingReplyId, setSubmittingReplyId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "shipping">("desc");

    const storedUser = sessionStorage.getItem("user");
    const sessionUser = storedUser ? JSON.parse(storedUser) : null;
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const isAdmin = sessionUser?.role === "ADMIN";
    const currentUserId = sessionUser?.userId || sessionUser?.id;

    const relatedResponsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2
        }
    };

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "reviews") {
            setActiveTab("reviews");
        } else if (tab === "shipping") {
            setActiveTab("shipping");
        } else {
            setActiveTab("desc");
        }
    }, [searchParams]);

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

    useEffect(() => {
        const fetchRelatedProducts = async (categoryId: number, productId: number) => {
            setRelatedLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/api/products", {
                    params: {
                        categoryId,
                        page: 0,
                        size: 12
                    }
                });

                const items: Product[] = response.data?.content || [];
                const filtered = items.filter((p) => p.id !== productId).slice(0, 10);
                setRelatedProducts(filtered);
            } catch (error) {
                console.error("Error fetching related products:", error);
                setRelatedProducts([]);
            } finally {
                setRelatedLoading(false);
            }
        };

        if (product?.category?.id && product?.id) {
            fetchRelatedProducts(product.category.id, product.id);
        } else {
            setRelatedProducts([]);
        }
    }, [product?.category?.id, product?.id]);

    useEffect(() => {
        const fetchReviewData = async (productId: string) => {
            setReviewsLoading(true);
            try {
                const [reviewsRes, statsRes] = await Promise.all([
                    axios.get<ReviewsPage>(`http://localhost:8080/api/products/${productId}/reviews`, {
                        params: { page: 0, size: 10 }
                    }),
                    axios.get<ReviewStats>(`http://localhost:8080/api/products/${productId}/reviews/stats`)
                ]);

                setReviews(reviewsRes.data?.content || []);
                setReviewStats(statsRes.data || { averageRating: 0, totalReviews: 0 });
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setReviews([]);
                setReviewStats({ averageRating: 0, totalReviews: 0 });
            } finally {
                setReviewsLoading(false);
            }
        };

        if (id) {
            fetchReviewData(id);
        }
    }, [id]);

    useEffect(() => {
        const fetchReviewEligibility = async (productId: number) => {
            if (!token) {
                setReviewEligibility(null);
                return;
            }

            setReviewEligibilityLoading(true);
            try {
                const res = await axios.get<ReviewEligibility[]>("http://localhost:8080/api/reviews/my-eligible-products", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const items = res.data || [];
                const eligible = items.find((item) => item.productId === productId && !item.reviewed) || null;
                setReviewEligibility(eligible);
            } catch (error) {
                console.error("Error fetching review eligibility:", error);
                setReviewEligibility(null);
            } finally {
                setReviewEligibilityLoading(false);
            }
        };

        if (id) {
            const productId = Number(id);
            if (!Number.isNaN(productId)) {
                fetchReviewEligibility(productId);
            }
        }
    }, [id, token]);

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

    const refreshReviewSection = async (productId: string) => {
        try {
            const [reviewsRes, statsRes] = await Promise.all([
                axios.get<ReviewsPage>(`http://localhost:8080/api/products/${productId}/reviews`, {
                    params: { page: 0, size: 10 }
                }),
                axios.get<ReviewStats>(`http://localhost:8080/api/products/${productId}/reviews/stats`)
            ]);

            setReviews(reviewsRes.data?.content || []);
            setReviewStats(statsRes.data || { averageRating: 0, totalReviews: 0 });
        } catch (error) {
            console.error("Error refreshing reviews:", error);
        }
    };

    const refreshReviewEligibility = async (productId: number) => {
        if (!token) {
            setReviewEligibility(null);
            return;
        }

        try {
            const res = await axios.get<ReviewEligibility[]>("http://localhost:8080/api/reviews/my-eligible-products", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const items = res.data || [];
            const eligible = items.find((item) => item.productId === productId && !item.reviewed) || null;
            setReviewEligibility(eligible);
        } catch (error) {
            console.error("Error refreshing review eligibility:", error);
            setReviewEligibility(null);
        }
    };

    const handleReviewReplySubmit = async (reviewId: number) => {
        const reply = (replyDrafts[reviewId] ?? "").trim();
        if (!reply || !token) {
            return;
        }

        try {
            setSubmittingReplyId(reviewId);
            const response = await axios.post(
                `http://localhost:8080/api/reviews/${reviewId}/replies`,
                { message: reply },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setReviews((prev) => prev.map((item) => item.id === reviewId ? response.data : item));
            setReplyDrafts((prev) => ({ ...prev, [reviewId]: "" }));
        } catch (error) {
            console.error("Error replying review from product detail:", error);
        } finally {
            setSubmittingReplyId(null);
        }
    };

    const ratingDetail = reviewEligibility
        ? {
            id: reviewEligibility.orderDetailId,
            product: {
                id: reviewEligibility.productId,
                name: reviewEligibility.productTitle
            },
            quantity: reviewEligibility.quantity
        }
        : null;

    const ratingUser = sessionUser
        ? {
            id: sessionUser.userId || sessionUser.id,
            fullName: sessionUser.fullName || "",
            email: sessionUser.email || "",
            phone: sessionUser.phone || "",
            avatar: sessionUser.avatar || "",
            username: sessionUser.username || "",
            address: sessionUser.address || []
        }
        : null;

    const renderStars = (rating: number) =>
        Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} className={index < Math.round(rating) ? "active" : ""} />
        ));

    const formatReviewDate = (value?: string | null) => {
        if (!value) {
            return "";
        }

        return new Date(value).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const canReplyToReview = (review: Review) => {
        if (!token || !currentUserId) {
            return false;
        }
        return isAdmin || String(review.user?.id) === String(currentUserId);
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
                                <div className="detail-stars dynamic-stars">
                                    {renderStars(reviewStats.averageRating)}
                                </div>
                                <span className="detail-rating-count">
                                    ({reviewStats.averageRating.toFixed(1)} / 5.0 - {reviewStats.totalReviews} đánh giá)
                                </span>
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
                            className={`detail-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
                            onClick={() => setActiveTab("reviews")}
                        >
                            Đánh giá & bình luận
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
                        ) : activeTab === "reviews" ? (
                            <div className="detail-review-panel">
                                <div className="detail-review-summary">
                                    <div className="detail-review-score">
                                        <strong>{reviewStats.averageRating.toFixed(1)}</strong>
                                        <span>Điểm trung bình</span>
                                    </div>
                                    <div className="detail-review-meta">
                                        <div className="detail-stars dynamic-stars">
                                            {renderStars(reviewStats.averageRating)}
                                        </div>
                                        <p>{reviewStats.totalReviews} đánh giá từ khách hàng đã mua sản phẩm</p>
                                    </div>
                                    <div className="detail-review-actions">
                                        {reviewEligibilityLoading ? (
                                            <span className="detail-review-action-hint">Đang kiểm tra điều kiện đánh giá...</span>
                                        ) : token && reviewEligibility && ratingUser ? (
                                            <button
                                                className="detail-review-action-btn"
                                                onClick={() => setRatingModalOpen(true)}
                                            >
                                                Đánh giá sản phẩm
                                            </button>
                                        ) : token ? (
                                            <span className="detail-review-action-hint">
                                                Bạn đã đánh giá sản phẩm này hoặc chưa có đơn hàng đã giao thành công.
                                            </span>
                                        ) : (
                                            <span className="detail-review-action-hint">
                                                Đăng nhập để đánh giá sau khi nhận hàng.
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {reviewsLoading ? (
                                    <div className="detail-review-empty">Đang tải đánh giá của khách hàng...</div>
                                ) : reviews.length === 0 ? (
                                    <div className="detail-review-empty">
                                        Chưa có đánh giá nào cho sản phẩm này. Sau khi mua và nhận hàng thành công, khách hàng có thể để lại nhận xét tại trang hồ sơ.
                                    </div>
                                ) : (
                                    <div className="detail-review-list">
                                        {reviews.map((review) => (
                                            <article className="detail-review-card" key={review.id}>
                                                <div className="detail-review-card-head">
                                                    <div>
                                                        <h4>{review.fullName || review.username || "Khách hàng BookStore"}</h4>
                                                        <span>{formatReviewDate(review.createdAt)}</span>
                                                    </div>
                                                    <div className="detail-stars detail-review-stars">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>

                                                <p className="detail-review-comment">
                                                    {review.comment?.trim() || "Khách hàng đã đánh giá sản phẩm này mà không để lại bình luận chi tiết."}
                                                </p>

                                                {!!review.replies?.length && (
                                                    <div className="detail-review-thread">
                                                        {review.replies.map((reply) => (
                                                            <div
                                                                key={reply.id}
                                                                className={`detail-thread-message ${reply.authorRole === "ADMIN" ? "admin" : "user"}`}
                                                            >
                                                                <div className="detail-thread-meta">
                                                                    <strong>{reply.authorRole === "ADMIN" ? "BookStore" : reply.authorName}</strong>
                                                                    <span>{formatReviewDate(reply.createdAt)}</span>
                                                                </div>
                                                                <p>{reply.message}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {canReplyToReview(review) && (
                                                    <div className="detail-admin-reply-editor">
                                                        <textarea
                                                            rows={3}
                                                            placeholder={isAdmin
                                                                ? "Nhập phản hồi của quản trị viên ngay tại bình luận này..."
                                                                : "Nhập phản hồi của bạn để trao đổi thêm với BookStore..."}
                                                            value={replyDrafts[review.id] ?? ""}
                                                            onChange={(e) =>
                                                                setReplyDrafts((prev) => ({
                                                                    ...prev,
                                                                    [review.id]: e.target.value
                                                                }))
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            className="detail-admin-reply-btn"
                                                            onClick={() => handleReviewReplySubmit(review.id)}
                                                            disabled={submittingReplyId === review.id}
                                                        >
                                                            <FaPaperPlane />
                                                            {submittingReplyId === review.id
                                                                ? "Đang gửi..."
                                                                : isAdmin ? "Phản hồi bình luận" : "Gửi trả lời"}
                                                        </button>
                                                    </div>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
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

                <div className="related-products-section">
                    <div className="related-products-header">
                        <h3 className="related-products-title">Sản phẩm gợi ý</h3>
                        <p className="related-products-subtitle">
                            Các sản phẩm cùng thể loại để bạn tham khảo thêm.
                        </p>
                    </div>

                    {relatedLoading ? (
                        <div className="related-loading">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-muted">Đang tải gợi ý sản phẩm...</p>
                        </div>
                    ) : relatedProducts.length === 0 ? (
                        <div className="related-empty">
                            <p className="text-muted mb-0">Chưa có sản phẩm gợi ý trong thể loại này.</p>
                        </div>
                    ) : (
                        <Carousel responsive={relatedResponsive} infinite>
                            {relatedProducts.map((item) => (
                                <div className="related-card" key={item.id}>
                                    <Link
                                        to={`/product/${item.id}`}
                                        className="related-card-link"
                                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                    >
                                        <div className="related-card-image">
                                            <img
                                                src={getBookCover(item.image, item.id)}
                                                alt={item.title}
                                            />
                                        </div>
                                        <div className="related-card-content">
                                            <div className="related-card-title" title={item.title}>
                                                {item.title}
                                            </div>
                                            <div className="related-card-author">
                                                {item.author || "Chưa cập nhật"}
                                            </div>
                                            <div className="related-card-price">
                                                {item.currentPrice.toLocaleString("vi-VN")} VNĐ
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </Carousel>
                    )}
                </div>
            </div>

            {ratingUser && (
                <PopupRating
                    open={ratingModalOpen}
                    handleClose={() => setRatingModalOpen(false)}
                    detail={ratingDetail}
                    user={ratingUser}
                    token={token}
                    onSuccess={() => {
                        if (id) {
                            const productId = Number(id);
                            refreshReviewSection(id);
                            if (!Number.isNaN(productId)) {
                                refreshReviewEligibility(productId);
                            }
                        }
                    }}
                />
            )}

            <Footer />
        </div>
    );
}

export default ProductDetail;
