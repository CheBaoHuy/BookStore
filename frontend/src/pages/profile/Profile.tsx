import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLink, FaSave, FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import "./Profile.css";

function Profile() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarLink, setAvatarLink] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setPhone(user.phone || "");
            setAvatarLink(user.avatar || "");
        }
    }, []);

    if (!user) {
        return (
            <div className="profile-page-wrapper">
                <Header />
                <div className="profile-access-denied">
                    <FaUserCircle className="denied-icon" />
                    <h2>Yêu cầu đăng nhập</h2>
                    <p>Vui lòng đăng nhập tài khoản để xem và chỉnh sửa thông tin cá nhân của bạn.</p>
                    <Link to="/login" className="btn-login-redirect">Đăng nhập ngay</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!fullName.trim()) {
            setErrorMsg("Họ và tên không được để trống.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(
                "http://localhost:8080/api/auth/profile",
                {
                    username: user.username,
                    fullName: fullName,
                    phone: phone,
                    email: user.email,
                    avatarLink: avatarLink
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                // Merge new details into active user storage session
                const updatedSessionUser = {
                    ...user,
                    fullName: response.data.fullName,
                    phone: response.data.phone,
                    avatar: response.data.avatar
                };
                localStorage.setItem("user", JSON.stringify(updatedSessionUser));
                setSuccessMsg("Cập nhật thông tin cá nhân thành công!");
                
                // Trigger header update smoothly
                setTimeout(() => {
                    setSuccessMsg("");
                }, 3000);
            }
        } catch (err: any) {
            console.error("Error saving profile:", err);
            setErrorMsg(err.response?.data?.message || "Không thể cập nhật thông tin. Vui lòng kiểm tra lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page-wrapper">
            <Header />

            <div className="profile-container">
                {/* Back link */}
                <div className="profile-back-link">
                    <Link to="/"><FaArrowLeft /> Quay lại trang chủ</Link>
                </div>

                <div className="profile-card">
                    {/* Header profile area */}
                    <div className="profile-header-area">
                        <div className="profile-avatar-preview">
                            {avatarLink ? (
                                <img src={avatarLink} alt="Avatar Preview" />
                            ) : (
                                <div className="avatar-preview-fallback">
                                    <FaUserCircle size={80} />
                                </div>
                            )}
                        </div>
                        <div className="profile-title-area">
                            <h2>Hồ sơ cá nhân</h2>
                            <p>Quản lý và cập nhật thông tin tài khoản của bạn</p>
                        </div>
                    </div>

                    {/* Messages */}
                    {errorMsg && <div className="alert alert-danger text-center py-2 px-3 mb-4">{errorMsg}</div>}
                    {successMsg && <div className="alert alert-success text-center py-2 px-3 mb-4">{successMsg}</div>}

                    {/* Edit Form */}
                    <form onSubmit={handleSaveProfile} className="profile-form">
                        <div className="profile-form-grid">
                            
                            {/* Username (read-only) */}
                            <div className="profile-form-group">
                                <label><FaUser /> Tên đăng nhập</label>
                                <input
                                    type="text"
                                    className="form-control read-only-input"
                                    value={user.username}
                                    readOnly
                                    title="Tên đăng nhập không thể thay đổi"
                                />
                            </div>

                            {/* Email (read-only) */}
                            <div className="profile-form-group">
                                <label><FaEnvelope /> Địa chỉ Email</label>
                                <input
                                    type="email"
                                    className="form-control read-only-input"
                                    value={user.email}
                                    readOnly
                                    title="Email không thể thay đổi"
                                />
                            </div>

                            {/* Full Name */}
                            <div className="profile-form-group">
                                <label htmlFor="profile-fullname"><FaUser /> Họ và tên <span className="text-danger">*</span></label>
                                <input
                                    id="profile-fullname"
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập họ và tên..."
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="profile-form-group">
                                <label htmlFor="profile-phone"><FaPhone /> Số điện thoại</label>
                                <input
                                    id="profile-phone"
                                    type="tel"
                                    className="form-control"
                                    placeholder="Nhập số điện thoại..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            {/* Avatar Link */}
                            <div className="profile-form-group full-width">
                                <label htmlFor="profile-avatar"><FaLink /> Đường dẫn ảnh đại diện (Avatar URL)</label>
                                <input
                                    id="profile-avatar"
                                    type="text"
                                    className="form-control"
                                    placeholder="Dán link ảnh đại diện mới vào đây..."
                                    value={avatarLink}
                                    onChange={(e) => setAvatarLink(e.target.value)}
                                />
                                <span className="input-tip">Dán liên kết ảnh từ Unsplash, Imgur hoặc bất kỳ nguồn trực tuyến nào.</span>
                            </div>

                        </div>

                        {/* Submit Actions */}
                        <div className="profile-form-actions">
                            <button type="submit" className="btn-save-profile" disabled={loading}>
                                <FaSave /> {loading ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Profile;
