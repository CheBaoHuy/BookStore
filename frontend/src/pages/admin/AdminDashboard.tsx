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

    // Statistics Filter States
    const [timeFilter, setTimeFilter] = useState<"all" | "today" | "7days" | "30days" | "month">("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Pagination States
    const [pCurrentPage, setPCurrentPage] = useState<number>(1);
    const [oCurrentPage, setOCurrentPage] = useState<number>(1);
    const [uCurrentPage, setUCurrentPage] = useState<number>(1);
    const [vCurrentPage, setVCurrentPage] = useState<number>(1);

    // Pagination Constants
    const PRODUCTS_PER_PAGE = 8;
    const ORDERS_PER_PAGE = 8;
    const USERS_PER_PAGE = 8;
    const VOUCHERS_PER_PAGE = 6;

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

    // Helper to get orders after applying filters
    const getFilteredOrders = () => {
        return orders.filter(o => {
            // 1. Time Filter
            if (timeFilter === "today") {
                const todayStr = new Date().toLocaleDateString("en-CA");
                const orderDateStr = new Date(o.createdAt).toLocaleDateString("en-CA");
                if (todayStr !== orderDateStr) return false;
            } else if (timeFilter === "7days") {
                const limitDate = new Date();
                limitDate.setDate(limitDate.getDate() - 7);
                if (new Date(o.createdAt) < limitDate) return false;
            } else if (timeFilter === "30days") {
                const limitDate = new Date();
                limitDate.setDate(limitDate.getDate() - 30);
                if (new Date(o.createdAt) < limitDate) return false;
            } else if (timeFilter === "month") {
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                const orderDate = new Date(o.createdAt);
                if (orderDate.getMonth() !== currentMonth || orderDate.getFullYear() !== currentYear) return false;
            }

            // 2. Category Filter (checks if any product in order belongs to the category)
            if (categoryFilter !== "all") {
                const details = o.orderDetails || [];
                const hasCategoryProduct = details.some(d => d.product && d.product.category && d.product.category.id === Number(categoryFilter));
                if (!hasCategoryProduct) return false;
            }

            return true;
        });
    };

    const filteredOrders = getFilteredOrders();

    // Summary calculations
    const statsRevenue = filteredOrders
        .filter(o => o.orderStatus && o.orderStatus.id === 4) // Delivered orders
        .reduce((sum, o) => {
            if (categoryFilter === "all") {
                return sum + (o.totalAmount || 0);
            } else {
                const details = o.orderDetails || [];
                const catTotal = details
                    .filter((d: any) => d.product && d.product.category && d.product.category.id === Number(categoryFilter))
                    .reduce((s: number, d: any) => s + (d.price * d.quantity), 0);
                return sum + catTotal;
            }
        }, 0);

    const statsOrdersCount = filteredOrders.length;

    // Unique customers count or fallback to users count
    const statsUsersCount = new Set(filteredOrders.map(o => o.email)).size || users.length;

    // Count of unique product titles sold (or stock books count fallback)
    const statsBooksCount = filteredOrders
        .filter(o => o.orderStatus && o.orderStatus.id === 4)
        .reduce((set, o) => {
            const details = o.orderDetails || [];
            details.forEach((d: any) => {
                if (d.product) {
                    if (categoryFilter === "all" || (d.product.category && d.product.category.id === Number(categoryFilter))) {
                        set.add(d.product.id);
                    }
                }
            });
            return set;
        }, new Set<number>()).size || products.length;

    // Get top 5 best selling books in selection
    const getBestSellingBooks = () => {
        const salesMap: Record<number, { product: Product; quantity: number; revenue: number }> = {};

        filteredOrders
            .filter(o => o.orderStatus && o.orderStatus.id === 4)
            .forEach(o => {
                const details = o.orderDetails || [];
                details.forEach((d: any) => {
                    if (d.product) {
                        const isMatchingCategory = categoryFilter === "all" || (d.product.category && d.product.category.id === Number(categoryFilter));
                        if (isMatchingCategory) {
                            if (!salesMap[d.product.id]) {
                                salesMap[d.product.id] = {
                                    product: d.product,
                                    quantity: 0,
                                    revenue: 0
                                };
                            }
                            salesMap[d.product.id].quantity += d.quantity;
                            salesMap[d.product.id].revenue += d.price * d.quantity;
                        }
                    }
                });
            });

        return Object.values(salesMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
    };

    // Get category revenue share
    const getCategoryShare = () => {
        const shareMap: Record<number, { categoryName: string; quantity: number; revenue: number }> = {};

        filteredOrders
            .filter(o => o.orderStatus && o.orderStatus.id === 4)
            .forEach(o => {
                const details = o.orderDetails || [];
                details.forEach((d: any) => {
                    if (d.product && d.product.category) {
                        const cat = d.product.category;
                        const catId = cat.id;
                        if (!shareMap[catId]) {
                            shareMap[catId] = {
                                categoryName: cat.name,
                                quantity: 0,
                                revenue: 0
                            };
                        }
                        shareMap[catId].quantity += d.quantity;
                        shareMap[catId].revenue += d.price * d.quantity;
                    }
                });
            });

        const sorted = Object.values(shareMap).sort((a, b) => b.revenue - a.revenue);
        const totalShareRevenue = sorted.reduce((sum, c) => sum + c.revenue, 0);

        return sorted.map(c => ({
            ...c,
            percentage: totalShareRevenue > 0 ? Math.round((c.revenue / totalShareRevenue) * 100) : 0
        })).slice(0, 5);
    };

    // Get 7-day revenue trend
    const getRevenueTrend = () => {
        const trend: { label: string; revenue: number }[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toLocaleDateString("en-CA");
            const label = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });

            const dayRevenue = orders
                .filter(o => o.orderStatus && o.orderStatus.id === 4)
                .filter(o => new Date(o.createdAt).toLocaleDateString("en-CA") === dateStr)
                .reduce((sum, o) => {
                    if (categoryFilter === "all") {
                        return sum + (o.totalAmount || 0);
                    } else {
                        const details = o.orderDetails || [];
                        return sum + details
                            .filter((det: any) => det.product && det.product.category && det.product.category.id === Number(categoryFilter))
                            .reduce((s: number, det: any) => s + (det.price * det.quantity), 0);
                    }
                }, 0);

            trend.push({ label, revenue: dayRevenue });
        }

        return trend;
    };

    const bestSellers = getBestSellingBooks();
    const categoryShare = getCategoryShare();
    const revenueTrend = getRevenueTrend();

    // Slicing logic for paginated lists with dynamic adjustments
    const totalProductPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const validPCurrentPage = Math.min(pCurrentPage, Math.max(1, totalProductPages));
    const paginatedProducts = products.slice((validPCurrentPage - 1) * PRODUCTS_PER_PAGE, validPCurrentPage * PRODUCTS_PER_PAGE);

    const totalOrderPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
    const validOCurrentPage = Math.min(oCurrentPage, Math.max(1, totalOrderPages));
    const paginatedOrders = orders.slice((validOCurrentPage - 1) * ORDERS_PER_PAGE, validOCurrentPage * ORDERS_PER_PAGE);

    const totalUserPages = Math.ceil(users.length / USERS_PER_PAGE);
    const validUCurrentPage = Math.min(uCurrentPage, Math.max(1, totalUserPages));
    const paginatedUsers = users.slice((validUCurrentPage - 1) * USERS_PER_PAGE, validUCurrentPage * USERS_PER_PAGE);

    const totalVoucherPages = Math.ceil(vouchers.length / VOUCHERS_PER_PAGE);
    const validVCurrentPage = Math.min(vCurrentPage, Math.max(1, totalVoucherPages));
    const paginatedVouchers = vouchers.slice((validVCurrentPage - 1) * VOUCHERS_PER_PAGE, validVCurrentPage * VOUCHERS_PER_PAGE);

    const renderPagination = (currentPage: number, totalPages: number, onPageChange: (page: number) => void) => {
        if (totalPages <= 1) return null;

        const pageNumbers: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
        } else {
            pageNumbers.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 2) {
                end = 4;
            } else if (currentPage >= totalPages - 1) {
                start = totalPages - 3;
            }

            if (start > 2) {
                pageNumbers.push("...");
            }

            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            if (end < totalPages - 1) {
                pageNumbers.push("...");
            }

            pageNumbers.push(totalPages);
        }

        return (
            <div className="admin-pagination d-flex justify-content-center align-items-center gap-2 mt-4">
                <button
                    className="pagination-btn prev-btn"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    title="Trang trước"
                >
                    &lsaquo; Trước
                </button>
                {pageNumbers.map((p, idx) => {
                    if (p === "...") {
                        return <span key={`dots-${idx}`} className="pagination-dots px-2">...</span>;
                    }
                    return (
                        <button
                            key={`page-${p}`}
                            className={`pagination-btn page-num ${currentPage === p ? 'active' : ''}`}
                            onClick={() => onPageChange(p as number)}
                        >
                            {p}
                        </button>
                    );
                })}
                <button
                    className="pagination-btn next-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    title="Trang sau"
                >
                    Sau &rsaquo;
                </button>
            </div>
        );
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
                            {/* OVERVIEW TAB */}
                            {activeTab === "overview" && (
                                <div className="admin-tab-content">
                                    <div className="tab-header-row flex-column flex-sm-row align-items-start align-items-sm-center">
                                        <h2 className="tab-title mb-2 mb-sm-0">Thống kê hoạt động</h2>
                                        
                                        {/* FILTER TOOLBAR */}
                                        <div className="stats-filters-row d-flex gap-2">
                                            <div className="filter-group">
                                                <select
                                                    className="form-select filter-select"
                                                    value={timeFilter}
                                                    onChange={(e) => setTimeFilter(e.target.value as any)}
                                                    title="Lọc theo thời gian"
                                                >
                                                    <option value="all">📅 Tất cả thời gian</option>
                                                    <option value="today">📅 Hôm nay</option>
                                                    <option value="7days">📅 7 ngày qua</option>
                                                    <option value="30days">📅 30 ngày qua</option>
                                                    <option value="month">📅 Tháng này</option>
                                                </select>
                                            </div>
                                            <div className="filter-group">
                                                <select
                                                    className="form-select filter-select"
                                                    value={categoryFilter}
                                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                                    title="Lọc theo danh mục sách"
                                                >
                                                    <option value="all">📁 Tất cả danh mục</option>
                                                    {categories.map(c => (
                                                        <option key={c.id} value={c.id}>📁 {c.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
 
                                    {/* STATS CARDS */}
                                    <div className="stats-grid">
                                        <div className="stat-card">
                                            <div className="stat-icon-wrapper sales"><FaChartBar /></div>
                                            <div className="stat-details">
                                                <span>Doanh thu thực tế</span>
                                                <h3>{formatCurrency(statsRevenue)}</h3>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon-wrapper orders"><FaShoppingCart /></div>
                                            <div className="stat-details">
                                                <span>Tổng đơn hàng</span>
                                                <h3>{statsOrdersCount} đơn</h3>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon-wrapper users"><FaUsers /></div>
                                            <div className="stat-details">
                                                <span>Tổng người dùng</span>
                                                <h3>{statsUsersCount} tài khoản</h3>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon-wrapper products"><FaBook /></div>
                                            <div className="stat-details">
                                                <span>Đầu sách đã bán</span>
                                                <h3>{statsBooksCount} cuốn</h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CHARTS CONTAINER */}
                                    <div className="dashboard-charts-row">
                                        {/* Sales Trend Line Chart */}
                                        <div className="chart-panel">
                                            <h4 className="chart-title">Xu hướng doanh thu (7 ngày)</h4>
                                            <div className="chart-container">
                                                {(() => {
                                                    const maxRevenue = Math.max(...revenueTrend.map(t => t.revenue), 100000);
                                                    const points = revenueTrend.map((t, i) => {
                                                        const x = 50 + i * 60;
                                                        const y = 160 - (t.revenue / maxRevenue) * 120;
                                                        return { x, y, label: t.label, revenue: t.revenue };
                                                    });
                                                    const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
                                                    const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z` : "";
                                                    
                                                    return (
                                                        <svg className="w-100 h-100" viewBox="0 0 450 200" style={{ overflow: "visible" }}>
                                                            <defs>
                                                                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                                                                </linearGradient>
                                                            </defs>
                                                            {/* Grid Lines */}
                                                            <line x1="40" y1="40" x2="420" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                                                            <line x1="40" y1="100" x2="420" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                                                            <line x1="40" y1="160" x2="420" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />
                                                            
                                                            {/* Trend Area and Line */}
                                                            {areaPath && <path d={areaPath} fill="url(#chart-grad)" />}
                                                            {linePath && <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
                                                            
                                                            {/* Data Points */}
                                                            {points.map((p, i) => (
                                                                <g key={i} className="chart-dot-group">
                                                                    <circle cx={p.x} cy={p.y} r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                                                                    {/* Tooltip value */}
                                                                    <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b" className="chart-tooltip">
                                                                        {p.revenue > 0 ? `${(p.revenue / 1000).toFixed(0)}K` : ""}
                                                                    </text>
                                                                    {/* X Axis Label */}
                                                                    <text x={p.x} y="180" textAnchor="middle" fontSize="10" fontWeight="600" fill="#94a3b8">
                                                                        {p.label}
                                                                    </text>
                                                                </g>
                                                            ))}
                                                        </svg>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        {/* Category Share Progress Bars */}
                                        <div className="chart-panel">
                                            <h4 className="chart-title">Cơ cấu doanh thu danh mục</h4>
                                            <div className="category-share-list">
                                                {categoryShare.length === 0 ? (
                                                    <div className="text-center text-muted py-5" style={{ fontSize: "14px" }}>
                                                        Không có dữ liệu danh mục trong thời gian này
                                                    </div>
                                                ) : (
                                                    categoryShare.map((cat, idx) => {
                                                        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#7c3aed", "#ec4899"];
                                                        const color = colors[idx % colors.length];
                                                        return (
                                                            <div key={idx} className="category-share-item">
                                                                <div className="cs-info d-flex justify-content-between mb-1">
                                                                    <span className="cs-name">{cat.categoryName}</span>
                                                                    <span className="cs-val fw-bold">{formatCurrency(cat.revenue)} ({cat.percentage}%)</span>
                                                                </div>
                                                                <div className="cs-bar-wrap">
                                                                    <div className="cs-bar" style={{ width: `${cat.percentage}%`, backgroundColor: color }}></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SPLIT TABLES ROW */}
                                    <div className="dashboard-tables-row">
                                        
                                        {/* Left Table: Top Selling Books */}
                                        <div className="table-panel">
                                            <h4 className="panel-title">Top sách bán chạy nhất</h4>
                                            <div className="table-card">
                                                <div className="table-responsive">
                                                    <table className="table admin-table align-middle w-100">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "60px" }}>Hạng</th>
                                                                <th>Tên sách</th>
                                                                <th className="text-center">Đã bán</th>
                                                                <th className="text-end">Doanh thu</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bestSellers.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan={4} className="text-center text-muted py-4">
                                                                        Không có dữ liệu bán chạy
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                bestSellers.map((item, idx) => (
                                                                    <tr key={item.product.id}>
                                                                        <td className="fw-bold text-center">
                                                                            <span className={`rank-badge rank-${idx + 1}`}>{idx + 1}</span>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                {item.product.image && (
                                                                                    <img src={item.product.image} alt={item.product.title} className="admin-product-thumb" style={{ width: "30px", height: "40px" }} />
                                                                                )}
                                                                                <div>
                                                                                    <div className="fw-bold text-truncate" style={{ maxWidth: "160px" }} title={item.product.title}>
                                                                                        {item.product.title}
                                                                                    </div>
                                                                                    <span className="text-muted" style={{ fontSize: "11px" }}>{item.product.author}</span>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="fw-semibold text-center">{item.quantity} cuốn</td>
                                                                        <td className="text-danger fw-bold text-end">{formatCurrency(item.revenue)}</td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Table: Newest Orders */}
                                        <div className="table-panel">
                                            <h4 className="panel-title">Đơn hàng mới nhất</h4>
                                            <div className="table-card">
                                                <div className="table-responsive">
                                                    <table className="table admin-table align-middle w-100">
                                                        <thead>
                                                            <tr>
                                                                <th>Khách hàng</th>
                                                                <th>Ngày mua</th>
                                                                <th>Tổng tiền</th>
                                                                <th>Trạng thái</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredOrders.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan={4} className="text-center text-muted py-4">
                                                                        Chưa có đơn hàng nào
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                filteredOrders.slice(0, 5).map(o => (
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
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
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
                                                    {paginatedProducts.map(p => (
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
                                    {renderPagination(validPCurrentPage, totalProductPages, setPCurrentPage)}
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
                                                    {paginatedOrders.map(o => (
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
                                    {renderPagination(validOCurrentPage, totalOrderPages, setOCurrentPage)}
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
                                                    {paginatedUsers.map(u => (
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
                                    {renderPagination(validUCurrentPage, totalUserPages, setUCurrentPage)}
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
                                                    {paginatedVouchers.map(v => (
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
                                            {renderPagination(validVCurrentPage, totalVoucherPages, setVCurrentPage)}
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
