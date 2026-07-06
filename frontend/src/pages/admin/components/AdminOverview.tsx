import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { FaChartBar, FaShoppingCart, FaUsers, FaBook } from "react-icons/fa";
import { Category, Order, Product, RevenueTrendPoint, User } from "../../../models";

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
    const token = localStorage.getItem("token");
    const chartScrollRef = useRef<HTMLDivElement | null>(null);
    const chartDragStateRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
    const defaultEndDate = formatDateInput(new Date());
    const defaultStartDate = (() => {
        const date = new Date();
        date.setDate(date.getDate() - 6);
        return formatDateInput(date);
    })();

    const [startDateInput, setStartDateInput] = useState(defaultStartDate);
    const [endDateInput, setEndDateInput] = useState(defaultEndDate);
    const [appliedDateRange, setAppliedDateRange] = useState({
        startDate: defaultStartDate,
        endDate: defaultEndDate
    });
    const [revenueTrend, setRevenueTrend] = useState<RevenueTrendPoint[]>([]);
    const [chartLoading, setChartLoading] = useState(false);
    const [chartMessage, setChartMessage] = useState("");
    const [chartZoom, setChartZoom] = useState(1);
    const [chartIsActive, setChartIsActive] = useState(false);
    const [isChartDragging, setIsChartDragging] = useState(false);

    const updateChartScrollState = () => {
        const element = chartScrollRef.current;
        if (!element) return;
    };

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

        const fetchRevenueTrend = async () => {
            setChartLoading(true);
            setChartMessage("");

            const getLocalRevenueTrend = (startDate: string, endDate: string): RevenueTrendPoint[] => {
                const points: RevenueTrendPoint[] = [];
                const start = parseDateString(startDate);
                const end = parseDateString(endDate);

                for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                    const dateKey = formatDateInput(new Date(date));
                    const dayRevenue = orders
                        .filter(o => o.orderStatus?.id === 4)
                        .filter(o => getOrderDateKey(o.createdAt) === dateKey)
                        .reduce((sum, order) => {
                            if (categoryFilter === "all") {
                                return sum + Number(order.totalAmount || order.total_amount || 0);
                            }

                            const details = order.orderDetails || [];
                            return sum + details
                                .filter((detail: any) => detail.product?.category?.id === Number(categoryFilter))
                                .reduce((detailSum: number, detail: any) =>
                                    detailSum + Number(detail.price || 0) * Number(detail.quantity || 0), 0);
                        }, 0);

                    points.push({
                        date: dateKey,
                        revenue: dayRevenue
                    });
                }

                return points;
            };

            try {
                const params: Record<string, string | number> = {
                    startDate: appliedDateRange.startDate,
                    endDate: appliedDateRange.endDate
                };

                if (categoryFilter !== "all") {
                    params.categoryId = Number(categoryFilter);
                }

                const response = await axios.get("http://localhost:8080/api/orders/revenue-trend", {
                    params,
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
                    setChartMessage("Không lấy được thống kê từ server, biểu đồ đang dùng dữ liệu đơn hàng hiện có.");
                }
            } finally {
                if (!isCancelled) {
                    setChartLoading(false);
                }
            }
        };

        fetchRevenueTrend();

        return () => {
            isCancelled = true;
        };
    }, [appliedDateRange, categoryFilter, orders, token]);

    useEffect(() => {
        updateChartScrollState();

        const handleResize = () => updateChartScrollState();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [revenueTrend, chartLoading]);

    useEffect(() => {
        const stopChartDrag = () => {
            chartDragStateRef.current.isDragging = false;
            setIsChartDragging(false);
        };

        window.addEventListener("mouseup", stopChartDrag);

        return () => {
            window.removeEventListener("mouseup", stopChartDrag);
        };
    }, []);

    useEffect(() => {
        const element = chartScrollRef.current;
        if (!element) return;

        const handleNativeWheel = (event: WheelEvent) => {
            if (!chartIsActive || revenueTrend.length === 0) return;

            event.preventDefault();
            event.stopPropagation();

            const currentZoom = chartZoom;
            const zoomStep = event.deltaY < 0 ? 0.2 : -0.2;
            const nextZoom = Math.min(3, Math.max(1, Number((currentZoom + zoomStep).toFixed(2))));

            if (nextZoom === currentZoom) return;

            const rect = element.getBoundingClientRect();
            const pointerOffsetX = event.clientX - rect.left;
            const scrollAnchor = element.scrollLeft + pointerOffsetX;
            const zoomRatio = nextZoom / currentZoom;

            setChartZoom(nextZoom);

            requestAnimationFrame(() => {
                element.scrollLeft = Math.max(0, scrollAnchor * zoomRatio - pointerOffsetX);
                updateChartScrollState();
            });
        };

        element.addEventListener("wheel", handleNativeWheel, { passive: false });

        return () => {
            element.removeEventListener("wheel", handleNativeWheel);
        };
    }, [chartIsActive, revenueTrend.length, chartZoom]);

    const handleApplyDateRange = () => {
        if (!startDateInput || !endDateInput) {
            setChartMessage("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc.");
            return;
        }

        if (startDateInput > endDateInput) {
            setChartMessage("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
            return;
        }

        setChartMessage("");
        setAppliedDateRange({
            startDate: startDateInput,
            endDate: endDateInput
        });
    };

    const handleChartMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        const element = chartScrollRef.current;
        if (!element || chartPoints.length === 0) return;

        chartDragStateRef.current = {
            isDragging: true,
            startX: event.clientX,
            scrollLeft: element.scrollLeft
        };

        setChartIsActive(true);
        setIsChartDragging(true);
        element.focus();
    };

    const handleChartMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const element = chartScrollRef.current;
        if (!element || !chartDragStateRef.current.isDragging) return;

        event.preventDefault();
        const deltaX = event.clientX - chartDragStateRef.current.startX;
        element.scrollLeft = chartDragStateRef.current.scrollLeft - deltaX;
        updateChartScrollState();
    };

    const handleChartMouseUp = () => {
        chartDragStateRef.current.isDragging = false;
        setIsChartDragging(false);
    };

    const statsRevenue = filteredOrders
        .filter(o => o.orderStatus && o.orderStatus.id === 4)
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
        .filter(o => o.orderStatus && o.orderStatus.id === 4)
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

    const categoryShare = useMemo(() => {
        const shareMap: Record<number, { categoryName: string; quantity: number; revenue: number }> = {};

        filteredOrders
            .filter(o => o.orderStatus?.id === 4)
            .forEach(o => {
                const details = o.orderDetails || [];
                details.forEach((detail: any) => {
                    if (!detail.product?.category) return;

                    const category = detail.product.category;
                    if (!shareMap[category.id]) {
                        shareMap[category.id] = {
                            categoryName: category.name,
                            quantity: 0,
                            revenue: 0
                        };
                    }

                    shareMap[category.id].quantity += Number(detail.quantity || 0);
                    shareMap[category.id].revenue += Number(detail.price || 0) * Number(detail.quantity || 0);
                });
            });

        const sorted = Object.values(shareMap).sort((a, b) => b.revenue - a.revenue);
        const totalShareRevenue = sorted.reduce((sum, item) => sum + item.revenue, 0);

        return sorted
            .map(item => ({
                ...item,
                percentage: totalShareRevenue > 0 ? Math.round((item.revenue / totalShareRevenue) * 100) : 0
            }))
            .slice(0, 5);
    }, [filteredOrders]);

    const chartLogicalWidth = Math.max(980, revenueTrend.length * 140);
    const chartLogicalHeight = 230;
    const chartRenderedWidth = Math.round(chartLogicalWidth * chartZoom);
    const chartRenderedHeight = Math.round(chartLogicalHeight * chartZoom);
    const chartBaseline = 175;
    const chartStartX = 50;
    const chartEndX = chartLogicalWidth - 40;
    const chartStep = revenueTrend.length > 1 ? (chartEndX - chartStartX) / (revenueTrend.length - 1) : 0;
    const maxRevenue = Math.max(...revenueTrend.map(point => Number(point.revenue || 0)), 100000);
    const chartPoints = revenueTrend.map((point, index) => {
        const value = Number(point.revenue || 0);
        const x = revenueTrend.length > 1 ? chartStartX + chartStep * index : chartLogicalWidth / 2;
        const y = chartBaseline - (value / maxRevenue) * 120;

        return {
            x,
            y,
            value,
            label: formatChartLabel(point.date),
            date: point.date
        };
    });

    const linePath = chartPoints
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ");
    const areaPath = chartPoints.length > 0
        ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${chartBaseline} L ${chartPoints[0].x} ${chartBaseline} Z`
        : "";

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
                            <h4 className="chart-title">Xu hướng doanh thu theo ngày</h4>
                            <p className="chart-subtitle">
                                Chọn khoảng thời gian từ ngày này đến ngày kia để xem biểu đồ doanh thu.
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
                                disabled={chartLoading}
                            >
                                {chartLoading ? "Đang tải..." : "Hiển thị biểu đồ"}
                            </button>
                        </div>
                    </div>

                    <div className="chart-range-caption">
                        Khoảng đang xem: <strong>{formatChartLabel(appliedDateRange.startDate)}</strong> đến{" "}
                        <strong>{formatChartLabel(appliedDateRange.endDate)}</strong> • Zoom: <strong>{Math.round(chartZoom * 100)}%</strong>
                    </div>

                    {chartMessage && <div className="chart-message">{chartMessage}</div>}

                    <div className="chart-scroll-shell">
                        <div
                            ref={chartScrollRef}
                            className={`chart-container chart-scroll-container ${chartIsActive ? "active" : ""} ${isChartDragging ? "dragging" : ""}`}
                            onScroll={updateChartScrollState}
                            onClick={() => {
                                setChartIsActive(true);
                                chartScrollRef.current?.focus();
                            }}
                            onMouseDown={handleChartMouseDown}
                            onMouseMove={handleChartMouseMove}
                            onMouseUp={handleChartMouseUp}
                            onMouseLeave={handleChartMouseUp}
                            onBlur={() => setChartIsActive(false)}
                            tabIndex={0}
                            role="application"
                            aria-label="Biểu đồ doanh thu, click để kích hoạt phóng to bằng lăn chuột"
                        >
                        {chartLoading ? (
                            <div className="chart-empty-state">Đang tải dữ liệu biểu đồ...</div>
                        ) : chartPoints.length === 0 ? (
                            <div className="chart-empty-state">Không có dữ liệu doanh thu trong khoảng thời gian này.</div>
                        ) : (
                            <div
                                className="chart-canvas"
                                style={{
                                    width: `${chartRenderedWidth}px`,
                                    height: `${chartRenderedHeight}px`
                                }}
                            >
                                <svg
                                    width={chartRenderedWidth}
                                    height={chartRenderedHeight}
                                    viewBox={`0 0 ${chartLogicalWidth} ${chartLogicalHeight}`}
                                    preserveAspectRatio="xMinYMin meet"
                                >
                                    <defs>
                                        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                                        </linearGradient>
                                    </defs>

                                    <line x1="40" y1="55" x2={chartLogicalWidth - 30} y2="55" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                                    <line x1="40" y1="115" x2={chartLogicalWidth - 30} y2="115" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                                    <line x1="40" y1={chartBaseline} x2={chartLogicalWidth - 30} y2={chartBaseline} stroke="#e2e8f0" strokeWidth="1.5" />

                                    {areaPath && <path d={areaPath} fill="url(#chart-grad)" />}
                                    {linePath && (
                                        <path
                                            d={linePath}
                                            fill="none"
                                            stroke="#2563eb"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    )}

                                    {chartPoints.map((point, index) => (
                                        <g key={`${point.date}-${index}`} className="chart-dot-group">
                                            <circle cx={point.x} cy={point.y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                                            <text x={point.x} y={point.y - 14} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a" className="chart-tooltip">
                                                {point.value > 0 ? formatCompactRevenue(point.value) : ""}
                                            </text>
                                            <text x={point.x} y={chartBaseline + 20} textAnchor="middle" fontSize="10" fontWeight="600" fill="#94a3b8">
                                                {point.label}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
                            </div>
                        )}
                        </div>
                    </div>

                    <div className="chart-zoom-hint">
                        Giữ nguyên kích thước biểu đồ, kéo ngang bằng chuột để xem thêm dữ liệu. Click vào biểu đồ rồi lăn chuột để phóng to.
                    </div>
                </div>

                <div className="chart-panel">
                    <h4 className="chart-title">Cơ cấu doanh thu danh mục</h4>
                    <div className="category-share-list">
                        {categoryShare.length === 0 ? (
                            <div className="text-center text-muted py-5" style={{ fontSize: "14px" }}>
                                Không có dữ liệu danh mục trong thời gian này
                            </div>
                        ) : (
                            categoryShare.map((category, index) => {
                                const colors = ["#3b82f6", "#10b981", "#f59e0b", "#7c3aed", "#ec4899"];
                                const color = colors[index % colors.length];

                                return (
                                    <div key={`${category.categoryName}-${index}`} className="category-share-item">
                                        <div className="cs-info d-flex justify-content-between mb-1">
                                            <span className="cs-name">{category.categoryName}</span>
                                            <span className="cs-val fw-bold">
                                                {formatCurrency(category.revenue)} ({category.percentage}%)
                                            </span>
                                        </div>
                                        <div className="cs-bar-wrap">
                                            <div className="cs-bar" style={{ width: `${category.percentage}%`, backgroundColor: color }}></div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
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
