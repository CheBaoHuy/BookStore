import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import {
    FaUser, FaEnvelope, FaPhone, FaLink, FaSave, FaArrowLeft, FaUserCircle,
    FaBox, FaCheckCircle, FaTruck, FaTimesCircle, FaClock, FaSearch, FaHistory, FaShoppingBag, FaStar
} from "react-icons/fa";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import PopupRating from "../../components/address/PopupRating";
import { Order, ReviewEligibility } from "../../models";
import "./Profile.css";

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string; icon: React.ReactNode; step: number }> = {
    1: { label: "Chờ xác nhận", color: "#d97706", bg: "#fef3c7", icon: <FaClock />, step: 1 },
    2: { label: "Đã xác nhận",  color: "#2563eb", bg: "#dbeafe", icon: <FaCheckCircle />, step: 2 },
    3: { label: "Đang giao",    color: "#0284c7", bg: "#e0f2fe", icon: <FaTruck />, step: 3 },
    4: { label: "Đã giao",      color: "#059669", bg: "#d1fae5", icon: <FaCheckCircle />, step: 4 },
    5: { label: "Đã hủy",       color: "#dc2626", bg: "#fee2e2", icon: <FaTimesCircle />, step: 0 },
};

function Profile() {
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");

    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = sessionStorage.getItem("token");

    // Unified Dashboard Navigation Tab state
    const [activeTab, setActiveTab] = useState<"profile" | "tracking" | "history">("profile");

    // Profile Form states
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarLink, setAvatarLink] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Orders states
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [searchId, setSearchId] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [trackingFilterStatus, setTrackingFilterStatus] = useState<number | "all">("all");
    const [reviewEligibilities, setReviewEligibilities] = useState<ReviewEligibility[]>([]);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedReviewItem, setSelectedReviewItem] = useState<ReviewEligibility | null>(null);

    // Sync activeTab from url parameters
    useEffect(() => {
        if (tabParam === "tracking") {
            setActiveTab("tracking");
        } else if (tabParam === "history") {
            setActiveTab("history");
        } else {
            setActiveTab("profile");
        }
    }, [tabParam]);

    // Pre-fill profile form fields
    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setPhone(user.phone || "");
            setAvatarLink(user.avatar || "");
            fetchOrders();
            fetchReviewEligibilities();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchOrders = async () => {
        if (!user) return;
        setOrdersLoading(true);
        const userId = user.userId || user.id || "";
        try {
            const res = await axios.get(`http://localhost:8080/api/orders/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Chỉ lấy đơn hàng thuộc về email của người dùng hiện tại
            const localOrders = JSON.parse(localStorage.getItem("user_orders") || "[]")
                .filter((o: any) => o.email === user.email);
            // Gộp và sắp xếp đơn hàng
            const merged = [...localOrders, ...(res.data || [])]
                .filter((o, i, arr) => arr.findIndex(x => x.id === o.id) === i)
                .sort((a, b) => {
                    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return timeB - timeA;
                });
            setOrders(merged);
        } catch {
            // Chỉ lấy đơn hàng thuộc về email của người dùng hiện tại
            const localOrders = JSON.parse(localStorage.getItem("user_orders") || "[]")
                .filter((o: any) => o.email === user.email);
            const sorted = [...localOrders].sort((a, b) => {
                const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return timeB - timeA;
            });
            setOrders(sorted);
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchReviewEligibilities = async () => {
        if (!token) {
            setReviewEligibilities([]);
            return;
        }

        try {
            const res = await axios.get("http://localhost:8080/api/reviews/my-eligible-products", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviewEligibilities(res.data || []);
        } catch (error) {
            console.error("Error fetching review eligibilities:", error);
            setReviewEligibilities([]);
        }
    };

    const openRatingModal = (item: ReviewEligibility) => {
        setSelectedReviewItem(item);
        setRatingModalOpen(true);
    };

    const closeRatingModal = () => {
        setRatingModalOpen(false);
        setSelectedReviewItem(null);
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!fullName.trim()) {
            setErrorMsg("Họ và tên không được để trống.");
            return;
        }

        setProfileLoading(true);
        try {
            const response = await axios.put(
                "http://localhost:8080/api/auth/profile",
                {
                    username: user.username,
                    fullName: fullName,
                    phone: phone,
                    email: user.email,
                    avatarLink: avatarLink
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                const updatedSessionUser = {
                    ...user,
                    fullName: response.data.fullName,
                    phone: response.data.phone,
                    avatar: response.data.avatar
                };
                sessionStorage.setItem("user", JSON.stringify(updatedSessionUser));
                setSuccessMsg("Cập nhật thông tin cá nhân thành công!");
                setTimeout(() => setSuccessMsg(""), 3000);
            }
        } catch (err: any) {
            console.error("Error saving profile:", err);
            setErrorMsg(err.response?.data?.message || "Không thể cập nhật thông tin. Vui lòng kiểm tra lại.");
        } finally {
            setProfileLoading(false);
        }
    };

    const handleCancelOrder = (orderId: number) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            // Cập nhật UI state
            const updated = orders.map(o =>
                o.id === orderId
                    ? { ...o, orderStatus: { id: 5, status: "Đã hủy" } }
                    : o
            );
            setOrders(updated);
            setSelectedOrder(null);

            // Cập nhật localStorage
            const localOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
            const updatedLocal = localOrders.map((o: any) =>
                o.id === orderId
                    ? { ...o, orderStatus: { id: 5, status: "Đã hủy" } }
                    : o
            );
            localStorage.setItem("user_orders", JSON.stringify(updatedLocal));

            // Gọi API cập nhật lên database
            try {
                axios.put(`http://localhost:8080/api/orders/${orderId}/status?statusId=5`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Backend cancellation failed:", err);
            }
        }
    };

    const formatDate = (iso: string) => {
        if (!iso) return "";
        const d = new Date(iso);
        return d.toLocaleString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    };

    // Access Denied View
    if (!user) {
        return (
            <div className="profile-page-wrapper">
                <Header />
                <div className="profile-access-denied">
                    <FaUserCircle className="denied-icon" />
                    <h2>Yêu cầu đăng nhập</h2>
                    <p>Vui lòng đăng nhập tài khoản để xem và chỉnh sửa thông tin cá nhân của bạn.</p>
                    <Link to="/login" className="btn-login-redirect">Đăng nhập ngay</Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Filter orders for active tracking (statuses 1, 2, 3)
    const trackingOrders = orders.filter(o => {
        const isActive = o.orderStatus.id === 1 || o.orderStatus.id === 2 || o.orderStatus.id === 3;
        const matchesSearch = searchId ? String(o.id).includes(searchId.trim()) : true;
        const matchesTabStatus = trackingFilterStatus === "all" ? true : o.orderStatus.id === trackingFilterStatus;
        return isActive && matchesSearch && matchesTabStatus;
    });

    // Filter orders for history (statuses 4, 5)
    const historyOrders = orders.filter(o => {
        const isCompletedOrCancelled = o.orderStatus.id === 4 || o.orderStatus.id === 5;
        const matchesSearch = searchId ? String(o.id).includes(searchId.trim()) : true;
        return isCompletedOrCancelled && matchesSearch;
    });

    const getReviewItemsByOrder = (orderId: number) =>
        reviewEligibilities.filter(item => item.orderId === orderId);

    const ratingDetail = selectedReviewItem
        ? {
            id: selectedReviewItem.orderDetailId,
            product: {
                id: selectedReviewItem.productId,
                name: selectedReviewItem.productTitle
            },
            quantity: selectedReviewItem.quantity
        }
        : null;

    return (
        <div className="profile-page-wrapper">
            <Header />

            <div className="dashboard-container">
                {/* Back link */}
                <div className="profile-back-link">
                    <Link to="/"><FaArrowLeft /> Quay lại trang chủ</Link>
                </div>

                <div className="dashboard-grid">
                    {/* LEFT PANEL: SIDEBAR MENU */}
                    <aside className="dashboard-sidebar">
                        <div className="user-profile-section">
                            <div className="user-avatar">
                                {avatarLink ? (
                                    <img src={avatarLink} alt="User Avatar" />
                                ) : (
                                    <div className="avatar-fallback"><FaUserCircle size={44} /></div>
                                )}
                            </div>
                            <div className="user-profile-info">
                                <h4>{fullName || user.username}</h4>
                                <span>Thành viên</span>
                            </div>
                        </div>

                        <nav className="dashboard-menu">
                            <button
                                className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
                                onClick={() => { setActiveTab("profile"); setSearchId(""); }}
                            >
                                <FaUser /> Hồ sơ cá nhân
                            </button>
                            <button
                                className={`menu-item ${activeTab === "tracking" ? "active" : ""}`}
                                onClick={() => { setActiveTab("tracking"); setSearchId(""); }}
                            >
                                <FaBox /> Theo dõi đơn hàng
                                {orders.filter(o => o.orderStatus.id === 1 || o.orderStatus.id === 2 || o.orderStatus.id === 3).length > 0 && (
                                    <span className="badge-count">
                                        {orders.filter(o => o.orderStatus.id === 1 || o.orderStatus.id === 2 || o.orderStatus.id === 3).length}
                                    </span>
                                )}
                            </button>
                            <button
                                className={`menu-item ${activeTab === "history" ? "active" : ""}`}
                                onClick={() => { setActiveTab("history"); setSearchId(""); }}
                            >
                                <FaHistory /> Đơn hàng đã mua
                                {orders.filter(o => o.orderStatus.id === 4).length > 0 && (
                                    <span className="badge-count bg-green">
                                        {orders.filter(o => o.orderStatus.id === 4).length}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </aside>

                    {/* RIGHT PANEL: CONTENT MODULE */}
                    <main className="dashboard-content">
                        
                        {/* TAB 1: PERSONAL PROFILE EDIT */}
                        {activeTab === "profile" && (
                            <div className="dashboard-card animated-fade">
                                <div className="card-header-title">
                                    <h2>Hồ sơ cá nhân</h2>
                                    <p>Xem và chỉnh sửa thông tin liên hệ của tài khoản</p>
                                </div>

                                {errorMsg && <div className="alert alert-danger text-center mb-4">{errorMsg}</div>}
                                {successMsg && <div className="alert alert-success text-center mb-4">{successMsg}</div>}

                                <form onSubmit={handleSaveProfile} className="profile-form">
                                    <div className="profile-form-grid">
                                        <div className="profile-form-group">
                                            <label><FaUser /> Tên đăng nhập</label>
                                            <input
                                                type="text"
                                                className="form-control read-only-input"
                                                value={user.username}
                                                readOnly
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label><FaEnvelope /> Địa chỉ Email</label>
                                            <input
                                                type="email"
                                                className="form-control read-only-input"
                                                value={user.email}
                                                readOnly
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label htmlFor="profile-fullname"><FaUser /> Họ và tên <span className="text-danger">*</span></label>
                                            <input
                                                id="profile-fullname"
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập họ và tên..."
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label htmlFor="profile-phone"><FaPhone /> Số điện thoại</label>
                                            <input
                                                id="profile-phone"
                                                type="tel"
                                                className="form-control"
                                                placeholder="Nhập số điện thoại..."
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>

                                        <div className="profile-form-group full-width">
                                            <label htmlFor="profile-avatar"><FaLink /> Ảnh đại diện (URL)</label>
                                            <input
                                                id="profile-avatar"
                                                type="text"
                                                className="form-control"
                                                placeholder="Dán link ảnh đại diện..."
                                                value={avatarLink}
                                                onChange={(e) => setAvatarLink(e.target.value)}
                                            />
                                            <span className="input-tip">Dán link ảnh online (ví dụ từ Unsplash, Imgur) để cập nhật avatar.</span>
                                        </div>
                                    </div>

                                    <div className="profile-form-actions">
                                        <button type="submit" className="btn-save-profile" disabled={profileLoading}>
                                            <FaSave /> {profileLoading ? "Đang lưu..." : "Lưu thay đổi"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* TAB 2: ACTIVE ORDER TRACKING */}
                        {activeTab === "tracking" && (
                            <div className="dashboard-card animated-fade">
                                <div className="card-header-title">
                                    <h2>Theo dõi đơn hàng</h2>
                                    <p>Theo dõi quá trình giao nhận các đơn hàng đang được xử lý</p>
                                </div>

                                <div className="ot-filters">
                                    <div className="ot-search">
                                        <FaSearch className="ot-search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Tìm theo mã đơn hàng..."
                                            value={searchId}
                                            onChange={(e) => setSearchId(e.target.value)}
                                        />
                                    </div>
                                    <div className="ot-status-tabs">
                                        {[
                                            { key: "all", label: "Tất cả" },
                                            { key: 1, label: "Chờ xác nhận" },
                                            { key: 2, label: "Đã xác nhận" },
                                            { key: 3, label: "Đang giao" },
                                        ].map(tab => (
                                            <button
                                                key={tab.key}
                                                className={`ot-tab ${trackingFilterStatus === tab.key ? "active" : ""}`}
                                                onClick={() => setTrackingFilterStatus(tab.key as any)}
                                            >
                                                {tab.label}
                                                {tab.key !== "all" && (
                                                    <span className="ot-tab-count">
                                                        {orders.filter(o => o.orderStatus.id === tab.key).length}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {ordersLoading ? (
                                    <div className="ot-loading">
                                        <div className="ot-spinner"></div>
                                        <p>Đang tải đơn hàng...</p>
                                    </div>
                                ) : trackingOrders.length === 0 ? (
                                    <div className="ot-empty">
                                        <div className="ot-empty-icon">📦</div>
                                        <h3>Không có đơn hàng nào cần theo dõi</h3>
                                        <p>Các đơn hàng đang giao sẽ xuất hiện tại đây.</p>
                                        <Link to="/" className="btn-ot-shop">Khám phá sách</Link>
                                    </div>
                                ) : (
                                    <div className="ot-list">
                                        {trackingOrders.map(order => {
                                            const status = STATUS_CONFIG[order.orderStatus.id] || STATUS_CONFIG[1];
                                            const isSelected = selectedOrder?.id === order.id;

                                            return (
                                                <div
                                                    key={order.id}
                                                    className={`ot-card ${isSelected ? "expanded" : ""}`}
                                                    onClick={() => setSelectedOrder(isSelected ? null : order)}
                                                >
                                                    <div className="ot-card-header">
                                                        <div className="ot-card-left">
                                                            <div className="ot-order-icon"><FaBox /></div>
                                                            <div>
                                                                <div className="ot-order-id">Đơn hàng #{order.id}</div>
                                                                <div className="ot-order-date">{formatDate(order.createdAt)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="ot-card-right">
                                                            <span className="ot-status-badge" style={{ color: status.color, background: status.bg }}>
                                                                {status.icon} {status.label}
                                                            </span>
                                                            <div className="ot-order-amount">{order.totalAmount.toLocaleString("vi-VN")}₫</div>
                                                        </div>
                                                    </div>

                                                    {isSelected && (
                                                        <div className="ot-card-detail" onClick={e => e.stopPropagation()}>
                                                            {/* Progress timeline */}
                                                            <div className="ot-progress">
                                                                {[
                                                                    { step: 1, label: "Đặt hàng" },
                                                                    { step: 2, label: "Xác nhận" },
                                                                    { step: 3, label: "Đang giao" },
                                                                    { step: 4, label: "Hoàn thành" },
                                                                ].map((s, idx) => (
                                                                    <React.Fragment key={s.step}>
                                                                        <div className={`ot-step ${status.step >= s.step ? "done" : "pending"} ${status.step === s.step ? "current" : ""}`}>
                                                                            <div className="ot-step-dot">
                                                                                {status.step > s.step ? "✓" : s.step}
                                                                            </div>
                                                                            <span>{s.label}</span>
                                                                        </div>
                                                                        {idx < 3 && (
                                                                            <div className={`ot-step-line ${status.step > s.step ? "done" : ""}`}></div>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>

                                                            {/* Info grid */}
                                                            <div className="ot-detail-grid">
                                                                <div className="ot-detail-section">
                                                                    <div className="ot-detail-title">📍 Thông tin giao hàng</div>
                                                                    <div className="ot-detail-row"><span>Người nhận</span><strong>{order.fullName}</strong></div>
                                                                    <div className="ot-detail-row"><span>Số điện thoại</span><strong>{order.phone}</strong></div>
                                                                    <div className="ot-detail-row"><span>Địa chỉ</span><strong>{order.address}</strong></div>
                                                                    {order.note && <div className="ot-detail-row"><span>Ghi chú</span><strong>{order.note}</strong></div>}
                                                                </div>
                                                                <div className="ot-detail-section">
                                                                    <div className="ot-detail-title">💳 Thanh toán</div>
                                                                    <div className="ot-detail-row"><span>Phương thức</span><strong>{order.paymentMethod}</strong></div>
                                                                    <div className="ot-detail-row"><span>Tổng tiền</span>
                                                                        <strong className="ot-price">{order.totalAmount.toLocaleString("vi-VN")}₫</strong>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="ot-card-actions">
                                                                {order.orderStatus.id === 1 && (
                                                                    <button className="btn-ot-cancel" onClick={() => handleCancelOrder(order.id)}>
                                                                        Hủy đơn hàng
                                                                    </button>
                                                                )}
                                                                <button className="btn-ot-close" onClick={() => setSelectedOrder(null)}>
                                                                    Thu gọn
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: PURCHASED ORDER HISTORY */}
                        {activeTab === "history" && (
                            <div className="dashboard-card animated-fade">
                                <div className="card-header-title">
                                    <h2>Đơn hàng đã mua</h2>
                                    <p>Xem lại lịch sử các đơn hàng đã nhận hoặc đã hủy</p>
                                </div>

                                <div className="ot-filters">
                                    <div className="ot-search">
                                        <FaSearch className="ot-search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm theo mã đơn hàng..."
                                            value={searchId}
                                            onChange={(e) => setSearchId(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {ordersLoading ? (
                                    <div className="ot-loading">
                                        <div className="ot-spinner"></div>
                                        <p>Đang tải lịch sử đơn hàng...</p>
                                    </div>
                                ) : historyOrders.length === 0 ? (
                                    <div className="ot-empty">
                                        <div className="ot-empty-icon"><FaShoppingBag /></div>
                                        <h3>Chưa có đơn hàng nào hoàn thành</h3>
                                        <p>Danh sách các đơn đã giao thành công hoặc bị hủy sẽ xuất hiện tại đây.</p>
                                        <Link to="/" className="btn-ot-shop">Tiếp tục mua sách</Link>
                                    </div>
                                ) : (
                                    <div className="ot-list">
                                        {historyOrders.map(order => {
                                            const status = STATUS_CONFIG[order.orderStatus.id] || STATUS_CONFIG[1];
                                            const isSelected = selectedOrder?.id === order.id;
                                            const reviewItems = getReviewItemsByOrder(order.id);

                                            return (
                                                <div
                                                    key={order.id}
                                                    className={`ot-card ${isSelected ? "expanded" : ""}`}
                                                    onClick={() => setSelectedOrder(isSelected ? null : order)}
                                                >
                                                    <div className="ot-card-header">
                                                        <div className="ot-card-left">
                                                            <div className="ot-order-icon"><FaBox /></div>
                                                            <div>
                                                                <div className="ot-order-id">Đơn hàng #{order.id}</div>
                                                                <div className="ot-order-date">{formatDate(order.createdAt)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="ot-card-right">
                                                            <span className="ot-status-badge" style={{ color: status.color, background: status.bg }}>
                                                                {status.icon} {status.label}
                                                            </span>
                                                            <div className="ot-order-amount">{order.totalAmount.toLocaleString("vi-VN")}₫</div>
                                                        </div>
                                                    </div>

                                                    {isSelected && (
                                                        <div className="ot-card-detail" onClick={e => e.stopPropagation()}>
                                                            {/* Info grid */}
                                                            <div className="ot-detail-grid">
                                                                <div className="ot-detail-section">
                                                                    <div className="ot-detail-title">📍 Thông tin giao nhận</div>
                                                                    <div className="ot-detail-row"><span>Người nhận</span><strong>{order.fullName}</strong></div>
                                                                    <div className="ot-detail-row"><span>Số điện thoại</span><strong>{order.phone}</strong></div>
                                                                    <div className="ot-detail-row"><span>Địa chỉ</span><strong>{order.address}</strong></div>
                                                                    {order.note && <div className="ot-detail-row"><span>Ghi chú</span><strong>{order.note}</strong></div>}
                                                                </div>
                                                                <div className="ot-detail-section">
                                                                    <div className="ot-detail-title">💳 Thông tin thanh toán</div>
                                                                    <div className="ot-detail-row"><span>Phương thức</span><strong>{order.paymentMethod}</strong></div>
                                                                    <div className="ot-detail-row"><span>Trạng thái</span>
                                                                        <strong className={order.orderStatus.id === 4 ? "text-success" : "text-danger"}>
                                                                            {order.orderStatus.id === 4 ? "Đã giao thành công" : "Đã hủy"}
                                                                        </strong>
                                                                    </div>
                                                                    <div className="ot-detail-row"><span>Tổng tiền</span>
                                                                        <strong className="ot-price">{order.totalAmount.toLocaleString("vi-VN")}₫</strong>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {order.orderStatus.id === 4 && (
                                                                <div className="review-history-section">
                                                                    <div className="review-history-header">
                                                                        <div>
                                                                            <h4>Đánh giá sản phẩm đã mua</h4>
                                                                            <p>Quý khách có thể đánh giá từng sản phẩm đã nhận để chia sẻ trải nghiệm thực tế.</p>
                                                                        </div>
                                                                    </div>

                                                                    {reviewItems.length === 0 ? (
                                                                        <div className="review-history-empty">
                                                                            Chưa có sản phẩm nào trong đơn hàng này đủ điều kiện hiển thị để đánh giá.
                                                                        </div>
                                                                    ) : (
                                                                        <div className="review-history-list">
                                                                            {reviewItems.map((item) => (
                                                                                <div className="review-history-item" key={item.orderDetailId}>
                                                                                    <div className="review-history-item-main">
                                                                                        <div className="review-history-product">
                                                                                            <span className="review-history-product-title">{item.productTitle}</span>
                                                                                            <span className="review-history-product-meta">
                                                                                                Số lượng: {item.quantity}
                                                                                            </span>
                                                                                        </div>
                                                                                        {item.reviewed ? (
                                                                                            <span className="review-status-tag reviewed">
                                                                                                <FaCheckCircle /> Đã đánh giá
                                                                                            </span>
                                                                                        ) : (
                                                                                            <button
                                                                                                className="btn-review-product"
                                                                                                onClick={() => openRatingModal(item)}
                                                                                            >
                                                                                                <FaStar /> Đánh giá ngay
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className="ot-card-actions">
                                                                <button className="btn-ot-reorder" onClick={() => window.location.href = "/"}>
                                                                    Mua lại sách
                                                                </button>
                                                                <button className="btn-ot-close" onClick={() => setSelectedOrder(null)}>
                                                                    Thu gọn
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <PopupRating
                open={ratingModalOpen}
                handleClose={closeRatingModal}
                detail={ratingDetail}
                user={user}
                token={token}
                onSuccess={fetchReviewEligibilities}
            />

            <Footer />
        </div>
    );
}

export default Profile;
