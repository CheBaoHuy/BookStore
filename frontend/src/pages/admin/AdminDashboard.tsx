import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    FaBook,
    FaShoppingCart,
    FaUsers,
    FaPercentage,
    FaChartBar,
    FaHome,
    FaLock,
    FaUserShield
} from "react-icons/fa";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { Product, Order, User, Category } from "../../models";
import { Voucher } from "./types";
import { AdminOverview } from "./components/AdminOverview";
import { AdminProducts } from "./components/AdminProducts";
import { AdminOrders } from "./components/AdminOrders";
import { AdminUsers } from "./components/AdminUsers";
import { AdminVouchers } from "./components/AdminVouchers";
import { ProductModal } from "./components/ProductModal";
import "./AdminDashboard.css";

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

    // Statistics Filter States
    const [timeFilter, setTimeFilter] = useState<"all" | "today" | "7days" | "30days" | "month">("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Product Modal Form States
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showProductModal, setShowProductModal] = useState(false);

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

    // =============================================
    // MOCK DATA (fallback khi backend offline)
    // =============================================
    const MOCK_CATEGORIES = [
        { id: 1, name: "Văn học" },
        { id: 2, name: "Kinh tế - Kinh doanh" },
        { id: 3, name: "Kỹ năng sống" },
        { id: 4, name: "Thiếu nhi" },
        { id: 5, name: "Khoa học - Công nghệ" },
        { id: 6, name: "Lịch sử - Địa lý" },
    ];

    const MOCK_PRODUCTS = [
        { id: 1, title: "Đắc Nhân Tâm", author: "Dale Carnegie", publisher: "NXB Tổng Hợp", publishYear: 2023, currentPrice: 68000, oldPrice: 85000, quantity: 124, description: "Cuốn sách kỹ năng sống bán chạy nhất mọi thời đại", category: MOCK_CATEGORIES[2], image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400", active: true },
        { id: 2, title: "Nhà Giả Kim", author: "Paulo Coelho", publisher: "NXB Hội Nhà Văn", publishYear: 2022, currentPrice: 79000, oldPrice: 98000, quantity: 87, description: "Câu chuyện về hành trình theo đuổi ước mơ", category: MOCK_CATEGORIES[0], image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400", active: true },
        { id: 3, title: "Tư Duy Nhanh Và Chậm", author: "Daniel Kahneman", publisher: "NXB Thế Giới", publishYear: 2023, currentPrice: 125000, oldPrice: 155000, quantity: 43, description: "Khám phá hai hệ thống tư duy của não bộ", category: MOCK_CATEGORIES[1], image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400", active: true },
        { id: 4, title: "Dám Nghĩ Lớn", author: "David J. Schwartz", publisher: "NXB Lao Động", publishYear: 2021, currentPrice: 55000, oldPrice: null, quantity: 200, description: "Bí quyết thành công trong công việc và cuộc sống", category: MOCK_CATEGORIES[2], image: "https://images.unsplash.com/photo-1476275466078-4cdc8bea8b44?auto=format&fit=crop&q=80&w=400", active: true },
        { id: 5, title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", publisher: "NXB Tri Thức", publishYear: 2022, currentPrice: 189000, oldPrice: 220000, quantity: 61, description: "Hành trình của loài người từ thời tiền sử đến hiện đại", category: MOCK_CATEGORIES[5], image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=400", active: true },
    ];

    const MOCK_ORDERS = [
        { 
            id: 1001, fullName: "Nguyễn Văn An", email: "nguyenan@gmail.com", phone: "0901234567", address: "123 Lê Lợi, Q.1, TP.HCM", totalAmount: 247000, paymentMethod: "COD", createdAt: "2026-06-17T08:30:00Z", orderStatus: { id: 4, status: "Đã giao hàng" },
            orderDetails: [
                { id: 1, quantity: 2, price: 68000, product: { id: 1, title: "Đắc Nhân Tâm", author: "Dale Carnegie", currentPrice: 68000, category: { id: 3, name: "Kỹ năng sống" } } },
                { id: 2, quantity: 1, price: 79000, product: { id: 2, title: "Nhà Giả Kim", author: "Paulo Coelho", currentPrice: 79000, category: { id: 1, name: "Văn học" } } }
            ]
        },
        { 
            id: 1002, fullName: "Trần Thị Bích", email: "bichtran@gmail.com", phone: "0912345678", address: "45 Nguyễn Huệ, Q.1, TP.HCM", totalAmount: 379000, paymentMethod: "VNPay", createdAt: "2026-06-17T09:15:00Z", orderStatus: { id: 3, status: "Đang giao hàng" },
            orderDetails: [
                { id: 3, quantity: 2, price: 125000, product: { id: 3, title: "Tư Duy Nhanh Và Chậm", author: "Daniel Kahneman", currentPrice: 125000, category: { id: 2, name: "Kinh tế - Kinh doanh" } } },
                { id: 4, quantity: 1, price: 79000, product: { id: 2, title: "Nhà Giả Kim", author: "Paulo Coelho", currentPrice: 79000, category: { id: 1, name: "Văn học" } } }
            ]
        },
        { 
            id: 1003, fullName: "Lê Hoàng Nam", email: "namle@gmail.com", phone: "0923456789", address: "67 Trần Phú, Hà Đông, Hà Nội", totalAmount: 125000, paymentMethod: "COD", createdAt: "2026-06-16T14:22:00Z", orderStatus: { id: 2, status: "Đã xác nhận" },
            orderDetails: [
                { id: 5, quantity: 1, price: 125000, product: { id: 3, title: "Tư Duy Nhanh Và Chậm", author: "Daniel Kahneman", currentPrice: 125000, category: { id: 2, name: "Kinh tế - Kinh doanh" } } }
            ]
        },
        { 
            id: 1004, fullName: "Phạm Minh Châu", email: "chaupham@gmail.com", phone: "0934567890", address: "89 Bùi Thị Xuân, Đà Nẵng", totalAmount: 568000, paymentMethod: "MoMo", createdAt: "2026-06-16T11:05:00Z", orderStatus: { id: 4, status: "Đã giao hàng" },
            orderDetails: [
                { id: 6, quantity: 2, price: 189000, product: { id: 5, title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", currentPrice: 189000, category: { id: 6, name: "Lịch sử - Địa lý" } } },
                { id: 7, quantity: 1, price: 125000, product: { id: 3, title: "Tư Duy Nhanh Và Chậm", author: "Daniel Kahneman", currentPrice: 125000, category: { id: 2, name: "Kinh tế - Kinh doanh" } } }
            ]
        },
        { 
            id: 1005, fullName: "Võ Thị Hoa", email: "hoavo@gmail.com", phone: "0945678901", address: "12 Phan Chu Trinh, Cần Thơ", totalAmount: 193000, paymentMethod: "COD", createdAt: "2026-06-15T16:40:00Z", orderStatus: { id: 1, status: "Chờ xác nhận" },
            orderDetails: [
                { id: 8, quantity: 2, price: 79000, product: { id: 2, title: "Nhà Giả Kim", author: "Paulo Coelho", currentPrice: 79000, category: { id: 1, name: "Văn học" } } }
            ]
        },
        { 
            id: 1006, fullName: "Đặng Quốc Bảo", email: "baodang@gmail.com", phone: "0956789012", address: "34 Hùng Vương, Huế", totalAmount: 447000, paymentMethod: "VNPay", createdAt: "2026-06-15T10:20:00Z", orderStatus: { id: 5, status: "Đã hủy" },
            orderDetails: [
                { id: 9, quantity: 2, price: 189000, product: { id: 5, title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", currentPrice: 189000, category: { id: 6, name: "Lịch sử - Địa lý" } } },
                { id: 10, quantity: 1, price: 68000, product: { id: 1, title: "Đắc Nhân Tâm", author: "Dale Carnegie", currentPrice: 68000, category: { id: 3, name: "Kỹ năng sống" } } }
            ]
        },
        { 
            id: 1007, fullName: "Ngô Thanh Tùng", email: "tungngo@gmail.com", phone: "0967890123", address: "56 Nguyễn Trãi, Q.5, TP.HCM", totalAmount: 312000, paymentMethod: "COD", createdAt: "2026-06-14T09:00:00Z", orderStatus: { id: 4, status: "Đã giao hàng" },
            orderDetails: [
                { id: 11, quantity: 2, price: 125000, product: { id: 3, title: "Tư Duy Nhanh Và Chậm", author: "Daniel Kahneman", currentPrice: 125000, category: { id: 2, name: "Kinh tế - Kinh doanh" } } }
            ]
        },
        { 
            id: 1008, fullName: "Bùi Lan Anh", email: "anhbui@gmail.com", phone: "0978901234", address: "78 Đinh Tiên Hoàng, Nha Trang", totalAmount: 89000, paymentMethod: "COD", createdAt: "2026-06-14T13:35:00Z", orderStatus: { id: 2, status: "Đã xác nhận" },
            orderDetails: [
                { id: 12, quantity: 1, price: 55000, product: { id: 4, title: "Dám Nghĩ Lớn", author: "David J. Schwartz", currentPrice: 55000, category: { id: 3, name: "Kỹ năng sống" } } }
            ]
        },
    ];

    const MOCK_USERS = [
        { id: 1, username: "admin", fullName: "Quản Trị Viên", email: "admin@bookstore.vn", phone: "0901111111", role: "ADMIN", status: true, avatar: "" },
        { id: 2, username: "nguyenan", fullName: "Nguyễn Văn An", email: "nguyenan@gmail.com", phone: "0901234567", role: "USER", status: true, avatar: "" },
        { id: 3, username: "bichtran", fullName: "Trần Thị Bích", email: "bichtran@gmail.com", phone: "0912345678", role: "USER", status: true, avatar: "" },
        { id: 4, username: "namle", fullName: "Lê Hoàng Nam", email: "namle@gmail.com", phone: "0923456789", role: "USER", status: true, avatar: "" },
        { id: 5, username: "chaupham", fullName: "Phạm Minh Châu", email: "chaupham@gmail.com", phone: "0934567890", role: "USER", status: false, avatar: "" },
        { id: 6, username: "hoavo", fullName: "Võ Thị Hoa", email: "hoavo@gmail.com", phone: "0945678901", role: "USER", status: true, avatar: "" },
        { id: 7, username: "baodang", fullName: "Đặng Quốc Bảo", email: "baodang@gmail.com", phone: "0956789012", role: "USER", status: true, avatar: "" },
        { id: 8, username: "reader2024", fullName: "Ngô Thanh Tùng", email: "tungngo@gmail.com", phone: "0967890123", role: "USER", status: false, avatar: "" },
    ];

    const MOCK_VOUCHERS: Voucher[] = [
        { code: "WELCOME20", discountType: "percentage", discountValue: 20, minOrderAmount: 150000, active: true },
        { code: "SALE50K", discountType: "fixed", discountValue: 50000, minOrderAmount: 300000, active: true },
        { code: "BOOK30", discountType: "percentage", discountValue: 30, minOrderAmount: 200000, active: true },
        { code: "FREESHIP", discountType: "fixed", discountValue: 30000, minOrderAmount: 100000, active: true },
        { code: "VIP100K", discountType: "fixed", discountValue: 100000, minOrderAmount: 500000, active: true },
    ];

    const fetchInitialData = async () => {
        setLoading(true);
        let usedMock = false;

        // --- Products ---
        try {
            const prodRes = await axios.get("http://localhost:8080/api/products?page=0&size=100");
            if (prodRes.data && prodRes.data.content) setProducts(prodRes.data.content);
        } catch {
            setProducts(MOCK_PRODUCTS as any);
            usedMock = true;
        }

        // --- Categories ---
        try {
            const catRes = await axios.get("http://localhost:8080/api/categories");
            if (catRes.data) setCategories(catRes.data);
        } catch {
            setCategories(MOCK_CATEGORIES as any);
        }

        // --- Orders ---
        try {
            const orderRes = await axios.get("http://localhost:8080/api/orders", getAuthHeaders());
            if (orderRes.data) {
                const localUserOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
                const merged = [...localUserOrders, ...orderRes.data]
                    .filter((o, i, arr) => arr.findIndex(x => x.id === o.id) === i)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(merged as any);
            }
        } catch {
            const localUserOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
            const merged = [...localUserOrders, ...MOCK_ORDERS]
                .filter((o, i, arr) => arr.findIndex(x => x.id === o.id) === i)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(merged as any);
            usedMock = true;
        }

        // --- Users ---
        try {
            const userRes = await axios.get("http://localhost:8080/api/users", getAuthHeaders());
            if (userRes.data) setUsers(userRes.data);
        } catch {
            setUsers(MOCK_USERS as any);
            usedMock = true;
        }

        // --- Vouchers ---
        const storedVouchers = localStorage.getItem("bookstore_vouchers");
        if (storedVouchers) {
            const parsed = JSON.parse(storedVouchers);
            if (parsed.length <= 2) {
                localStorage.setItem("bookstore_vouchers", JSON.stringify(MOCK_VOUCHERS));
                setVouchers(MOCK_VOUCHERS);
            } else {
                setVouchers(parsed);
            }
        } else {
            localStorage.setItem("bookstore_vouchers", JSON.stringify(MOCK_VOUCHERS));
            setVouchers(MOCK_VOUCHERS);
        }

        if (usedMock) {
            setErrorMsg("⚠️ Backend chưa kết nối — đang hiển thị dữ liệu mẫu để demo giao diện.");
            setTimeout(() => setErrorMsg(""), 5000);
        }

        setLoading(false);
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
        setShowProductModal(true);
    };

    const handleOpenEditProduct = (prod: Product) => {
        setEditingProduct(prod);
        setShowProductModal(true);
    };

    const handleSaveProduct = async (productPayload: any) => {
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
            
            // Cập nhật ngoại tuyến (offline fallback)
            const statusMap: Record<number, string> = {
                1: "Chờ xác nhận",
                2: "Đã xác nhận",
                3: "Đang giao hàng",
                4: "Đã giao hàng",
                5: "Đã hủy"
            };
            const newStatus = { id: statusId, status: statusMap[statusId] || "Chờ xác nhận" };
            
            const updatedOrders = orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
            setOrders(updatedOrders);
            
            const localUserOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
            const index = localUserOrders.findIndex((o: any) => o.id === orderId);
            if (index !== -1) {
                localUserOrders[index].orderStatus = newStatus;
                localStorage.setItem("user_orders", JSON.stringify(localUserOrders));
            } else {
                const targetOrder = orders.find(o => o.id === orderId);
                if (targetOrder) {
                    const updatedOrder = { ...targetOrder, orderStatus: newStatus };
                    localUserOrders.push(updatedOrder);
                    localStorage.setItem("user_orders", JSON.stringify(localUserOrders));
                }
            }
            
            triggerNotification("Cập nhật trạng thái đơn hàng thành công (offline)!");
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
    const handleAddVoucher = (newVoucher: Voucher): boolean => {
        const isExist = vouchers.some(v => v.code.toUpperCase() === newVoucher.code.toUpperCase());
        if (isExist) {
            triggerNotification("", "Mã Voucher này đã tồn tại.");
            return false;
        }

        const updated = [newVoucher, ...vouchers];
        localStorage.setItem("bookstore_vouchers", JSON.stringify(updated));
        setVouchers(updated);
        triggerNotification("Tạo Voucher giảm giá thành công!");
        return true;
    };

    const handleDeleteVoucher = (code: string) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa mã voucher ${code}?`)) return;
        const updated = vouchers.filter(v => v.code !== code);
        localStorage.setItem("bookstore_vouchers", JSON.stringify(updated));
        setVouchers(updated);
        triggerNotification("Xóa Voucher thành công!");
    };

    const formatCurrency = (val: number | undefined | null) => {
        if (val === undefined || val === null) return "0 VNĐ";
        return val.toLocaleString("vi-VN") + " VNĐ";
    };

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
                            {activeTab === "overview" && (
                                <AdminOverview
                                    products={products}
                                    orders={orders}
                                    users={users}
                                    categories={categories}
                                    timeFilter={timeFilter}
                                    setTimeFilter={setTimeFilter}
                                    categoryFilter={categoryFilter}
                                    setCategoryFilter={setCategoryFilter}
                                    formatCurrency={formatCurrency}
                                />
                            )}

                            {activeTab === "products" && (
                                <AdminProducts
                                    products={products}
                                    onEditProduct={handleOpenEditProduct}
                                    onDeleteProduct={handleDeleteProduct}
                                    onOpenAddProduct={handleOpenAddProduct}
                                    formatCurrency={formatCurrency}
                                />
                            )}

                            {activeTab === "orders" && (
                                <AdminOrders
                                    orders={orders}
                                    onUpdateOrderStatus={handleUpdateOrderStatus}
                                    formatCurrency={formatCurrency}
                                />
                            )}

                            {activeTab === "users" && (
                                <AdminUsers
                                    users={users}
                                    adminUserId={adminUser.userId}
                                    onToggleUserStatus={handleToggleUserStatus}
                                    onToggleUserRole={handleToggleUserRole}
                                    onDeleteUser={handleDeleteUser}
                                />
                            )}

                            {activeTab === "vouchers" && (
                                <AdminVouchers
                                    vouchers={vouchers}
                                    onAddVoucher={handleAddVoucher}
                                    onDeleteVoucher={handleDeleteVoucher}
                                    formatCurrency={formatCurrency}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* PRODUCT ADD/EDIT MODAL */}
            <ProductModal
                isOpen={showProductModal}
                editingProduct={editingProduct}
                categories={categories}
                onClose={() => setShowProductModal(false)}
                onSaveProduct={handleSaveProduct}
            />

            <Footer />
        </div>
    );
}

export default AdminDashboard;
