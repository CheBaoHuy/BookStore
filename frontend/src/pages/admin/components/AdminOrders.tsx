import React, { useState } from "react";
import { Order } from "../../../models";
import { AdminPagination } from "./AdminPagination";
import { 
    FaMapMarkerAlt, 
    FaMoneyBillWave, 
    FaCalendarAlt, 
    FaUser, 
    FaPhoneAlt, 
    FaEnvelope, 
    FaBook, 
    FaTimes,
    FaBoxOpen,
    FaRegFileAlt,
    FaEye
} from "react-icons/fa";

interface AdminOrdersProps {
    orders: Order[];
    onUpdateOrderStatus: (orderId: number, statusId: number) => Promise<void>;
    onUpdatePaymentStatus: (orderId: number, paid: boolean) => Promise<void>;
    formatCurrency: (val: number | undefined | null) => string;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
    orders,
    onUpdateOrderStatus,
    onUpdatePaymentStatus,
    formatCurrency
}) => {
    const [oCurrentPage, setOCurrentPage] = useState<number>(1);
    const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
    const ORDERS_PER_PAGE = 8;

    const totalOrderPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
    const validOCurrentPage = Math.min(oCurrentPage, Math.max(1, totalOrderPages));
    const paginatedOrders = orders.slice((validOCurrentPage - 1) * ORDERS_PER_PAGE, validOCurrentPage * ORDERS_PER_PAGE);

    return (
        <div className="admin-tab-content">
            <style>{`
                /* Premium Detail Modal Styles */
                .premium-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1100;
                    padding: 20px;
                    animation: premiumFadeIn 0.3s ease-out;
                }

                .premium-modal-container {
                    background: #ffffff;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 950px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    overflow: hidden;
                    animation: premiumSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                }

                .premium-modal-header {
                    background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
                    color: #ffffff;
                    padding: 24px 32px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .premium-modal-header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .premium-modal-icon-wrapper {
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 12px;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }

                .premium-modal-title {
                    font-size: 18px;
                    font-weight: 800;
                    margin: 0;
                    line-height: 1.2;
                }

                .premium-modal-subtitle {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.8);
                    margin: 4px 0 0 0;
                }

                .premium-modal-close-btn {
                    background: rgba(255, 255, 255, 0.15);
                    border: none;
                    color: #ffffff;
                    width: 36px;
                    height: 36px;
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    font-size: 16px;
                    position: relative;
                    z-index: 10;
                }

                .premium-modal-close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }

                .premium-order-details-grid {
                    display: flex;
                    gap: 24px;
                    padding: 32px;
                    max-height: 72vh;
                    overflow-y: auto;
                    background: #ffffff;
                }

                @media (max-width: 768px) {
                    .premium-order-details-grid {
                        flex-direction: column;
                        padding: 20px;
                    }
                    .premium-order-details-left {
                        width: 100% !important;
                    }
                }

                .premium-order-details-left {
                    width: 350px;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .premium-order-details-left .premium-card-info {
                    flex: 1;
                    height: auto !important;
                }

                .premium-order-details-right {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    min-width: 0;
                }

                .premium-card-info {
                    background: #f8fafc;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    padding: 20px;
                    height: 100%;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .premium-card-info:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
                }

                .premium-card-title {
                    font-size: 14px;
                    font-weight: 800;
                    color: #1e293b;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border-bottom: 1px dashed #cbd5e1;
                    padding-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .premium-info-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-size: 13.5px;
                }

                .premium-info-item:last-child {
                    margin-bottom: 0;
                }

                .premium-info-label {
                    color: #64748b;
                    font-weight: 500;
                }

                .premium-info-value {
                    color: #0f172a;
                    font-weight: 600;
                    text-align: right;
                    max-width: 65%;
                }

                .premium-table-container {
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    overflow-y: auto;
                    max-height: 270px;
                    background: #ffffff;
                }

                .premium-table {
                    margin-bottom: 0;
                    width: 100%;
                    border-collapse: collapse;
                }

                .premium-table th {
                    background: #f1f5f9;
                    color: #475569;
                    font-weight: 700;
                    font-size: 12.5px;
                    text-transform: uppercase;
                    padding: 14px 18px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .premium-table td {
                    padding: 16px 18px;
                    border-bottom: 1px solid #f1f5f9;
                    font-size: 13.5px;
                }

                .premium-book-info {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .premium-book-img {
                    width: 40px;
                    height: 58px;
                    object-fit: cover;
                    border-radius: 6px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease;
                }

                .premium-book-img:hover {
                    transform: scale(1.1);
                }

                .premium-book-title {
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 4px;
                    line-height: 1.3;
                }

                .premium-book-author {
                    font-size: 11.5px;
                    color: #64748b;
                }

                .premium-summary-wrapper {
                    display: flex !important;
                    justify-content: flex-end !important;
                    margin-top: 24px;
                    width: 100%;
                }

                .premium-summary-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 20px 24px;
                    width: 340px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

                .premium-summary-row {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-bottom: 10px;
                    font-size: 13.5px;
                }

                .premium-summary-label {
                    color: #64748b;
                    font-weight: 500;
                }

                .premium-summary-val {
                    color: #0f172a;
                    font-weight: 600;
                }

                .premium-summary-total {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid #cbd5e1;
                    font-size: 16px;
                    font-weight: 800;
                    color: #e11d48;
                }

                .premium-modal-footer {
                    background: #f8fafc;
                    padding: 20px 32px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: flex-end;
                }

                .btn-premium-close {
                    background: #0f172a;
                    color: #ffffff;
                    border: none;
                    padding: 10px 28px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 700;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }

                .btn-premium-close:hover {
                    background: #1e293b;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.15);
                }

                @keyframes premiumFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes premiumSlideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Premium Action Elements in Orders Table */
                .premium-select {
                    display: block;
                    width: 155px;
                    padding: 6px 30px 6px 12px;
                    font-size: 13px;
                    font-weight: 600;
                    line-height: 1.5;
                    color: #1e293b;
                    background-color: #ffffff;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 10px center;
                    background-size: 12px 10px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    appearance: none;
                    cursor: pointer;
                }

                .premium-select:focus {
                    border-color: #3b82f6;
                    outline: 0;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
                }

                .premium-select:disabled {
                    background-color: #f1f5f9;
                    color: #94a3b8;
                    cursor: not-allowed;
                    border-color: #e2e8f0;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
                }
                
                .premium-select.status-select-1 { border-color: #fed7aa; color: #ea580c; background-color: #fff7ed; }
                .premium-select.status-select-2 { border-color: #bfdbfe; color: #2563eb; background-color: #eff6ff; }
                .premium-select.status-select-3 { border-color: #e9d5ff; color: #9333ea; background-color: #faf5ff; }
                .premium-select.status-select-4 { border-color: #bbf7d0; color: #16a34a; background-color: #f0fdf4; }
                .premium-select.status-select-5 { border-color: #fecaca; color: #dc2626; background-color: #fef2f2; }

                .premium-btn-detail {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 6px 14px;
                    font-size: 12.5px;
                    font-weight: 600;
                    color: #3b82f6;
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .premium-btn-detail:hover {
                    color: #ffffff;
                    background: #3b82f6;
                    border-color: #3b82f6;
                    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
                    transform: translateY(-1px);
                }

                .premium-btn-detail:active {
                    transform: translateY(0);
                }
            `}</style>

            <h2 className="tab-title">Quản lý Đơn hàng</h2>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table admin-table align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Khách hàng</th>
                                <th>Tổng thanh toán</th>
                                <th>Trạng thái hiện tại</th>
                                <th>Chuyển trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.map(o => (
                                <tr key={o.id}>
                                    <td className="fw-bold cursor-pointer text-primary" onClick={() => setSelectedOrderForDetails(o)} title="Bấm để xem chi tiết">
                                        #{o.id}
                                    </td>
                                    <td>
                                        <div className="fw-bold">{o.fullName}</div>
                                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(o.createdAt).toLocaleString("vi-VN")}</div>
                                    </td>
                                    <td>
                                        <div className="text-danger fw-bold">{formatCurrency(o.totalAmount)}</div>
                                        <div className="d-flex align-items-center gap-1 mt-1">
                                            <span className="badge bg-light text-dark border" style={{ fontSize: "11px" }}>
                                                {o.paymentMethod}
                                            </span>
                                            <span 
                                                className={`badge cursor-pointer ${o.paymentStatus ? "bg-success" : "bg-warning text-dark"}`}
                                                style={{ fontSize: "11px", cursor: "pointer" }}
                                                onClick={() => onUpdatePaymentStatus(o.id, !o.paymentStatus)}
                                                title="Nhấn để đổi trạng thái thanh toán"
                                            >
                                                {o.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${o.orderStatus.id}`}>
                                            {o.orderStatus.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className={`premium-select status-select-${o.orderStatus.id}`}
                                            value={o.orderStatus.id}
                                            disabled={o.orderStatus.id === 4 || o.orderStatus.id === 5}
                                            onChange={(e) => onUpdateOrderStatus(o.id, Number(e.target.value))}
                                        >
                                            <option value={1} disabled={1 < o.orderStatus.id}>Chờ xác nhận</option>
                                            <option value={2} disabled={2 < o.orderStatus.id}>Đã xác nhận</option>
                                            <option value={3} disabled={3 < o.orderStatus.id}>Đang giao hàng</option>
                                            <option value={4} disabled={4 < o.orderStatus.id}>Đã giao hàng</option>
                                            <option value={5} disabled={5 < o.orderStatus.id}>Đã hủy</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button 
                                            className="premium-btn-detail"
                                            onClick={() => setSelectedOrderForDetails(o)}
                                        >
                                            <FaEye /> Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AdminPagination
                currentPage={validOCurrentPage}
                totalPages={totalOrderPages}
                onPageChange={setOCurrentPage}
            />

            {/* MODAL CHI TIẾT ĐƠN HÀNG PREMIUM */}
            {selectedOrderForDetails && (
                <div className="premium-modal-overlay" onClick={() => setSelectedOrderForDetails(null)}>
                    <div className="premium-modal-container" onClick={(e) => e.stopPropagation()}>
                        {/* HEADER */}
                        <div className="premium-modal-header">
                            <div className="premium-modal-header-left">
                                <div className="premium-modal-icon-wrapper">
                                    <FaBoxOpen />
                                </div>
                                <div>
                                    <h3 className="premium-modal-title">Chi tiết Đơn hàng #{selectedOrderForDetails.id}</h3>
                                    <p className="premium-modal-subtitle">
                                        <FaCalendarAlt /> Ngày đặt: {new Date(selectedOrderForDetails.createdAt).toLocaleString("vi-VN")}
                                    </p>
                                </div>
                            </div>
                            <button className="premium-modal-close-btn" onClick={() => setSelectedOrderForDetails(null)}>
                                <FaTimes />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="premium-order-details-grid">
                            {/* LEFT COLUMN: Customer & Payment Details */}
                            <div className="premium-order-details-left">
                                {/* Khách hàng & Giao hàng */}
                                <div className="premium-card-info">
                                    <div className="premium-card-title">
                                        <FaMapMarkerAlt /> Thông tin nhận hàng
                                    </div>
                                    <div className="premium-info-item">
                                        <span className="premium-info-label"><FaUser /> Người nhận:</span>
                                        <span className="premium-info-value">{selectedOrderForDetails.fullName}</span>
                                    </div>
                                    <div className="premium-info-item">
                                        <span className="premium-info-label"><FaPhoneAlt /> Số điện thoại:</span>
                                        <span className="premium-info-value">{selectedOrderForDetails.phone}</span>
                                    </div>
                                    <div className="premium-info-item">
                                        <span className="premium-info-label"><FaEnvelope /> Email:</span>
                                        <span className="premium-info-value" style={{ wordBreak: "break-all" }}>{selectedOrderForDetails.email}</span>
                                    </div>
                                    <div className="premium-info-item">
                                        <span className="premium-info-label">📍 Địa chỉ:</span>
                                        <span className="premium-info-value">{selectedOrderForDetails.address}</span>
                                    </div>
                                    {selectedOrderForDetails.note && (
                                        <div className="premium-info-item" style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "8px", marginTop: "8px" }}>
                                            <span className="premium-info-label">📝 Ghi chú:</span>
                                            <span className="premium-info-value text-muted" style={{ fontStyle: "italic" }}>{selectedOrderForDetails.note}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Thanh toán & Trạng thái */}
                                <div className="premium-card-info">
                                    <div className="premium-card-title">
                                        <FaMoneyBillWave /> Thanh toán & Trạng thái
                                    </div>
                                    <div className="premium-info-item">
                                        <span className="premium-info-label">Phương thức:</span>
                                        <span className="premium-info-value font-monospace">{selectedOrderForDetails.paymentMethod || "N/A"}</span>
                                    </div>
                                    <div className="premium-info-item">
                                        <span className="premium-info-label">Trạng thái thanh toán:</span>
                                        <span className={`premium-info-value badge ${selectedOrderForDetails.paymentStatus ? "bg-success" : "bg-warning text-dark"}`}>
                                            {selectedOrderForDetails.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                                        </span>
                                    </div>
                                    <div className="premium-info-item">
                                        <span className="premium-info-label">Trạng thái đơn hàng:</span>
                                        <span className="premium-info-value">
                                            <span className={`status-badge status-${selectedOrderForDetails.orderStatus.id}`}>
                                                {selectedOrderForDetails.orderStatus.status}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Products Table & Totals Summary */}
                            <div className="premium-order-details-right">
                                {/* Danh sách sản phẩm */}
                                <div className="premium-table-container m-0">
                                    <table className="premium-table">
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm / Cuốn sách</th>
                                                <th className="text-center" style={{ width: "50px" }}>SL</th>
                                                <th className="text-end" style={{ width: "95px" }}>Đơn giá</th>
                                                <th className="text-end" style={{ width: "105px" }}>Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrderForDetails.orderDetails && selectedOrderForDetails.orderDetails.length > 0 ? (
                                                selectedOrderForDetails.orderDetails.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <div className="premium-book-info">
                                                                <img 
                                                                    src={item.product?.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"} 
                                                                    alt={item.product?.title} 
                                                                    className="premium-book-img"
                                                                />
                                                                <div>
                                                                    <div className="premium-book-title" style={{ fontSize: "13px" }}>{item.product?.title}</div>
                                                                    <div className="premium-book-author">{item.product?.author || "Chưa cập nhật"}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center fw-bold">{item.quantity}</td>
                                                        <td className="text-end fw-semibold text-dark">{formatCurrency(item.price)}</td>
                                                        <td className="text-end fw-bold text-primary">{formatCurrency(item.price * item.quantity)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-4 text-muted">
                                                        Không có thông tin chi tiết các sản phẩm trong đơn hàng.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Tóm tắt thanh toán */}
                                <div className="premium-summary-wrapper m-0">
                                    <div className="premium-summary-card">
                                        <div className="premium-summary-row">
                                            <span className="premium-summary-label">Tổng tiền hàng:</span>
                                            <span className="premium-summary-val">
                                                {formatCurrency((selectedOrderForDetails.totalAmount || 0) - (selectedOrderForDetails.shippingCost || 0))}
                                            </span>
                                        </div>
                                        <div className="premium-summary-row">
                                            <span className="premium-summary-label">Phí vận chuyển:</span>
                                            <span className="premium-summary-val">
                                                {formatCurrency(selectedOrderForDetails.shippingCost || 0)}
                                            </span>
                                        </div>
                                        <div className="premium-summary-total">
                                            <span>TỔNG CỘNG:</span>
                                            <span>{formatCurrency(selectedOrderForDetails.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="premium-modal-footer">
                            <button className="btn-premium-close" onClick={() => setSelectedOrderForDetails(null)}>
                                Đóng hộp thoại
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
