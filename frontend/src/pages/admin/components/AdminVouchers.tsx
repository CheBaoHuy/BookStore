import React, { useState } from "react";
import { FaPercentage, FaTrash, FaPlus } from "react-icons/fa";
import { Voucher } from "../types";
import { AdminPagination } from "./AdminPagination";

interface AdminVouchersProps {
    vouchers: Voucher[];
    onAddVoucher: (newVoucher: Voucher) => boolean; // Returns true if added successfully
    onDeleteVoucher: (code: string) => void;
    formatCurrency: (val: number | undefined | null) => string;
}

export const AdminVouchers: React.FC<AdminVouchersProps> = ({
    vouchers,
    onAddVoucher,
    onDeleteVoucher,
    formatCurrency
}) => {
    // Pagination state
    const [vCurrentPage, setVCurrentPage] = useState<number>(1);
    const VOUCHERS_PER_PAGE = 6;

    // Form states
    const [vCode, setVCode] = useState("");
    const [vDiscountType, setVDiscountType] = useState<"percentage" | "fixed">("percentage");
    const [vDiscountValue, setVDiscountValue] = useState(0);
    const [vMinOrderAmount, setVMinOrderAmount] = useState(0);

    const totalVoucherPages = Math.ceil(vouchers.length / VOUCHERS_PER_PAGE);
    const validVCurrentPage = Math.min(vCurrentPage, Math.max(1, totalVoucherPages));
    const paginatedVouchers = vouchers.slice((validVCurrentPage - 1) * VOUCHERS_PER_PAGE, validVCurrentPage * VOUCHERS_PER_PAGE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!vCode || !vDiscountValue) return;

        const newVoucher: Voucher = {
            code: vCode.toUpperCase(),
            discountType: vDiscountType,
            discountValue: Number(vDiscountValue),
            minOrderAmount: Number(vMinOrderAmount),
            active: true
        };

        const success = onAddVoucher(newVoucher);
        if (success) {
            setVCode("");
            setVDiscountValue(0);
            setVMinOrderAmount(0);
        }
    };

    return (
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
                    &nbsp;{vouchers.length} mã đang hoạt động
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
                                            onClick={() => onDeleteVoucher(v.code)}
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
                    <AdminPagination
                        currentPage={validVCurrentPage}
                        totalPages={totalVoucherPages}
                        onPageChange={setVCurrentPage}
                    />
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
                    <form onSubmit={handleSubmit} className="avp-form">
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
                                    <span>Theo phần trạng</span>
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
    );
};
