import React, { useState } from "react";
import { Order } from "../../../models";
import { AdminPagination } from "./AdminPagination";

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
    const ORDERS_PER_PAGE = 8;

    const totalOrderPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
    const validOCurrentPage = Math.min(oCurrentPage, Math.max(1, totalOrderPages));
    const paginatedOrders = orders.slice((validOCurrentPage - 1) * ORDERS_PER_PAGE, validOCurrentPage * ORDERS_PER_PAGE);

    return (
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
                                            className="form-select form-select-sm border-secondary-subtle"
                                            style={{ width: "160px", fontSize: "13px", fontWeight: "600" }}
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
        </div>
    );
};
