import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    FaBook,
    FaShoppingCart,
    FaUsers,
    FaPercentage,
    FaChartBar,
    FaPlus,
    FaEdit,
    FaTrash,
    FaHome,
    FaLock,
    FaUserShield,
    FaCheck,
    FaTimes
} from "react-icons/fa";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { Product, Order, User, Category } from "../../models";
import "./AdminDashboard.css";

interface Voucher {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderAmount: number;
    active: boolean;
}

function AdminDashboard() {
    // Auth Protection
    const storedUser = localStorage.getItem("user");
    const adminUser = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");

    const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "users" | "vouchers">("overview");
    const [loading, setLoading] = useState(true);

    // Dynamic Lists State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);

    // Product Modal Form States
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [pTitle, setPTitle] = useState("");
    const [pAuthor, setPAuthor] = useState("");
    const [pPublisher, setPPublisher] = useState("");
    const [pPublishYear, setPPublishYear] = useState(new Date().getFullYear());
    const [pCurrentPrice, setPCurrentPrice] = useState(0);
    const [pOldPrice, setPOldPrice] = useState<number | "">("");
    const [pQuantity, setPQuantity] = useState(1);
    const [pDescription, setPDescription] = useState("");
    const [pCategoryId, setPCategoryId] = useState<number | "">("");
    const [pImage, setPImage] = useState("");

    // Voucher Form States
    const [vCode, setVCode] = useState("");
    const [vDiscountType, setVDiscountType] = useState<"percentage" | "fixed">("percentage");
    const [vDiscountValue, setVDiscountValue] = useState(0);
    const [vMinOrderAmount, setVMinOrderAmount] = useState(0);

    // Global Alert Banners
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Set axios auth headers
    const getAuthHeaders = () => ({
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    useEffect(() => {
        if (adminUser && adminUser.role === "ADMIN") {
            fetchInitialData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Fetch Products
            const prodRes = await axios.get("http://localhost:8080/api/products?page=0&size=100");
            if (prodRes.data && prodRes.data.content) {
                setProducts(prodRes.data.content);
            }

            // Fetch Categories
            const catRes = await axios.get("http://localhost:8080/api/categories");
            if (catRes.data) {
                setCategories(catRes.data);
            }

            // Fetch Orders
            const orderRes = await axios.get("http://localhost:8080/api/orders", getAuthHeaders());
            if (orderRes.data) {
                setOrders(orderRes.data);
            }

            // Fetch Users
            const userRes = await axios.get("http://localhost:8080/api/users", getAuthHeaders());
            if (userRes.data) {
                setUsers(userRes.data);
            }

            // Fetch Vouchers from localStorage
            const storedVouchers = localStorage.getItem("bookstore_vouchers");
            if (storedVouchers) {
                setVouchers(JSON.parse(storedVouchers));
            } else {
                const defaultVouchers: Voucher[] = [
                    { code: "GIAM20", discountType: "percentage", discountValue: 20, minOrderAmount: 200000, active: true },
                    { code: "KM50K", discountType: "fixed", discountValue: 50000, minOrderAmount: 300000, active: true }
                ];
                localStorage.setItem("bookstore_vouchers", JSON.stringify(defaultVouchers));
                setVouchers(defaultVouchers);
            }

        } catch (err: any) {
            console.error("Error loading admin data:", err);
            setErrorMsg("Không thể tải thông tin hệ thống. Vui lòng kiểm tra lại kết nối.");
        } finally {
            setLoading(false);
        }
    };

    // Access Denied Banner
    if (!adminUser || adminUser.role !== "ADMIN") {
        return (
            <div className="access-denied-page">
                <Header />
                <div className="access-denied-container">
                    <FaLock className="lock-icon" />
                    <h2>Truy cập bị từ chối</h2>
                    <p>Tài khoản của bạn không có quyền truy cập vào trang quản trị viên này.</p>
                    <div className="actions">
                        <Link to="/" className="btn-home">
                            <FaHome /> Quay lại Trang chủ
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const triggerNotification = (success: string, error: string = "") => {
        if (success) {
            setSuccessMsg(success);
            setTimeout(() => setSuccessMsg(""), 3000);
        }
        if (error) {
            setErrorMsg(error);
            setTimeout(() => setErrorMsg(""), 3000);
        }
    };

    // =============================================
    // PRODUCT ACTIONS
    // =============================================
    const handleOpenAddProduct = () => {
        setEditingProduct(null);
        setPTitle("");
        setPAuthor("");
        setPPublisher("");
        setPPublishYear(new Date().getFullYear());
        setPCurrentPrice(0);
        setPOldPrice("");
        setPQuantity(10);
        setPDescription("");
        setPCategoryId("");
        setPImage("");
        setShowProductModal(true);
    };

    const handleOpenEditProduct = (prod: Product) => {
        setEditingProduct(prod);
        setPTitle(prod.title);
        setPAuthor(prod.author || "");
        setPPublisher(prod.publisher || "");
        setPPublishYear(prod.publishYear || new Date().getFullYear());
        setPCurrentPrice(prod.currentPrice);
        setPOldPrice(prod.oldPrice || "");
        setPQuantity(prod.quantity);
        setPDescription(prod.description || "");
        setPCategoryId(prod.category ? prod.category.id : "");
        setPImage(prod.image || "");
        setShowProductModal(true);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pTitle || !pCurrentPrice || !pCategoryId) {
            triggerNotification("", "Vui lòng nhập đầy đủ các trường bắt buộc.");
            return;
        }

        const categoryObj = categories.find(c => c.id === Number(pCategoryId)) || null;

        const productPayload: any = {
            title: pTitle,
            author: pAuthor,
            publisher: pPublisher,
            publishYear: Number(pPublishYear),
            currentPrice: Number(pCurrentPrice),
            oldPrice: pOldPrice !== "" ? Number(pOldPrice) : null,
            quantity: Number(pQuantity),
            description: pDescription,
            category: categoryObj,
            image: pImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
            active: true
        };

        try {
            if (editingProduct) {
                // Edit Request
                const res = await axios.put(`http://localhost:8080/api/products/${editingProduct.id}`, productPayload, getAuthHeaders());
                if (res.data) {
                    setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
                    triggerNotification("Cập nhật sản phẩm thành công!");
                }
            } else {
                // Create Request
                const res = await axios.post("http://localhost:8080/api/products", productPayload, getAuthHeaders());
                if (res.data) {
                    setProducts([res.data, ...products]);
                    triggerNotification("Thêm sản phẩm mới thành công!");
                }
            }
            setShowProductModal(false);
        } catch (err: any) {
            console.error("Error saving product:", err);
            triggerNotification("", "Không thể lưu sản phẩm. Vui lòng kiểm tra lại.");
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/products/${id}`, getAuthHeaders());
            setProducts(products.filter(p => p.id !== id));
            triggerNotification("Xóa sản phẩm thành công!");
        } catch (err: any) {
            console.error("Error deleting product:", err);
            triggerNotification("", "Không thể xóa sản phẩm.");
        }
    };

    // =============================================
    // ORDER ACTIONS
    // =============================================
    const handleUpdateOrderStatus = async (orderId: number, statusId: number) => {
        try {
            const res = await axios.put(`http://localhost:8080/api/orders/${orderId}/status?statusId=${statusId}`, {}, getAuthHeaders());
            if (res.data) {
                setOrders(orders.map(o => o.id === orderId ? res.data : o));
                triggerNotification("Cập nhật trạng thái đơn hàng thành công!");
            }
        } catch (err: any) {
            console.error("Error updating order:", err);
            triggerNotification("", "Không thể cập nhật trạng thái đơn hàng.");
        }
    };

    // =============================================
    // USER ACTIONS
    // =============================================
    const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
        try {
            const res = await axios.put(`http://localhost:8080/api/users/${userId}/status?status=${!currentStatus}`, {}, getAuthHeaders());
            if (res.data) {
                setUsers(users.map(u => u.id === userId ? res.data : u));
                triggerNotification(`${!currentStatus ? "Mở khóa" : "Khóa"} tài khoản thành công!`);
            }
        } catch (err: any) {
            console.error("Error changing user status:", err);
            triggerNotification("", "Không thể thay đổi trạng thái người dùng.");
        }
    };

    const handleToggleUserRole = async (userId: number, currentRole: string) => {
        const nextRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        if (userId === adminUser.userId) {
            triggerNotification("", "Bạn không thể tự hạ quyền quản trị của chính mình.");
            return;
        }
        try {
            const res = await axios.put(`http://localhost:8080/api/users/${userId}/role?role=${nextRole}`, {}, getAuthHeaders());
            if (res.data) {
                setUsers(users.map(u => u.id === userId ? res.data : u));
                triggerNotification(`Đã đổi quyền thành công sang ${nextRole}!`);
            }
        } catch (err: any) {
            console.error("Error changing user role:", err);
            triggerNotification("", "Không thể thay đổi vai trò người dùng.");
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (userId === adminUser.userId) {
            triggerNotification("", "Bạn không thể xóa tài khoản hiện tại của mình.");
            return;
        }
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/users/${userId}`, getAuthHeaders());
            setUsers(users.filter(u => u.id !== userId));
            triggerNotification("Xóa tài khoản thành công!");
        } catch (err: any) {
            console.error("Error deleting user:", err);
            triggerNotification("", "Không thể xóa người dùng.");
        }
    };

    // =============================================
    // VOUCHER ACTIONS
    // =============================================
    const handleAddVoucher = (e: React.FormEvent) => {
        e.preventDefault();
        if (!vCode || !vDiscountValue) {
            triggerNotification("", "Vui lòng điền mã voucher và giá trị.");
            return;
        }

        const isExist = vouchers.some(v => v.code.toUpperCase() === vCode.toUpperCase());
        if (isExist) {
            triggerNotification("", "Mã Voucher này đã tồn tại.");
            return;
        }

        const newVoucher: Voucher = {
            code: vCode.toUpperCase(),
            discountType: vDiscountType,
            discountValue: Number(vDiscountValue),
            minOrderAmount: Number(vMinOrderAmount),
            active: true
        };

        const updated = [newVoucher, ...vouchers];
        localStorage.setItem("bookstore_vouchers", JSON.stringify(updated));
        setVouchers(updated);

        setVCode("");
        setVDiscountValue(0);
        setVMinOrderAmount(0);
        triggerNotification("Tạo Voucher giảm giá thành công!");
    };

    const handleDeleteVoucher = (code: string) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa mã voucher ${code}?`)) return;
        const updated = vouchers.filter(v => v.code !== code);
        localStorage.setItem("bookstore_vouchers", JSON.stringify(updated));
        setVouchers(updated);
        triggerNotification("Xóa Voucher thành công!");
    };

    // Helper to format currency
    const formatCurrency = (val: number | undefined | null) => {
        if (val === undefined || val === null) return "0 VNĐ";
        return val.toLocaleString("vi-VN") + " VNĐ";
    };

    // Summary calculations
    const totalRevenue = orders
        .filter(o => o.orderStatus && o.orderStatus.id === 4) // Delivered orders
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return (
        <div className="admin-dashboard-page">
            <Header />

            <div className="admin-layout">
                {/* SIDEBAR */}
                <aside className="admin-sidebar">
                    <div className="admin-profile-section">
                        <div className="admin-avatar">
                            {adminUser.avatar ? (
                                <img src={adminUser.avatar} alt="Admin" />
                            ) : (
                                <div className="avatar-fallback"><FaUserShield size={24} /></div>
                            )}
                        </div>
                        <div className="admin-profile-info">
                            <h4>{adminUser.fullName || adminUser.username}</h4>
                            <span>Quản trị viên</span>
                        </div>
                    </div>

                    <nav className="admin-side-menu">
                        <button
                            className={`side-menu-item ${activeTab === "overview" ? "active" : ""}`}
                            onClick={() => setActiveTab("overview")}
                        >
                            <FaChartBar /> Tổng quan
                        </button>
                        <button
                            className={`side-menu-item ${activeTab === "products" ? "active" : ""}`}
                            onClick={() => setActiveTab("products")}
                        >
                            <FaBook /> Sản phẩm ({products.length})
                        </button>
                        <button
                            className={`side-menu-item ${activeTab === "orders" ? "active" : ""}`}
                            onClick={() => setActiveTab("orders")}
                        >
                            <FaShoppingCart /> Đơn hàng ({orders.length})
                        </button>
                        <button
                            className={`side-menu-item ${activeTab === "users" ? "active" : ""}`}
                            onClick={() => setActiveTab("users")}
                        >
                            <FaUsers /> Người dùng ({users.length})
                        </button>
                        <button
                            className={`side-menu-item ${activeTab === "vouchers" ? "active" : ""}`}
                            onClick={() => setActiveTab("vouchers")}
                        >
                            <FaPercentage /> Vouchers ({vouchers.length})
                        </button>
                    </nav>

                    <div className="admin-sidebar-footer">
                        <Link to="/" className="side-menu-item"><FaHome /> Về Trang chủ</Link>
                    </div>
                </aside>

                {/* CONTENT AREA */}
                <main className="admin-content">
                    {/* Banners */}
                    {errorMsg && <div className="alert alert-danger mb-4">{errorMsg}</div>}
                    {successMsg && <div className="alert alert-success mb-4">{successMsg}</div>}

                    {loading ? (
                        <div className="admin-loading-spinner">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Đang đồng bộ hóa dữ liệu hệ thống...</p>
                        </div>
                    ) : (
                        <>
                            {/* OVERVIEW TAB */}
                            {activeTab === "overview" && (
                                <div className="admin-tab-content">
                                    <h2 className="tab-title">Thống kê hoạt động</h2>

                                    <div className="stats-grid">
                                        <div className="stat-card">
                                            <div className="stat-icon-wrapper sales"><FaChartBar /></div>
                                            <div className="stat-details">
                                                <span>Doanh thu thực tế</span>
                                                <h3>{formatCurrency(totalRevenue)}</h3>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon-wrapper orders"><FaShoppingCart /></div>
                                            <div className="stat-details">
                                                <span>Tổng đơn hàng</span>
                                                <h3>{orders.length} đơn</h3>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon-wrapper users"><FaUsers /></div>
                                            <div className="stat-details">
                                                <span>Tổng người dùng</span>
                                                <h3>{users.length} tài khoản</h3>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon-wrapper products"><FaBook /></div>
                                            <div className="stat-details">
                                                <span>Đầu sách trong kho</span>
                                                <h3>{products.length} cuốn</h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activity lists */}
                                    <div className="activity-panel-row">
                                        <div className="activity-panel">
                                            <h4>Đơn hàng mới nhất</h4>
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Khách hàng</th>
                                                            <th>Ngày mua</th>
                                                            <th>Tổng tiền</th>
                                                            <th>Trạng thái</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orders.slice(0, 5).map(o => (
                                                            <tr key={o.id}>
                                                                <td className="fw-semibold">{o.fullName}</td>
                                                                <td>{new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
                                                                <td className="text-danger fw-bold">{formatCurrency(o.totalAmount)}</td>
                                                                <td>
                                                                    <span className={`status-badge status-${o.orderStatus.id}`}>
                                                                        {o.orderStatus.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PRODUCTS TAB */}
                            {activeTab === "products" && (
                                <div className="admin-tab-content">
                                    <div className="tab-header-row">
                                        <h2 className="tab-title">Quản lý Sản phẩm</h2>
                                        <button className="btn-add-new" onClick={handleOpenAddProduct}>
                                            <FaPlus /> Thêm sản phẩm
                                        </button>
                                    </div>

                                    <div className="table-card">
                                        <div className="table-responsive">
                                            <table className="table admin-table align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Bìa sách</th>
                                                        <th>Tên sách</th>
                                                        <th>Tác giả / NXB</th>
                                                        <th>Số lượng</th>
                                                        <th>Giá bán</th>
                                                        <th className="text-center">Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products.map(p => (
                                                        <tr key={p.id}>
                                                            <td style={{ width: "80px" }}>
                                                                <img
                                                                    src={p.image || ""}
                                                                    alt={p.title}
                                                                    className="admin-product-thumb"
                                                                />
                                                            </td>
                                                            <td style={{ maxWidth: "250px" }}>
                                                                <div className="fw-bold text-truncate" title={p.title}>{p.title}</div>
                                                                <span className="badge bg-secondary" style={{ fontSize: "11px" }}>
                                                                    {p.category ? p.category.name : "Không phân loại"}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div style={{ fontSize: "14px", color: "#475569" }}>{p.author}</div>
                                                                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{p.publisher} ({p.publishYear})</div>
                                                            </td>
                                                            <td className="fw-semibold">{p.quantity} cuốn</td>
                                                            <td>
                                                                <div className="text-danger fw-bold">{formatCurrency(p.currentPrice)}</div>
                                                                {p.oldPrice && (
                                                                    <div className="text-decoration-line-through text-muted" style={{ fontSize: "12px" }}>
                                                                        {formatCurrency(p.oldPrice)}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="action-buttons-cell">
                                                                    <button className="btn-action-edit" title="Sửa" onClick={() => handleOpenEditProduct(p)}>
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button className="btn-action-delete" title="Xóa" onClick={() => handleDeleteProduct(p.id)}>
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ORDERS TAB */}
                            {activeTab === "orders" && (
                                <div className="admin-tab-content">
                                    <h2 className="tab-title">Quản lý Đơn hàng</h2>

                                    <div className="table-card">
                                        <div className="table-responsive">
                                            <table className="table admin-table align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Khách hàng</th>
                                                        <th>Liên hệ</th>
                                                        <th>Địa chỉ nhận hàng</th>
                                                        <th>Tổng thanh toán</th>
                                                        <th>Trạng thái hiện tại</th>
                                                        <th>Chuyển trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map(o => (
                                                        <tr key={o.id}>
                                                            <td className="fw-bold">#{o.id}</td>
                                                            <td>
                                                                <div className="fw-bold">{o.fullName}</div>
                                                                <div style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(o.createdAt).toLocaleString("vi-VN")}</div>
                                                            </td>
                                                            <td>
                                                                <div style={{ fontSize: "13px" }}>{o.phone}</div>
                                                                <div style={{ fontSize: "12px", color: "#64748b" }}>{o.email}</div>
                                                            </td>
                                                            <td style={{ maxWidth: "220px", fontSize: "13px", color: "#475569" }} className="text-truncate" title={o.address}>
                                                                {o.address}
                                                            </td>
                                                            <td>
                                                                <div className="text-danger fw-bold">{formatCurrency(o.totalAmount)}</div>
                                                                <span className="badge bg-light text-dark border" style={{ fontSize: "11px" }}>
                                                                    {o.paymentMethod}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={`status-badge status-${o.orderStatus.id}`}>
                                                                    {o.orderStatus.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <select
                                                                    className="form-select form-select-sm border-secondary-subtle"
                                                                    style={{ width: "160px", fontSize: "13px", fontWeight: "600" }}
                                                                    value={o.orderStatus.id}
                                                                    onChange={(e) => handleUpdateOrderStatus(o.id, Number(e.target.value))}
                                                                >
                                                                    <option value={1}>Chờ xác nhận</option>
                                                                    <option value={2}>Đã xác nhận</option>
                                                                    <option value={3}>Đang giao hàng</option>
                                                                    <option value={4}>Đã giao hàng</option>
                                                                    <option value={5}>Đã hủy</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* USERS TAB */}
                            {activeTab === "users" && (
                                <div className="admin-tab-content">
                                    <h2 className="tab-title">Quản lý Người dùng</h2>

                                    <div className="table-card">
                                        <div className="table-responsive">
                                            <table className="table admin-table align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Tài khoản</th>
                                                        <th>Thông tin liên hệ</th>
                                                        <th>Quyền hạn</th>
                                                        <th>Trạng thái</th>
                                                        <th className="text-center">Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map(u => (
                                                        <tr key={u.id}>
                                                            <td className="fw-bold">#{u.id}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    {u.avatar ? (
                                                                        <img src={u.avatar} alt="Avatar" className="user-table-avatar" />
                                                                    ) : (
                                                                        <div className="user-table-avatar-fallback"><FaUsers /></div>
                                                                    )}
                                                                    <div className="fw-bold">{u.username}</div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="fw-semibold" style={{ fontSize: "14px" }}>{u.fullName}</div>
                                                                <div style={{ fontSize: "12px", color: "#64748b" }}>{u.email} | {u.phone}</div>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${u.role === "ADMIN" ? "bg-primary" : "bg-info"}`} style={{ fontSize: "12px" }}>
                                                                    {u.role}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {u.status ? (
                                                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">Đang hoạt động</span>
                                                                ) : (
                                                                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">Đã bị khóa</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="action-buttons-cell">
                                                                    <button
                                                                        className={`btn-action-status ${u.status ? "lock" : "unlock"}`}
                                                                        title={u.status ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                                                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                                                                    >
                                                                        {u.status ? <FaTimes /> : <FaCheck />}
                                                                    </button>
                                                                    <button
                                                                        className="btn-action-role"
                                                                        title="Thay đổi quyền"
                                                                        onClick={() => handleToggleUserRole(u.id, u.role)}
                                                                    >
                                                                        <FaUserShield />
                                                                    </button>
                                                                    <button
                                                                        className="btn-action-delete"
                                                                        title="Xóa tài khoản"
                                                                        onClick={() => handleDeleteUser(u.id)}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* VOUCHERS TAB */}
                            {activeTab === "vouchers" && (
                                <div className="admin-tab-content">
                                    <h2 className="tab-title">Quản lý Vouchers giảm giá</h2>

                                    <div className="voucher-manager-row">
                                        {/* List Vouchers */}
                                        <div className="vouchers-list-card">
                                            <div className="table-responsive">
                                                <table className="table admin-table align-middle">
                                                    <thead>
                                                        <tr>
                                                            <th>Mã CODE</th>
                                                            <th>Loại giảm giá</th>
                                                            <th>Mức giảm</th>
                                                            <th>Đơn tối thiểu</th>
                                                            <th>Thao tác</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {vouchers.map(v => (
                                                            <tr key={v.code}>
                                                                <td className="fw-bold text-primary" style={{ fontSize: "16px", letterSpacing: "0.05em" }}>{v.code}</td>
                                                                <td>
                                                                    <span className="badge bg-secondary-subtle text-secondary-emphasis border px-2 py-1">
                                                                        {v.discountType === "percentage" ? "Giảm theo %" : "Giảm tiền mặt"}
                                                                    </span>
                                                                </td>
                                                                <td className="fw-bold text-success">
                                                                    {v.discountType === "percentage" ? `${v.discountValue}%` : formatCurrency(v.discountValue)}
                                                                </td>
                                                                <td className="fw-semibold">{formatCurrency(v.minOrderAmount)}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn-action-delete"
                                                                        title="Xóa voucher"
                                                                        onClick={() => handleDeleteVoucher(v.code)}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Add Voucher Form */}
                                        <div className="add-voucher-card">
                                            <h4>Tạo Voucher mới</h4>
                                            <form onSubmit={handleAddVoucher} className="add-voucher-form">
                                                <div className="mb-3">
                                                    <label className="form-label">Mã Code (viết liền không dấu)</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="VÍ DỤ: BOOKSTORE30"
                                                        value={vCode}
                                                        onChange={(e) => setVCode(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Loại chiết khấu</label>
                                                    <select
                                                        className="form-select"
                                                        value={vDiscountType}
                                                        onChange={(e) => setVDiscountType(e.target.value as "percentage" | "fixed")}
                                                    >
                                                        <option value="percentage">Giảm theo tỷ lệ phần trăm (%)</option>
                                                        <option value="fixed">Giảm theo số tiền mặt cố định (VNĐ)</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Giá trị chiết khấu</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="VÍ DỤ: 20 (nếu là %) hoặc 50000 (nếu là VNĐ)"
                                                        value={vDiscountValue || ""}
                                                        onChange={(e) => setVDiscountValue(Number(e.target.value))}
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label">Giá trị đơn hàng tối thiểu</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Mức tiền đơn hàng tối thiểu để áp dụng"
                                                        value={vMinOrderAmount || ""}
                                                        onChange={(e) => setVMinOrderAmount(Number(e.target.value))}
                                                    />
                                                </div>
                                                <button type="submit" className="btn-submit-voucher">
                                                    Tạo mã giảm giá
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* PRODUCT ADD/EDIT MODAL */}
            {showProductModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-container">
                        <div className="admin-modal-header">
                            <h3>{editingProduct ? "Cập nhật đầu sách" : "Thêm sách mới vào kho"}</h3>
                            <button className="btn-close-modal" onClick={() => setShowProductModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="admin-modal-form">
                            <div className="modal-form-grid">
                                <div className="form-group full-width">
                                    <label>Tên đầu sách <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nhập tên sách..."
                                        value={pTitle}
                                        onChange={(e) => setPTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tác giả</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tên tác giả..."
                                        value={pAuthor}
                                        onChange={(e) => setPAuthor(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nhà xuất bản</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nhà xuất bản..."
                                        value={pPublisher}
                                        onChange={(e) => setPPublisher(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Năm xuất bản</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={pPublishYear}
                                        onChange={(e) => setPPublishYear(Number(e.target.value))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Danh mục sách <span className="text-danger">*</span></label>
                                    <select
                                        className="form-select"
                                        value={pCategoryId}
                                        onChange={(e) => setPCategoryId(e.target.value !== "" ? Number(e.target.value) : "")}
                                        required
                                    >
                                        <option value="">Chọn danh mục...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Giá bán hiện tại (VNĐ) <span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Giá bán thực tế..."
                                        value={pCurrentPrice || ""}
                                        onChange={(e) => setPCurrentPrice(Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Giá bìa cũ (VNĐ)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Để trống nếu không có..."
                                        value={pOldPrice}
                                        onChange={(e) => setPOldPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số lượng trong kho</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={pQuantity}
                                        onChange={(e) => setPQuantity(Number(e.target.value))}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Đường dẫn hình ảnh bìa sách (Image URL)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="https://..."
                                        value={pImage}
                                        onChange={(e) => setPImage(e.target.value)}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Tóm tắt nội dung / Mô tả chi tiết</label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        placeholder="Nhập giới thiệu hoặc mô tả chi tiết của sách..."
                                        value={pDescription}
                                        onChange={(e) => setPDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowProductModal(false)}>Hủy</button>
                                <button type="submit" className="btn-save">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default AdminDashboard;
