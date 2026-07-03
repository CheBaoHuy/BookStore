import React from "react";
import { FaChartBar, FaShoppingCart, FaUsers, FaBook } from "react-icons/fa";
import { Product, Order, User, Category } from "../../../models";

interface AdminOverviewProps {
    products: Product[];
    orders: Order[];
    users: User[];
    categories: Category[];
    timeFilter: "all" | "today" | "7days" | "30days" | "month";
    setTimeFilter: (val: "all" | "today" | "7days" | "30days" | "month") => void;
    categoryFilter: string;
    setCategoryFilter: (val: string) => void;
    formatCurrency: (val: number | undefined | null) => string;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
    products,
    orders,
    users,
    categories,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter,
    formatCurrency
}) => {
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

    return (
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
    );
};
