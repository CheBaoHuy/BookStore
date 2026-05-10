import React from "react";
import "./About.css";
import AboutImage from "../../images/Label Images/about.jpg";
import {FaArrowRight} from "react-icons/fa6";
import {Header} from "../../components/header/Header";
import {Footer} from "../../components/footer/Footer";

function About() {
    return (
        <>
            <div className={"contain"}>
                <div className={"login_label"}>
                    <div className={"login_title"}>
                        <h2 className={"title"}>Giới thiệu</h2>
                    </div>
                    <div className={"login_page"}>
                        <a><h6 className={"login_home"}>Trang chủ /</h6></a>
                        <h5 className={"login_name"}>Giới thiệu</h5>
                    </div>
                </div>
                <div className={"content"}>
                    <div className={"image"}>
                        <img className={"about-image"} src={AboutImage}/>
                    </div>
                    <div className={"info"}>
                        <h2 className={"titleIn"}>Đôi lời giới thiệu về BookStore</h2>
                        <p className={"para"}>Truy cập đến với BookStore - Nơi để bạn khám phá và mua sắm sách online
                            một cách nhanh chóng và thuận tiện kèm với những ưu đãi hấp dẫn được cập nhật liên tục!</p>
                        <div className={"description"}>
                            <p className={"intro"}>Tại BookStore, chúng tôi luôn cập nhật các chương trình khuyến mãi
                                mới nhất để mang lại cho bạn trải nghiệm mua sắm sách với mức giá tốt nhất có thể. Vì
                                thế, hãy tạo tài khoản và tìm hiểu xem các chính sách khuyến mãi, mã giảm giá kèm theo
                                của BookStore.</p>
                        </div>
                    </div>
                </div>
                <div className={"signup"}>
                    <div className={"text-info"}>
                        <p className={"general"}>Hãy tham gia cùng với hơn 100,321 người đọc sách và được truy cập những
                            bộ sưu tập sách tại BookStore!</p>
                        <p className={"offer"}>Chúng tôi luôn cập nhật những ưu đãi tốt nhất, tham gia ngay miễn
                            phí!</p>
                        <div className={"button"}>
                            <input className={"signup-button"} value={"Đăng Kí Ngay"} type={"submit"}/>
                            <FaArrowRight className={"icon"}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About;