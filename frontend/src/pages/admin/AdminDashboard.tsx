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
        { id: 1001, fullName: "Nguyễn Văn An", email: "nguyenan@gmail.com", phone: "0901234567", address: "123 Lê Lợi, Q.1, TP.HCM", totalAmount: 247000, paymentMethod: "COD", createdAt: "2026-06-17T08:30:00Z", orderStatus: { id: 4, status: "Đã giao hàng" } },
        { id: 1002, fullName: "Trần Thị Bích", email: "bichtran@gmail.com", phone: "0912345678", address: "45 Nguyễn Huệ, Q.1, TP.HCM", totalAmount: 379000, paymentMethod: "VNPay", createdAt: "2026-06-17T09:15:00Z", orderStatus: { id: 3, status: "Đang giao hàng" } },
        { id: 1003, fullName: "Lê Hoàng Nam", email: "namle@gmail.com", phone: "0923456789", address: "67 Trần Phú, Hà Đông, Hà Nội", totalAmount: 125000, paymentMethod: "COD", createdAt: "2026-06-16T14:22:00Z", orderStatus: { id: 2, status: "Đã xác nhận" } },
        { id: 1004, fullName: "Phạm Minh Châu", email: "chaupham@gmail.com", phone: "0934567890", address: "89 Bùi Thị Xuân, Đà Nẵng", totalAmount: 568000, paymentMethod: "MoMo", createdAt: "2026-06-16T11:05:00Z", orderStatus: { id: 4, status: "Đã giao hàng" } },
        { id: 1005, fullName: "Võ Thị Hoa", email: "hoavo@gmail.com", phone: "0945678901", address: "12 Phan Chu Trinh, Cần Thơ", totalAmount: 193000, paymentMethod: "COD", createdAt: "2026-06-15T16:40:00Z", orderStatus: { id: 1, status: "Chờ xác nhận" } },
        { id: 1006, fullName: "Đặng Quốc Bảo", email: "baodang@gmail.com", phone: "0956789012", address: "34 Hùng Vương, Huế", totalAmount: 447000, paymentMethod: "VNPay", createdAt: "2026-06-15T10:20:00Z", orderStatus: { id: 5, status: "Đã hủy" } },
        { id: 1007, fullName: "Ngô Thanh Tùng", email: "tungngo@gmail.com", phone: "0967890123", address: "56 Nguyễn Trãi, Q.5, TP.HCM", totalAmount: 312000, paymentMethod: "COD", createdAt: "2026-06-14T09:00:00Z", orderStatus: { id: 4, status: "Đã giao hàng" } },
        { id: 1008, fullName: "Bùi Lan Anh", email: "anhbui@gmail.com", phone: "0978901234", address: "78 Đinh Tiên Hoàng, Nha Trang", totalAmount: 89000, paymentMethod: "COD", createdAt: "2026-06-14T13:35:00Z", orderStatus: { id: 2, status: "Đã xác nhận" } },
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
                // Trộn đơn hàng từ localStorage với đơn hàng từ API, ưu tiên đơn hàng trong localStorage trước
                const merged = [...localUserOrders, ...orderRes.data]
                    .filter((o, i, arr) => arr.findIndex(x => x.id === o.id) === i)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(merged as any);
            }
        } catch {
            const localUserOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
            // Trộn đơn hàng từ localStorage với MOCK_ORDERS, ưu tiên đơn hàng trong localStorage trước để tránh đè trạng thái cũ
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
            // Nếu chỉ có dữ liệu default cũ (2 items), thay bằng mock đầy đủ hơn
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
                // Nếu order đang sửa là mock order và chưa có trong localStorage, ta copy nó vào localStorage
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
                                    <div className="tab-header-row">
                                        <div>
                                            <h2 className="tab-title" style={{ marginBottom: 4 }}>Quản lý Vouchers giảm giá</h2>
                                            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                                                Tạo và quản lý các mã giảm giá cho khách hàng
                                            </p>
                                        </div>
                                        <div className="voucher-count-badge">
                                            <FaPercentage />
                                            {vouchers.length} mã đang hoạt động
                                        </div>
                                    </div>

                                    <div className="voucher-manager-row">

                                        {/* ===== DANH SÁCH VOUCHERS ===== */}
                                        <div className="vouchers-list-panel">
                                            <div className="vouchers-list-header">
                                                <span>Danh sách mã giảm giá</span>
                                                <span className="vl-count">{vouchers.length} mã</span>
                                            </div>

                                            {vouchers.length === 0 ? (
                                                <div className="vouchers-empty">
                                                    <div className="vouchers-empty-icon">🎟️</div>
                                                    <p>Chưa có voucher nào</p>
                                                    <small>Tạo mã giảm giá đầu tiên bên phải →</small>
                                                </div>
                                            ) : (
                                                <div className="vouchers-card-grid">
                                                    {vouchers.map(v => (
                                                        <div key={v.code} className={`voucher-card ${v.discountType === "percentage" ? "vc-percent" : "vc-fixed"}`}>
                                                            <div className="vc-left">
                                                                <div className="vc-icon-wrap">
                                                                    {v.discountType === "percentage" ? "%" : "₫"}
                                                                </div>
                                                            </div>
                                                            <div className="vc-body">
                                                                <div className="vc-code">{v.code}</div>
                                                                <div className="vc-meta">
                                                                    <span className="vc-type-badge">
                                                                        {v.discountType === "percentage" ? "Giảm theo %" : "Giảm tiền mặt"}
                                                                    </span>
                                                                </div>
                                                                <div className="vc-details">
                                                                    <span className="vc-detail-item">
                                                                        🏷️ Giảm:&nbsp;
                                                                        <strong>
                                                                            {v.discountType === "percentage"
                                                                                ? `${v.discountValue}%`
                                                                                : formatCurrency(v.discountValue)
                                                                            }
                                                                        </strong>
                                                                    </span>
                                                                    <span className="vc-detail-item">
                                                                        🛒 Tối thiểu:&nbsp;
                                                                        <strong>{formatCurrency(v.minOrderAmount)}</strong>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="vc-right">
                                                                <div className="vc-value">
                                                                    {v.discountType === "percentage"
                                                                        ? `−${v.discountValue}%`
                                                                        : `−${(v.discountValue / 1000).toFixed(0)}K`
                                                                    }
                                                                </div>
                                                                <button
                                                                    className="vc-delete-btn"
                                                                    title="Xóa voucher"
                                                                    onClick={() => handleDeleteVoucher(v.code)}
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                            <div className="vc-notch vc-notch-left"></div>
                                                            <div className="vc-notch vc-notch-right"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* ===== FORM TẠO VOUCHER ===== */}
                                        <div className="add-voucher-panel">

                                            {/* Header */}
                                            <div className="avp-header">
                                                <div className="avp-header-icon">🎟️</div>
                                                <div>
                                                    <div className="avp-header-title">Tạo Voucher mới</div>
                                                    <div className="avp-header-sub">Mã giảm giá sẽ áp dụng ngay</div>
                                                </div>
                                            </div>

                                            {/* Live Preview */}
                                            <div className={`avp-preview ${vDiscountType === "percentage" ? "prev-percent" : "prev-fixed"}`}>
                                                <div className="avp-preview-label">Xem trước thẻ voucher</div>
                                                <div className="avp-preview-code">
                                                    {vCode || "BOOKSTORE30"}
                                                </div>
                                                <div className="avp-preview-value">
                                                    {vDiscountValue
                                                        ? vDiscountType === "percentage"
                                                            ? `GIẢM ${vDiscountValue}%`
                                                            : `GIẢM ${vDiscountValue.toLocaleString("vi-VN")}₫`
                                                        : "GIẢM ???"
                                                    }
                                                </div>
                                                {vMinOrderAmount > 0 && (
                                                    <div className="avp-preview-min">
                                                        Đơn tối thiểu {vMinOrderAmount.toLocaleString("vi-VN")}₫
                                                    </div>
                                                )}
                                                <div className="avp-preview-notch avp-preview-notch-l"></div>
                                                <div className="avp-preview-notch avp-preview-notch-r"></div>
                                            </div>

                                            {/* Form */}
                                            <form onSubmit={handleAddVoucher} className="avp-form">

                                                <div className="avp-field">
                                                    <label className="avp-label">
                                                        Mã Code <span className="required-star">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="avp-input"
                                                        placeholder="VD: BOOKSTORE30, SALE50..."
                                                        value={vCode}
                                                        onChange={(e) => setVCode(e.target.value.toUpperCase().replace(/\s/g, ""))}
                                                        required
                                                    />
                                                    <span className="avp-hint">Viết liền, không dấu, tự động in hoa</span>
                                                </div>

                                                <div className="avp-field">
                                                    <label className="avp-label">Loại chiết khấu</label>
                                                    <div className="avp-type-selector">
                                                        <button
                                                            type="button"
                                                            className={`avp-type-btn ${vDiscountType === "percentage" ? "active" : ""}`}
                                                            onClick={() => setVDiscountType("percentage")}
                                                        >
                                                            <span className="avp-type-icon">%</span>
                                                            <span>Theo phần trăm</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`avp-type-btn ${vDiscountType === "fixed" ? "active" : ""}`}
                                                            onClick={() => setVDiscountType("fixed")}
                                                        >
                                                            <span className="avp-type-icon">₫</span>
                                                            <span>Tiền mặt cố định</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="avp-row-2">
                                                    <div className="avp-field">
                                                        <label className="avp-label">
                                                            Giá trị giảm <span className="required-star">*</span>
                                                        </label>
                                                        <div className="avp-input-addon">
                                                            <input
                                                                type="number"
                                                                className="avp-input"
                                                                placeholder={vDiscountType === "percentage" ? "VD: 20" : "VD: 50000"}
                                                                min={0}
                                                                max={vDiscountType === "percentage" ? 100 : undefined}
                                                                value={vDiscountValue || ""}
                                                                onChange={(e) => setVDiscountValue(Number(e.target.value))}
                                                                required
                                                            />
                                                            <span className="avp-addon">
                                                                {vDiscountType === "percentage" ? "%" : "₫"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="avp-field">
                                                        <label className="avp-label">Đơn tối thiểu</label>
                                                        <div className="avp-input-addon">
                                                            <input
                                                                type="number"
                                                                className="avp-input"
                                                                placeholder="0"
                                                                min={0}
                                                                value={vMinOrderAmount || ""}
                                                                onChange={(e) => setVMinOrderAmount(Number(e.target.value))}
                                                            />
                                                            <span className="avp-addon">₫</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button type="submit" className="avp-btn-submit">
                                                    <FaPlus /> Tạo mã giảm giá
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
                <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowProductModal(false)}>
                    <div className="admin-modal-container premium-modal">

                        {/* HEADER */}
                        <div className="premium-modal-header">
                            <div className="premium-modal-header-left">
                                <div className="premium-modal-icon">
                                    <FaBook />
                                </div>
                                <div>
                                    <h3 className="premium-modal-title">
                                        {editingProduct ? "Cập nhật đầu sách" : "Thêm sách mới vào kho"}
                                    </h3>
                                    <p className="premium-modal-subtitle">
                                        {editingProduct ? "Chỉnh sửa thông tin sách đã có trong hệ thống" : "Điền đầy đủ thông tin để thêm sách vào kho"}
                                    </p>
                                </div>
                            </div>
                            <button className="premium-btn-close" onClick={() => setShowProductModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleSaveProduct}>
                            <div className="premium-modal-body">

                                {/* COT TRAI */}
                                <div className="premium-form-left">

                                    {/* Section: Thông tin sách */}
                                    <div className="pf-section">
                                        <div className="pf-section-title">
                                            <span className="pf-section-dot dot-blue"></span>
                                            Thông tin sách
                                        </div>

                                        <div className="pf-field">
                                            <label className="pf-label">
                                                Tên đầu sách <span className="required-star">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="pf-input"
                                                placeholder="VD: Dám Nghĩ Lớn, Đắc Nhân Tâm..."
                                                value={pTitle}
                                                onChange={(e) => setPTitle(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="pf-row-2">
                                            <div className="pf-field">
                                                <label className="pf-label">Tác giả</label>
                                                <input
                                                    type="text"
                                                    className="pf-input"
                                                    placeholder="Tên tác giả..."
                                                    value={pAuthor}
                                                    onChange={(e) => setPAuthor(e.target.value)}
                                                />
                                            </div>
                                            <div className="pf-field">
                                                <label className="pf-label">Nhà xuất bản</label>
                                                <input
                                                    type="text"
                                                    className="pf-input"
                                                    placeholder="NXB Trẻ, NXB Kim Đồng..."
                                                    value={pPublisher}
                                                    onChange={(e) => setPPublisher(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="pf-row-2">
                                            <div className="pf-field">
                                                <label className="pf-label">Năm xuất bản</label>
                                                <input
                                                    type="number"
                                                    className="pf-input"
                                                    min={1900}
                                                    max={new Date().getFullYear() + 1}
                                                    value={pPublishYear}
                                                    onChange={(e) => setPPublishYear(Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="pf-field">
                                                <label className="pf-label">
                                                    Danh mục <span className="required-star">*</span>
                                                </label>
                                                <select
                                                    className="pf-input pf-select"
                                                    value={pCategoryId}
                                                    onChange={(e) => setPCategoryId(e.target.value !== "" ? Number(e.target.value) : "")}
                                                    required
                                                >
                                                    <option value="">— Chọn danh mục —</option>
                                                    {categories.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Giá */}
                                    <div className="pf-section">
                                        <div className="pf-section-title">
                                            <span className="pf-section-dot dot-green"></span>
                                            Thông tin giá & Kho
                                        </div>

                                        <div className="pf-row-3">
                                            <div className="pf-field">
                                                <label className="pf-label">
                                                    Giá bán (VNĐ) <span className="required-star">*</span>
                                                </label>
                                                <div className="pf-input-addon">
                                                    <input
                                                        type="number"
                                                        className="pf-input"
                                                        placeholder="0"
                                                        min={0}
                                                        value={pCurrentPrice || ""}
                                                        onChange={(e) => setPCurrentPrice(Number(e.target.value))}
                                                        required
                                                    />
                                                    <span className="pf-addon">₫</span>
                                                </div>
                                            </div>
                                            <div className="pf-field">
                                                <label className="pf-label">Giá bìa gốc (VNĐ)</label>
                                                <div className="pf-input-addon">
                                                    <input
                                                        type="number"
                                                        className="pf-input"
                                                        placeholder="Để trống"
                                                        min={0}
                                                        value={pOldPrice}
                                                        onChange={(e) => setPOldPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                                                    />
                                                    <span className="pf-addon">₫</span>
                                                </div>
                                            </div>
                                            <div className="pf-field">
                                                <label className="pf-label">Số lượng kho</label>
                                                <div className="pf-input-addon">
                                                    <input
                                                        type="number"
                                                        className="pf-input"
                                                        min={0}
                                                        value={pQuantity}
                                                        onChange={(e) => setPQuantity(Number(e.target.value))}
                                                    />
                                                    <span className="pf-addon">cuốn</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Discount badge preview */}
                                        {pOldPrice !== "" && Number(pOldPrice) > 0 && pCurrentPrice > 0 && (
                                            <div className="pf-discount-preview">
                                                <span className="pf-discount-badge">
                                                    -{Math.round((1 - pCurrentPrice / Number(pOldPrice)) * 100)}% GIẢM GIÁ
                                                </span>
                                                <span className="pf-discount-label">
                                                    Khách hàng tiết kiệm: {(Number(pOldPrice) - pCurrentPrice).toLocaleString("vi-VN")}₫
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Section: Mô tả */}
                                    <div className="pf-section">
                                        <div className="pf-section-title">
                                            <span className="pf-section-dot dot-amber"></span>
                                            Mô tả & Giới thiệu
                                        </div>
                                        <div className="pf-field">
                                            <label className="pf-label">Tóm tắt nội dung</label>
                                            <textarea
                                                className="pf-input pf-textarea"
                                                rows={5}
                                                placeholder="Nhập giới thiệu ngắn hoặc nội dung tóm tắt của cuốn sách..."
                                                value={pDescription}
                                                onChange={(e) => setPDescription(e.target.value)}
                                            />
                                            <span className="pf-hint">Mô tả hấp dẫn giúp tăng tỷ lệ chuyển đổi</span>
                                        </div>
                                    </div>
                                </div>

                                {/* COT PHAI */}
                                <div className="premium-form-right">

                                    {/* Section: Ảnh bìa */}
                                    <div className="pf-section pf-image-section">
                                        <div className="pf-section-title">
                                            <span className="pf-section-dot dot-violet"></span>
                                            Ảnh bìa sách
                                        </div>

                                        {/* Book Cover Preview */}
                                        <div className="book-cover-preview">
                                            {pImage ? (
                                                <div className="book-cover-img-wrap">
                                                    <img src={pImage} alt="Bìa sách" className="book-cover-img" />
                                                    <div className="book-cover-overlay">
                                                        <button
                                                            type="button"
                                                            className="book-cover-remove"
                                                            onClick={() => setPImage("")}
                                                        >
                                                            × Xóa ảnh
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="book-cover-placeholder">
                                                    <div className="book-cover-spine"></div>
                                                    <div className="book-cover-empty">
                                                        <div className="book-icon-large">📚</div>
                                                        <span>Chưa có ảnh bìa</span>
                                                        <small>Nhập URL bên dưới</small>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pf-field">
                                            <label className="pf-label">URL hình ảnh bìa sách</label>
                                            <input
                                                type="text"
                                                className="pf-input"
                                                placeholder="https://example.com/book-cover.jpg"
                                                value={pImage}
                                                onChange={(e) => setPImage(e.target.value)}
                                            />
                                            <span className="pf-hint">Dán link ảnh từ internet (PNG, JPG, WEBP)</span>
                                        </div>
                                    </div>

                                    {/* Summary card */}
                                    <div className="pf-summary-card">
                                        <div className="pf-summary-title">📋 Xem trước thông tin</div>
                                        <div className="pf-summary-row">
                                            <span>Tên sách</span>
                                            <strong>{pTitle || "—"}</strong>
                                        </div>
                                        <div className="pf-summary-row">
                                            <span>Tác giả</span>
                                            <strong>{pAuthor || "—"}</strong>
                                        </div>
                                        <div className="pf-summary-row">
                                            <span>Giá bán</span>
                                            <strong className="pf-price-highlight">
                                                {pCurrentPrice ? pCurrentPrice.toLocaleString("vi-VN") + "₫" : "—"}
                                            </strong>
                                        </div>
                                        <div className="pf-summary-row">
                                            <span>Tồn kho</span>
                                            <strong>{pQuantity} cuốn</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="premium-modal-footer">
                                <div className="premium-footer-left">
                                    <span className="required-note">
                                        <span className="required-star">*</span> Trường bắt buộc
                                    </span>
                                </div>
                                <div className="premium-footer-right">
                                    <button type="button" className="pf-btn-cancel" onClick={() => setShowProductModal(false)}>
                                        Hủy bỏ
                                    </button>
                                    <button type="submit" className="pf-btn-save">
                                        {editingProduct ? "💾 Cập nhật sách" : "✚ Thêm vào kho"}
                                    </button>
                                </div>
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
