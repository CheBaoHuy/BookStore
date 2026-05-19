import React from "react";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";

function Business() {
    return (
        <div className="category-page">
            <Header />
            <div className="about-hero" style={{ background: "linear-gradient(135deg, #17479D, #1e5fc4)", padding: "80px 20px", textAlign: "center" }}>
                <div className="hero-overlay">
                    <h1 className="hero-title" style={{ color: "white", fontSize: "36px", fontWeight: "bold", margin: 0 }}>Sách Kinh Doanh</h1>
                    <div className="breadcrumbs" style={{ color: "rgba(255,255,255,0.8)", marginTop: "10px" }}>
                        <a href="/" style={{ color: "white", textDecoration: "none" }}>Trang chủ</a>
                        <span style={{ margin: "0 10px" }}>/</span>
                        <span>Kinh doanh</span>
                    </div>
                </div>
            </div>
            
            <div className="container" style={{ padding: "60px 20px", minHeight: "40vh", textAlign: "center" }}>
                <h2>Danh mục sách Kinh doanh đang được cập nhật...</h2>
                <p style={{ color: "#718096", marginTop: "10px" }}>Vui lòng quay lại sau nhé!</p>
            </div>
            <Footer />
        </div>
    );
}

export default Business;
