import React, { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";
import { Product, Category } from "../../../models";

interface ProductModalProps {
    isOpen: boolean;
    editingProduct: Product | null;
    categories: Category[];
    onClose: () => void;
    onSaveProduct: (productPayload: any) => Promise<void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    editingProduct,
    categories,
    onClose,
    onSaveProduct
}) => {
    // Form States
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

    useEffect(() => {
        if (isOpen) {
            if (editingProduct) {
                setPTitle(editingProduct.title);
                setPAuthor(editingProduct.author || "");
                setPPublisher(editingProduct.publisher || "");
                setPPublishYear(editingProduct.publishYear || new Date().getFullYear());
                setPCurrentPrice(editingProduct.currentPrice);
                setPOldPrice(editingProduct.oldPrice || "");
                setPQuantity(editingProduct.quantity);
                setPDescription(editingProduct.description || "");
                setPCategoryId(editingProduct.category ? editingProduct.category.id : "");
                setPImage(editingProduct.image || "");
            } else {
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
            }
        }
    }, [editingProduct, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pTitle || !pCurrentPrice || !pCategoryId) {
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

        await onSaveProduct(productPayload);
    };

    return (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
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
                    <button className="premium-btn-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
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
                            <button type="button" className="pf-btn-cancel" onClick={onClose}>
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
    );
};
