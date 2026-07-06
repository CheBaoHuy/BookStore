import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaBook, FaChartBar, FaShoppingCart, FaUsers } from "react-icons/fa";
import { Category, Order, Product, RevenueCategoryShare, RevenueTrendPoint, User } from "../../../models";

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

const padDatePart = (value: number) => String(value).padStart(2, "0");

const formatDateInput = (date: Date) =>
    `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;

const formatMonthInput = (date: Date) =>
    `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}`;

const parseDateString = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const getOrderDateKey = (createdAt: string) => {
    const date = new Date(createdAt);
    return formatDateInput(date);
};

const formatChartLabel = (date: string) => {
    const parsedDate = parseDateString(date);
    return `${padDatePart(parsedDate.getDate())}/${padDatePart(parsedDate.getMonth() + 1)}`;
};

const getMonthRange = (monthValue: string) => {
    const [year, month] = monthValue.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    return {
        startDate: formatDateInput(start),
        endDate: formatDateInput(end)
    };
};

const formatCompactRevenue = (value: number) => {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
    }
    if (value >= 1_000) {
        return `${Math.round(value / 1_000)}K`;
    }
    return `${Math.round(value)}`;
};

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
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const defaultEndDate = formatDateInput(new Date());
    const defaultStartDate = (() => {
        const date = new Date();
        date.setDate(date.getDate() - 6);
        return formatDateInput(date);
    })();
    const defaultMonth = formatMonthInput(new Date());

    const [startDateInput, setStartDateInput] = useState(defaultStartDate);
    const [endDateInput, setEndDateInput] = useState(defaultEndDate);
    const [appliedDateRange, setAppliedDateRange] = useState({
        startDate: defaultStartDate,
        endDate: defaultEndDate
    });
    const [monthlyInput, setMonthlyInput] = useState(defaultMonth);
    const [appliedMonth, setAppliedMonth] = useState(defaultMonth);
    const [revenueTrend, setRevenueTrend] = useState<RevenueTrendPoint[]>([]);
    const [categoryRevenueShare, setCategoryRevenueShare] = useState<RevenueCategoryShare[]>([]);
    const [barChartLoading, setBarChartLoading] = useState(false);
    const [pieChartLoading, setPieChartLoading] = useState(false);
    const [barChartMessage, setBarChartMessage] = useState("");
    const [pieChartMessage, setPieChartMessage] = useState("");

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            if (timeFilter === "today") {
                const todayStr = formatDateInput(new Date());
                if (getOrderDateKey(o.createdAt) !== todayStr) return false;
            } else if (timeFilter === "7days") {
                const limitDate = new Date();
                limitDate.setHours(0, 0, 0, 0);
                limitDate.setDate(limitDate.getDate() - 7);
                if (new Date(o.createdAt) < limitDate) return false;
            } else if (timeFilter === "30days") {
                const limitDate = new Date();
                limitDate.setHours(0, 0, 0, 0);
                limitDate.setDate(limitDate.getDate() - 30);
                if (new Date(o.createdAt) < limitDate) return false;
            } else if (timeFilter === "month") {
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                const orderDate = new Date(o.createdAt);
                if (orderDate.getMonth() !== currentMonth || orderDate.getFullYear() !== currentYear) return false;
            }

            if (categoryFilter !== "all") {
                const details = o.orderDetails || [];
                const hasCategoryProduct = details.some((detail: any) =>
                    detail.product?.category?.id === Number(categoryFilter)
                );
                if (!hasCategoryProduct) return false;
            }

            return true;
        });
    }, [orders, timeFilter, categoryFilter]);

    useEffect(() => {
        let isCancelled = false;

        const getLocalRevenueTrend = (startDate: string, endDate: string): RevenueTrendPoint[] => {
            const points: RevenueTrendPoint[] = [];
            const start = parseDateString(startDate);
            const end = parseDateString(endDate);

            for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                const dateKey = formatDateInput(new Date(date));
                const dayRevenue = orders
                    .filter(order => order.orderStatus?.id === 4)
                    .filter(order => getOrderDateKey(order.createdAt) === dateKey)
                    .reduce((sum, order) => sum + Number(order.totalAmount || order.total_amount || 0), 0);

                points.push({
                    date: dateKey,
                    revenue: dayRevenue
                });
            }

            return points;
        };

        const fetchRevenueTrend = async () => {
            setBarChartLoading(true);
            setBarChartMessage("");

            try {
                const response = await axios.get("http://localhost:8080/api/orders/revenue-trend", {
                    params: {
                        startDate: appliedDateRange.startDate,
                        endDate: appliedDateRange.endDate
                    },
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined
                });

                if (!isCancelled) {
                    setRevenueTrend((response.data || []).map((item: RevenueTrendPoint) => ({
                        date: item.date,
                        revenue: Number(item.revenue || 0)
                    })));
                }
            } catch {
                if (!isCancelled) {
                    setRevenueTrend(getLocalRevenueTrend(appliedDateRange.startDate, appliedDateRange.endDate));
                    setBarChartMessage("Không lấy được biểu đồ cột từ server, hệ thống đang dùng dữ liệu đơn hàng hiện có.");
                }
            } finally {
                if (!isCancelled) {
                    setBarChartLoading(false);
                }
            }
        };

        fetchRevenueTrend();

        return () => {
            isCancelled = true;
        };
    }, [appliedDateRange, orders, token]);

    useEffect(() => {
        let isCancelled = false;

        const getLocalCategoryShare = (monthValue: string): RevenueCategoryShare[] => {
            const { startDate, endDate } = getMonthRange(monthValue);
            const start = parseDateString(startDate);
            const end = parseDateString(endDate);
            const endOfDay = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
            const categoryMap: Record<number, RevenueCategoryShare> = {};

            orders
                .filter(order => order.orderStatus?.id === 4)
                .filter(order => {
                    const orderDate = new Date(order.createdAt);
                    return orderDate >= start && orderDate <= endOfDay;
                })
                .forEach(order => {
                    const details = Array.isArray(order.orderDetails) ? order.orderDetails : [];
                    details.forEach((detail: any) => {
                        const category = detail.product?.category;
                        if (!category?.id) return;

                        if (!categoryMap[category.id]) {
                            categoryMap[category.id] = {
                                categoryId: category.id,
                                categoryName: category.name,
                                revenue: 0
                            };
                        }

                        categoryMap[category.id].revenue += Number(detail.price || 0) * Number(detail.quantity || 0);
                    });
                });

            return Object.values(categoryMap).sort((a, b) => b.revenue - a.revenue);
        };

        const fetchRevenueCategoryShare = async () => {
            setPieChartLoading(true);
            setPieChartMessage("");

            try {
                const response = await axios.get("http://localhost:8080/api/orders/revenue-category-share", {
                    params: {
                        month: appliedMonth
                    },
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined
                });

                if (!isCancelled) {
                    setCategoryRevenueShare((response.data || []).map((item: RevenueCategoryShare) => ({
                        categoryId: Number(item.categoryId),
                        categoryName: item.categoryName,
                        revenue: Number(item.revenue || 0)
                    })));
                }
            } catch {
                if (!isCancelled) {
                    setCategoryRevenueShare(getLocalCategoryShare(appliedMonth));
                    setPieChartMessage("Không lấy được biểu đồ tròn từ server, hệ thống đang dùng dữ liệu đơn hàng hiện có.");
                }
            } finally {
                if (!isCancelled) {
                    setPieChartLoading(false);
                }
            }
        };

        fetchRevenueCategoryShare();

        return () => {
            isCancelled = true;
        };
    }, [appliedMonth, orders, token]);

    const handleApplyDateRange = () => {
        if (!startDateInput || !endDateInput) {
            setBarChartMessage("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc.");
            return;
        }

        if (startDateInput > endDateInput) {
            setBarChartMessage("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
            return;
        }

        setBarChartMessage("");
        setAppliedDateRange({
            startDate: startDateInput,
            endDate: endDateInput
        });
    };

    const handleApplyMonth = () => {
        if (!monthlyInput) {
            setPieChartMessage("Vui lòng chọn tháng cần thống kê.");
            return;
        }

        setPieChartMessage("");
        setAppliedMonth(monthlyInput);
    };

    const statsRevenue = filteredOrders
        .filter(o => o.orderStatus?.id === 4)
        .reduce((sum, o) => {
            if (categoryFilter === "all") {
                return sum + Number(o.totalAmount || o.total_amount || 0);
            }

            const details = o.orderDetails || [];
            const catTotal = details
                .filter((detail: any) => detail.product?.category?.id === Number(categoryFilter))
                .reduce((detailSum: number, detail: any) =>
                    detailSum + Number(detail.price || 0) * Number(detail.quantity || 0), 0);

            return sum + catTotal;
        }, 0);

    const statsOrdersCount = filteredOrders.length;
    const statsUsersCount = new Set(filteredOrders.map(o => o.email)).size || users.length;

    const statsBooksCount = filteredOrders
        .filter(o => o.orderStatus?.id === 4)
        .reduce((set, o) => {
            const details = o.orderDetails || [];
            details.forEach((detail: any) => {
                if (!detail.product) return;

                if (categoryFilter === "all" || detail.product.category?.id === Number(categoryFilter)) {
                    set.add(detail.product.id);
                }
            });
            return set;
        }, new Set<number>()).size || products.length;

    const bestSellers = useMemo(() => {
        const salesMap: Record<number, { product: Product; quantity: number; revenue: number }> = {};

        filteredOrders
            .filter(o => o.orderStatus?.id === 4)
            .forEach(o => {
                const details = o.orderDetails || [];
                details.forEach((detail: any) => {
                    if (!detail.product) return;

                    const isMatchingCategory =
                        categoryFilter === "all" || detail.product.category?.id === Number(categoryFilter);

                    if (!isMatchingCategory) return;

                    if (!salesMap[detail.product.id]) {
                        salesMap[detail.product.id] = {
                            product: detail.product,
                            quantity: 0,
                            revenue: 0
                        };
                    }

                    salesMap[detail.product.id].quantity += Number(detail.quantity || 0);
                    salesMap[detail.product.id].revenue += Number(detail.price || 0) * Number(detail.quantity || 0);
                });
            });

        return Object.values(salesMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
    }, [filteredOrders, categoryFilter]);

    const barChartMaxRevenue = Math.max(...revenueTrend.map(point => Number(point.revenue || 0)), 1);
    const barChartInnerWidth = Math.max(760, revenueTrend.length * 78);

    const pieChartSegments = useMemo(() => {
        const topItems = categoryRevenueShare.slice(0, 5);
        const remainingRevenue = categoryRevenueShare
            .slice(5)
            .reduce((sum, item) => sum + Number(item.revenue || 0), 0);

        const mergedItems = remainingRevenue > 0
            ? [...topItems, { categoryId: 0, categoryName: "Khác", revenue: remainingRevenue }]
            : topItems;

        const total = mergedItems.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
        const colors = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#64748b"];
        let currentAngle = 0;

        return mergedItems.map((item, index) => {
            const percentage = total > 0 ? (Number(item.revenue || 0) / total) * 100 : 0;
            const startAngle = currentAngle;
            currentAngle += percentage * 3.6;

            return {
                ...item,
                percentage,
                color: colors[index % colors.length],
                startAngle,
                endAngle: currentAngle
            };
        });
    }, [categoryRevenueShare]);

    const pieChartBackground = pieChartSegments.length === 0
        ? "#e2e8f0"
        : `conic-gradient(${pieChartSegments
            .map(segment => `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`)
            .join(", ")})`;

    return (
        <div className="admin-tab-content">
            <div className="tab-header-row flex-column flex-sm-row align-items-start align-items-sm-center">
                <h2 className="tab-title mb-2 mb-sm-0">Thống kê hoạt động</h2>

                <div className="stats-filters-row d-flex gap-2">
                    <div className="filter-group">
                        <select
                            className="form-select filter-select"
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value as "all" | "today" | "7days" | "30days" | "month")}
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
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>📁 {category.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

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

            <div className="dashboard-charts-row">
                <div className="chart-panel">
                    <div className="chart-panel-header">
                        <div>
                            <h4 className="chart-title">Biểu đồ cột doanh thu theo ngày</h4>
                            <p className="chart-subtitle">
                                Chọn khoảng ngày để xem doanh thu cửa hàng theo từng ngày.
                            </p>
                        </div>

                        <div className="chart-date-filters">
                            <div className="chart-date-group">
                                <label htmlFor="revenue-start-date">Từ ngày</label>
                                <input
                                    id="revenue-start-date"
                                    type="date"
                                    className="chart-date-input"
                                    value={startDateInput}
                                    onChange={(e) => setStartDateInput(e.target.value)}
                                />
                            </div>

                            <div className="chart-date-group">
                                <label htmlFor="revenue-end-date">Đến ngày</label>
                                <input
                                    id="revenue-end-date"
                                    type="date"
                                    className="chart-date-input"
                                    value={endDateInput}
                                    onChange={(e) => setEndDateInput(e.target.value)}
                                />
                            </div>

                            <button
                                type="button"
                                className="btn-apply-range"
                                onClick={handleApplyDateRange}
                                disabled={barChartLoading}
                            >
                                {barChartLoading ? "Đang tải..." : "Xem biểu đồ cột"}
                            </button>
                        </div>
                    </div>

                    <div className="chart-range-caption">
                        Khoảng đang xem: <strong>{formatChartLabel(appliedDateRange.startDate)}</strong> đến{" "}
                        <strong>{formatChartLabel(appliedDateRange.endDate)}</strong>
                    </div>

                    {barChartMessage && <div className="chart-message">{barChartMessage}</div>}

                    {barChartLoading ? (
                        <div className="chart-empty-state">Đang tải dữ liệu biểu đồ cột...</div>
                    ) : revenueTrend.length === 0 ? (
                        <div className="chart-empty-state">Không có dữ liệu doanh thu trong khoảng thời gian này.</div>
                    ) : (
                        <div className="bar-chart-shell">
                            <div className="bar-chart-scroll">
                                <div className="bar-chart-inner" style={{ width: `${barChartInnerWidth}px` }}>
                                    {revenueTrend.map((point) => {
                                        const revenue = Number(point.revenue || 0);
                                        const heightPercent = Math.max((revenue / barChartMaxRevenue) * 100, revenue > 0 ? 6 : 0);

                                        return (
                                            <div className="bar-chart-column" key={point.date}>
                                                <div className="bar-chart-value" title={formatCurrency(revenue)}>
                                                    {revenue > 0 ? formatCompactRevenue(revenue) : "0"}
                                                </div>
                                                <div className="bar-chart-track">
                                                    <div
                                                        className="bar-chart-bar"
                                                        style={{ height: `${heightPercent}%` }}
                                                        title={`${point.date}: ${formatCurrency(revenue)}`}
                                                    ></div>
                                                </div>
                                                <div className="bar-chart-label">{formatChartLabel(point.date)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="chart-hint">
                        Khi khoảng ngày dài, biểu đồ giữ nguyên kích cỡ cột và cho phép kéo ngang để xem tiếp dữ liệu.
                    </div>
                </div>

                <div className="chart-panel">
                    <div className="chart-panel-header">
                        <div>
                            <h4 className="chart-title">Biểu đồ tròn doanh thu theo danh mục</h4>
                            <p className="chart-subtitle">
                                Chọn một tháng để xem tỷ trọng doanh thu của từng loại danh mục hàng hoá.
                            </p>
                        </div>

                        <div className="chart-date-filters">
                            <div className="chart-date-group">
                                <label htmlFor="revenue-month-input">Tháng</label>
                                <input
                                    id="revenue-month-input"
                                    type="month"
                                    className="chart-date-input"
                                    value={monthlyInput}
                                    onChange={(e) => setMonthlyInput(e.target.value)}
                                />
                            </div>

                            <button
                                type="button"
                                className="btn-apply-range"
                                onClick={handleApplyMonth}
                                disabled={pieChartLoading}
                            >
                                {pieChartLoading ? "Đang tải..." : "Xem biểu đồ tròn"}
                            </button>
                        </div>
                    </div>

                    <div className="chart-range-caption">
                        Tháng đang xem: <strong>{appliedMonth}</strong>
                    </div>

                    {pieChartMessage && <div className="chart-message">{pieChartMessage}</div>}

                    {pieChartLoading ? (
                        <div className="chart-empty-state">Đang tải dữ liệu biểu đồ tròn...</div>
                    ) : pieChartSegments.length === 0 ? (
                        <div className="chart-empty-state">Không có doanh thu danh mục trong tháng đã chọn.</div>
                    ) : (
                        <div className="pie-chart-layout">
                            <div className="pie-chart-visual-wrap">
                                <div className="pie-chart-visual" style={{ background: pieChartBackground }}>
                                    <div className="pie-chart-center">
                                        <span>Tổng doanh thu</span>
                                        <strong>
                                            {formatCurrency(
                                                pieChartSegments.reduce((sum, item) => sum + Number(item.revenue || 0), 0)
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className="pie-chart-legend">
                                {pieChartSegments.map((segment) => (
                                    <div className="pie-legend-item" key={`${segment.categoryId}-${segment.categoryName}`}>
                                        <span className="pie-legend-dot" style={{ backgroundColor: segment.color }}></span>
                                        <div className="pie-legend-text">
                                            <div className="pie-legend-name">{segment.categoryName}</div>
                                            <div className="pie-legend-value">
                                                {formatCurrency(segment.revenue)} ({segment.percentage.toFixed(segment.percentage >= 10 ? 0 : 1)}%)
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="dashboard-tables-row">
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
                                        bestSellers.map((item, index) => (
                                            <tr key={item.product.id}>
                                                <td className="fw-bold text-center">
                                                    <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {item.product.image && (
                                                            <img
                                                                src={item.product.image}
                                                                alt={item.product.title}
                                                                className="admin-product-thumb"
                                                                style={{ width: "30px", height: "40px" }}
                                                            />
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
                                        filteredOrders.slice(0, 5).map(order => (
                                            <tr key={order.id}>
                                                <td className="fw-semibold">{order.fullName}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                                                <td className="text-danger fw-bold">{formatCurrency(Number(order.totalAmount || order.total_amount || 0))}</td>
                                                <td>
                                                    <span className={`status-badge status-${order.orderStatus.id}`}>
                                                        {order.orderStatus.status}
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
