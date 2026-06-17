import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { clearCart } from "../../redux/reducer/CartReducer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTag, FaTimesCircle, FaTruck, FaLock, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";

interface Voucher {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderAmount: number;
    active: boolean;
}

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, cartTotalAmount } = useSelector((state: RootState) => state.carts);

    // Lấy thông tin user đang đăng nhập
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPay" | "MoMo">("COD");

    // Voucher state
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
    const [voucherMsg, setVoucherMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [discount, setDiscount] = useState(0);

    // Submit state
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // QR Code Modal payment state
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrTimeLeft, setQrTimeLeft] = useState(300); // 5 minutes in seconds
    const [pendingOrderPayload, setPendingOrderPayload] = useState<any>(null);
    const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);
    const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
    const [paymentVerified, setPaymentVerified] = useState(false);

    // Countdown timer for QR payment modal
    useEffect(() => {
        let timer: any;
        if (showQRModal && qrTimeLeft > 0 && !isVerifyingPayment && !paymentVerified) {
            timer = setInterval(() => {
                setQrTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [showQRModal, qrTimeLeft, isVerifyingPayment, paymentVerified]);

    // Pre-fill form from user profile
    useEffect(() => {
        if (user) {
            const parts = (user.fullName || "").split(" ");
            setLastName(parts[parts.length - 1] || "");
            setFirstName(parts.slice(0, -1).join(" ") || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Tính discount
    useEffect(() => {
        if (appliedVoucher) {
            if (appliedVoucher.discountType === "percentage") {
                setDiscount(Math.round(cartTotalAmount * appliedVoucher.discountValue / 100));
            } else {
                setDiscount(appliedVoucher.discountValue);
            }
        } else {
            setDiscount(0);
        }
    }, [appliedVoucher, cartTotalAmount]);

    const finalTotal = Math.max(0, cartTotalAmount - discount);

    // ---- ÁP DỤNG VOUCHER ----
    const handleApplyVoucher = () => {
        setVoucherMsg(null);
        const code = voucherCode.trim().toUpperCase();
        if (!code) {
            setVoucherMsg({ type: "error", text: "Vui lòng nhập mã giảm giá!" });
            return;
        }

        const storedVouchers = localStorage.getItem("bookstore_vouchers");
        const vouchers: Voucher[] = storedVouchers ? JSON.parse(storedVouchers) : [];
        const found = vouchers.find(v => v.code === code && v.active);

        if (!found) {
            setVoucherMsg({ type: "error", text: "Mã giảm giá không hợp lệ hoặc đã hết hạn!" });
            return;
        }
        if (cartTotalAmount < found.minOrderAmount) {
            setVoucherMsg({
                type: "error",
                text: `Đơn hàng tối thiểu ${found.minOrderAmount.toLocaleString("vi-VN")}₫ để áp dụng mã này!`
            });
            return;
        }

        setAppliedVoucher(found);
        setVoucherMsg({
            type: "success",
            text: found.discountType === "percentage"
                ? `Áp dụng thành công! Giảm ${found.discountValue}% đơn hàng.`
                : `Áp dụng thành công! Giảm ${found.discountValue.toLocaleString("vi-VN")}₫.`
        });
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setDiscount(0);
        setVoucherCode("");
        setVoucherMsg(null);
    };

    // ---- ĐẶT HÀNG ----
    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (cartItems.length === 0) {
            setErrorMsg("Giỏ hàng của bạn đang trống!");
            return;
        }
        if (!firstName.trim() || !lastName.trim()) {
            setErrorMsg("Vui lòng nhập đầy đủ họ và tên!");
            return;
        }
        if (!email.trim()) {
            setErrorMsg("Vui lòng nhập địa chỉ email!");
            return;
        }
        if (!phone.trim()) {
            setErrorMsg("Vui lòng nhập số điện thoại!");
            return;
        }
        if (!address.trim()) {
            setErrorMsg("Vui lòng nhập địa chỉ giao hàng!");
            return;
        }

        setLoading(true);

        const orderPayload = {
            fullName: `${firstName} ${lastName}`.trim(),
            email,
            phone,
            address: address + (city ? `, ${city}` : "") + (zipCode ? ` ${zipCode}` : ""),
            note,
            paymentMethod,
            paymentStatus: paymentMethod !== "COD",
            voucherCode: appliedVoucher?.code || null,
            shippingCost: 0,
            totalAmount: finalTotal,
            orderItems: cartItems.map(item => ({
                productId: item.id,
                quantity: item.cartTotal || 1,
                price: item.currentPrice,
            })),
        };

        const tempOrderId = Date.now();

        if (paymentMethod === "VNPay" || paymentMethod === "MoMo") {
            // Hiển thị mã QR thanh toán chuyển khoản trước
            setPendingOrderPayload(orderPayload);
            setPendingOrderId(tempOrderId);
            setQrTimeLeft(300); // Reset timer
            setShowQRModal(true);
            setLoading(false);
            return;
        }

        let orderId: number | null = null;

        // Thử gọi API
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const userId = user ? (user.userId || user.id) : "";
            const res = await axios.post(`http://localhost:8080/api/orders?userId=${userId}`, orderPayload, { headers });
            orderId = res.data?.id || null;
        } catch {
            // Backend offline → lưu vào localStorage để demo
            orderId = tempOrderId;
            const savedOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
            const newOrder = {
                ...orderPayload,
                id: orderId,
                createdAt: new Date().toISOString(),
                orderStatus: { id: 1, status: "Chờ xác nhận" },
            };
            savedOrders.push(newOrder);
            localStorage.setItem("user_orders", JSON.stringify(savedOrders));
        }

        // Xóa cart sau khi đặt
        dispatch(clearCart());
        setLoading(false);

        // Chuyển đến trang thành công
        navigate(`/order-success?orderId=${orderId}&total=${finalTotal}`);
    };

    // ---- HÀNH ĐỘNG MODAL QR ----
    const handleConfirmQRVerify = async () => {
        if (!pendingOrderPayload || !pendingOrderId) return;
        setIsVerifyingPayment(true);

        // Giả lập kiểm tra giao dịch chuyển khoản trong 2 giây
        setTimeout(async () => {
            setIsVerifyingPayment(false);
            setPaymentVerified(true);
            
            let orderId = pendingOrderId;
            
            try {
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const userId = user ? (user.userId || user.id) : "";
                const res = await axios.post(`http://localhost:8080/api/orders?userId=${userId}`, {
                    ...pendingOrderPayload,
                    paymentStatus: true
                }, { headers });
                orderId = res.data?.id || null;
            } catch {
                const savedOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
                const newOrder = {
                    ...pendingOrderPayload,
                    id: orderId,
                    createdAt: new Date().toISOString(),
                    orderStatus: { id: 1, status: "Chờ xác nhận" },
                    paymentStatus: true
                };
                savedOrders.push(newOrder);
                localStorage.setItem("user_orders", JSON.stringify(savedOrders));
            }

            dispatch(clearCart());
            setShowQRModal(false);
            navigate(`/order-success?orderId=${orderId}&total=${finalTotal}`);
        }, 2000);
    };

    const handleCancelQR = () => {
        if (window.confirm("Bạn có chắc chắn muốn hủy giao dịch thanh toán này? Đơn hàng sẽ không được lưu.")) {
            setShowQRModal(false);
            setPendingOrderPayload(null);
            setPendingOrderId(null);
            setQrTimeLeft(300);
        }
    };

    const handleRetryQR = () => {
        setQrTimeLeft(300);
    };

    // ---- RENDER ----
    return (
        <div className="checkout-page">
            <Header />

            {/* HERO */}
            <div className="checkout-hero">
                <div className="container">
                    <h1>Thanh toán</h1>
                    <div className="checkout-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span>/</span>
                        <a href="/cart">Giỏ hàng</a>
                        <span>/</span>
                        <span>Thanh toán</span>
                    </div>
                </div>
            </div>

            {/* VOUCHER BANNER */}
            <div className="checkout-coupon-banner">
                <div className="checkout-coupon-toggle">
                    <FaTag className="coupon-icon" />
                    <span>Bạn có mã giảm giá? Nhập ngay để tiết kiệm!</span>
                </div>

                {appliedVoucher ? (
                    <div className="voucher-applied-bar">
                        <div className="voucher-applied-info">
                            <FaCircleCheck className="text-success" />
                            <span>
                                Đã áp dụng <strong>{appliedVoucher.code}</strong>
                                {" — "}
                                {appliedVoucher.discountType === "percentage"
                                    ? `Giảm ${appliedVoucher.discountValue}%`
                                    : `Giảm ${appliedVoucher.discountValue.toLocaleString("vi-VN")}₫`
                                }
                            </span>
                        </div>
                        <button className="voucher-remove-btn" onClick={handleRemoveVoucher}>
                            <FaTimesCircle /> Hủy mã
                        </button>
                    </div>
                ) : (
                    <div className="coupon-inline-form">
                        <input
                            type="text"
                            className="coupon-inline-input"
                            placeholder="Nhập mã giảm giá (VD: WELCOME20)..."
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyVoucher()}
                        />
                        <button className="coupon-apply-btn" onClick={handleApplyVoucher}>Áp dụng</button>
                    </div>
                )}

                {voucherMsg && (
                    <div className={`voucher-msg ${voucherMsg.type}`}>
                        {voucherMsg.type === "success" ? <FaCircleCheck /> : <FaTimesCircle />}
                        {voucherMsg.text}
                    </div>
                )}
            </div>

            {/* MAIN CONTENT */}
            <form onSubmit={handlePlaceOrder}>
                <div className="checkout-main">

                    {/* LEFT COLUMN */}
                    <div>
                        {errorMsg && (
                            <div className="checkout-error-banner">
                                <FaTimesCircle /> {errorMsg}
                            </div>
                        )}

                        {/* DELIVERY INFO */}
                        <div className="checkout-card">
                            <h3 className="checkout-section-title">
                                <FaTruck style={{ color: "#17479D" }} /> Thông tin giao hàng
                            </h3>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Họ <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Nhập họ..."
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Tên <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên..."
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Email <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        placeholder="Nhập địa chỉ email..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Số điện thoại <span className="required">*</span></label>
                                    <input
                                        type="tel"
                                        placeholder="VD: 0901234567"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Địa chỉ nhận hàng <span className="required">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Số nhà, tên đường, phường/xã..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Tỉnh/Thành phố</label>
                                    <input
                                        type="text"
                                        placeholder="VD: TP. Hồ Chí Minh..."
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Mã bưu điện</label>
                                    <input
                                        type="text"
                                        placeholder="VD: 700000"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ORDER NOTES */}
                        <div className="checkout-card">
                            <h3 className="checkout-section-title">Ghi chú đơn hàng</h3>
                            <div className="form-field">
                                <label>Ghi chú (tùy chọn)</label>
                                <textarea
                                    placeholder="Yêu cầu đặc biệt, hướng dẫn giao hàng..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* PAYMENT */}
                        <div className="checkout-card">
                            <h3 className="checkout-section-title">
                                <FaLock style={{ color: "#17479D" }} /> Phương thức thanh toán
                            </h3>
                            <div className="payment-methods">
                                <label className={`payment-method ${paymentMethod === "COD" ? "selected" : ""}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === "COD"}
                                        onChange={() => setPaymentMethod("COD")}
                                    />
                                    <FaMoneyBillWave className="pm-icon pm-cod" />
                                    <div className="pm-info">
                                        <span className="pm-name">Thanh toán khi nhận hàng (COD)</span>
                                        <span className="pm-desc">Trả tiền mặt khi nhận sách tại nhà</span>
                                    </div>
                                </label>
                                <label className={`payment-method ${paymentMethod === "VNPay" ? "selected" : ""}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="VNPay"
                                        checked={paymentMethod === "VNPay"}
                                        onChange={() => setPaymentMethod("VNPay")}
                                    />
                                    <FaCreditCard className="pm-icon pm-vnpay" />
                                    <div className="pm-info">
                                        <span className="pm-name">Thanh toán qua VNPay</span>
                                        <span className="pm-desc">ATM, Visa, MasterCard, QR Code</span>
                                    </div>
                                </label>
                                <label className={`payment-method ${paymentMethod === "MoMo" ? "selected" : ""}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="MoMo"
                                        checked={paymentMethod === "MoMo"}
                                        onChange={() => setPaymentMethod("MoMo")}
                                    />
                                    <span className="pm-icon pm-momo">M</span>
                                    <div className="pm-info">
                                        <span className="pm-name">Ví điện tử MoMo</span>
                                        <span className="pm-desc">Quét mã QR thanh toán nhanh</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ORDER SUMMARY */}
                    <div className="order-sidebar">
                        <div className="order-sidebar-card">
                            <h3 className="order-sidebar-title">Đơn hàng của bạn</h3>

                            <div className="order-table-header">
                                <span>Sản phẩm</span>
                                <span>Giá tiền</span>
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="order-empty">
                                    Giỏ hàng trống. <a href="/">Tiếp tục mua sắm</a>
                                </div>
                            ) : (
                                cartItems.map(item => (
                                    <div className="order-table-row" key={item.id}>
                                        <div>
                                            <div className="order-item-name">{item.title}</div>
                                            <div className="item-qty">x {item.cartTotal || 1}</div>
                                        </div>
                                        <span>{((item.cartTotal || 1) * item.currentPrice).toLocaleString("vi-VN")}₫</span>
                                    </div>
                                ))
                            )}

                            {/* Subtotal */}
                            <div className="order-summary-line">
                                <span>Tạm tính</span>
                                <span>{cartTotalAmount.toLocaleString("vi-VN")}₫</span>
                            </div>

                            {/* Shipping */}
                            <div className="order-summary-line">
                                <span>Phí vận chuyển</span>
                                <span className="text-success fw-bold">Miễn phí</span>
                            </div>

                            {/* Discount */}
                            {discount > 0 && (
                                <div className="order-summary-line discount-line">
                                    <span>Giảm giá ({appliedVoucher?.code})</span>
                                    <span className="discount-amount">−{discount.toLocaleString("vi-VN")}₫</span>
                                </div>
                            )}

                            <div className="order-total-line">
                                <span>Thành tiền</span>
                                <span className="order-total-amount">{finalTotal.toLocaleString("vi-VN")}₫</span>
                            </div>

                            <button
                                type="submit"
                                className="place-order-btn"
                                disabled={loading || cartItems.length === 0}
                            >
                                {loading ? (
                                    <>⏳ Đang xử lý...</>
                                ) : (
                                    <>🛒 Đặt hàng ngay</>
                                )}
                            </button>

                            <p className="order-secure-note">
                                <FaLock style={{ fontSize: "11px" }} /> Thông tin được bảo mật an toàn
                            </p>
                        </div>
                    </div>
                </div>
            </form>

            {/* QR Modal Overlay */}
            {showQRModal && (
                <div className="qr-modal-overlay">
                    <div className="qr-modal-container">
                        {isVerifyingPayment ? (
                            <div className="qr-verifying-loader">
                                <div className="qr-spinner"></div>
                                <h2>Đang xác thực giao dịch...</h2>
                                <p>Hệ thống đang kết nối đối soát với cổng thanh toán {paymentMethod === "VNPay" ? "VNPay" : "MoMo"}. Vui lòng không đóng tab hoặc trình duyệt này.</p>
                                <span className="qr-tx-code">Mã đối soát hệ thống: BOOKSTORE-{pendingOrderId}</span>
                            </div>
                        ) : (
                            <>
                                <div className="qr-modal-header">
                                    <div className="qr-brand-title">
                                        <span className={`qr-brand-badge ${paymentMethod === "VNPay" ? "vnpay" : "momo"}`}>
                                            {paymentMethod === "VNPay" ? "VNPay" : "MoMo"}
                                        </span>
                                        <h2>Thanh toán đơn hàng qua {paymentMethod === "VNPay" ? "VNPay QR" : "Ví MoMo"}</h2>
                                    </div>
                                    <div className={`qr-timer-countdown ${qrTimeLeft < 60 ? "critical" : ""}`}>
                                        ⏰ Thời gian còn lại: {Math.floor(qrTimeLeft / 60).toString().padStart(2, '0')}:{(qrTimeLeft % 60).toString().padStart(2, '0')}
                                    </div>
                                </div>

                                {qrTimeLeft === 0 ? (
                                    <div className="qr-timeout-container">
                                        <span className="qr-timeout-icon">⚠️</span>
                                        <h3>Hết thời gian giao dịch</h3>
                                        <p>Đã hết thời gian dành cho phiên quét mã QR này. Vui lòng bấm thanh toán lại hoặc hủy để chọn phương thức khác.</p>
                                        <div className="qr-modal-actions">
                                            <button type="button" className="btn-qr-retry" onClick={handleRetryQR}>
                                                🔄 Tạo mã mới
                                            </button>
                                            <button type="button" className="btn-qr-cancel" onClick={handleCancelQR}>
                                                Hủy giao dịch
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="qr-modal-body">
                                        {/* Cột trái: Thông tin giao dịch */}
                                        <div className="qr-info-column">
                                            <p className="qr-intro-text">
                                                Vui lòng mở ứng dụng {paymentMethod === "VNPay" ? "Ngân hàng (Mobile Banking)" : "Ví MoMo"} của bạn, chọn quét mã QR hoặc chuyển khoản thủ công theo thông tin dưới đây:
                                            </p>
                                            
                                            <div className="qr-details-card">
                                                {paymentMethod === "VNPay" ? (
                                                    <>
                                                        <div className="qr-detail-row">
                                                            <span>Ngân hàng thụ hưởng:</span>
                                                            <strong>MB Bank (Ngân hàng Quân Đội)</strong>
                                                        </div>
                                                        <div className="qr-detail-row">
                                                            <span>Số tài khoản:</span>
                                                            <div className="copy-wrapper">
                                                                <strong>8888 6666 9999</strong>
                                                                <button type="button" className="btn-copy" onClick={() => {
                                                                    navigator.clipboard.writeText("888866669999");
                                                                    alert("Đã sao chép số tài khoản!");
                                                                }}>Sao chép</button>
                                                            </div>
                                                        </div>
                                                        <div className="qr-detail-row">
                                                            <span>Chủ tài khoản:</span>
                                                            <strong>CONG TY BOOKSTORE VIET NAM</strong>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="qr-detail-row">
                                                            <span>Ví điện tử nhận:</span>
                                                            <strong>Ví điện tử MoMo</strong>
                                                        </div>
                                                        <div className="qr-detail-row">
                                                            <span>Số điện thoại:</span>
                                                            <div className="copy-wrapper">
                                                                <strong>0901234567</strong>
                                                                <button type="button" className="btn-copy" onClick={() => {
                                                                    navigator.clipboard.writeText("0901234567");
                                                                    alert("Đã sao chép số điện thoại!");
                                                                }}>Sao chép</button>
                                                            </div>
                                                        </div>
                                                        <div className="qr-detail-row">
                                                            <span>Chủ tài khoản:</span>
                                                            <strong>BOOKSTORE VIET NAM</strong>
                                                        </div>
                                                    </>
                                                )}

                                                <div className="qr-detail-row">
                                                    <span>Số tiền thanh toán:</span>
                                                    <div className="copy-wrapper">
                                                        <strong className="text-blue">{finalTotal.toLocaleString("vi-VN")}₫</strong>
                                                        <button type="button" className="btn-copy" onClick={() => {
                                                            navigator.clipboard.writeText(finalTotal.toString());
                                                            alert("Đã sao chép số tiền!");
                                                        }}>Sao chép</button>
                                                    </div>
                                                </div>

                                                <div className="qr-detail-row">
                                                    <span>Nội dung chuyển khoản:</span>
                                                    <div className="copy-wrapper">
                                                        <strong className="text-orange">BOOKSTORE {pendingOrderId}</strong>
                                                        <button type="button" className="btn-copy" onClick={() => {
                                                            navigator.clipboard.writeText(`BOOKSTORE ${pendingOrderId}`);
                                                            alert("Đã sao chép nội dung!");
                                                        }}>Sao chép</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="qr-modal-notice">
                                                ⚠️ <strong>Quan trọng:</strong> Hãy đảm bảo chuyển khoản chính xác số tiền và nhập đúng nội dung chuyển khoản để hệ thống ghi nhận tự động tức thì.
                                            </div>
                                        </div>

                                        {/* Cột phải: Mã QR Code */}
                                        <div className="qr-code-column">
                                            <div className="qr-code-wrapper">
                                                {paymentMethod === "VNPay" ? (
                                                    <img 
                                                        src={`https://img.vietqr.io/image/MB-888866669999-compact.png?amount=${finalTotal}&addInfo=BOOKSTORE%20${pendingOrderId}&accountName=CONG%20TY%20BOOKSTORE%20VIET%20NAM`} 
                                                        alt="VietQR code" 
                                                        className="qr-code-img"
                                                    />
                                                ) : (
                                                    <img 
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MOMO_PAYMENT_BOOKSTORE_${pendingOrderId}_AMOUNT_${finalTotal}`} 
                                                        alt="MoMo QR code" 
                                                        className="qr-code-img"
                                                    />
                                                )}
                                                <div className="qr-scanning-bar"></div>
                                            </div>
                                            <div className="qr-scan-label">Quét mã để thanh toán</div>
                                        </div>
                                    </div>
                                )}

                                {qrTimeLeft > 0 && (
                                    <div className="qr-modal-footer">
                                        <button type="button" className="btn-qr-confirm" onClick={handleConfirmQRVerify}>
                                            ✅ Tôi đã thanh toán
                                        </button>
                                        <button type="button" className="btn-qr-cancel" onClick={handleCancelQR}>
                                            Hủy giao dịch
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Checkout;