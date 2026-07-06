import React from "react";
import "./About.css";
import AboutImage from "../../images/LabelImages/about.jpg";
import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";

function About() {
    return (
        <div className="about-page">
            <Header />
            <div className="about-hero">
                <div className="hero-overlay">
                    <h1 className="hero-title">Giới thiệu</h1>
                    <div className="breadcrumbs">
                        <a href="/" className="breadcrumb-link">Trang chủ</a>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">Giới thiệu</span>
                    </div>
                </div>
            </div>

            <div className="about-container">
                <div className="about-content">
                    <div className="about-image-wrapper">
                        <img className="about-image" src={AboutImage} alt="Giới thiệu BookStore" />
                    </div>
                    <div className="about-info">
                        <h2 className="info-title">Đôi lời giới thiệu về BookStore</h2>
                        <p className="info-paragraph">
                            Truy cập đến với BookStore - Nơi để bạn khám phá và mua sắm sách online
                            một cách nhanh chóng và thuận tiện kèm với những ưu đãi hấp dẫn được cập nhật liên tục!
                        </p>
                        <div className="info-highlight">
                            <p>
                                Tại BookStore, chúng tôi luôn cập nhật các chương trình khuyến mãi
                                mới nhất để mang lại cho bạn trải nghiệm mua sắm sách với mức giá tốt nhất có thể. Vì
                                thế, hãy tạo tài khoản và tìm hiểu xem các chính sách khuyến mãi, mã giảm giá kèm theo
                                của BookStore.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="about-newsletter">
                <div className="newsletter-content">
                    <h3 className="newsletter-title">
                        Hãy tham gia cùng với hơn 100,321 người đọc sách và được truy cập những
                        bộ sưu tập sách tại BookStore!
                    </h3>
                    <p className="newsletter-subtitle">
                        Chúng tôi luôn cập nhật những ưu đãi tốt nhất, tham gia ngay miễn phí!
                    </p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <Link to="/register" className="newsletter-button text-decoration-none">
                            Đăng Kí Ngay <FaArrowRight className="button-icon" />
                        </Link>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default About;
