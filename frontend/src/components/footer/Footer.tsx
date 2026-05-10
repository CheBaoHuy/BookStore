import React from "react";
import "../../pages/homeScreen/Home.css";
import "./Footer.css";
import "../header/Header.css";
import { CiLocationOn,CiMail  } from "react-icons/ci";
import { FaPhone } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";

export const Footer = () => {
    return (
        <>
            <footer className="pt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-6 logo">
                            <a href="">
                                <img src="http://wp.acmeedesign.com/bookstore/wp-content/uploads/2016/01/logo_green.png" alt=""/>
                            </a>
                            <ul className="widget">
                                <li className="widget-list">
                                    <CiLocationOn className={"widget-icon"}/>
                                    <p>Đại học Nông Lâm TpHCM, Linh Trung</p>
                                </li>
                                <li className="widget-list">
                                    <FaPhone className={"widget-icon"}/>
                                    <p>Phone: 0912314211</p>
                                </li>
                                <li className="widget-list">
                                    <CiMail className={"widget-icon"}/>
                                    <p>Email: nlu@hcmuaf.edu.vn</p>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6">
                            <div className="widget-nav-menu">
                                <h2 className="widget-title">
                                    Mẹo mua sắm
                                </h2>
                                <ul className="menu-footer-container">
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Cách thức mua</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Hỏi đáp</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Vị trí cửa hàng</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Điều khoản đổi trả</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Phương thức thanh toán</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Dịch vụ vận chuyển</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6">
                            <div className="widget-nav-menu">
                                <h2 className="widget-title">
                                    Thông tin
                                </h2>
                                <ul className="menu-footer-container">
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Về chúng tôi</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Thông tin giao hàng</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Điều khoản riêng tư</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Chính sách giảm giá</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Chăm sóc khách hàng</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href=""> Điều khoản dịch vụ</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6">
                            <div className="widget-nav-menu">
                                <h2 className="widget-title">
                                    Vị trí cửa hàng
                                </h2>
                                <div className="text-widget">
                                    <img src="http://wp.acmeedesign.com/bookstore/wp-content/uploads/2016/02/worldmap.png" alt="store locations"/>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copy-right">
                    <div className="container">
                        <small>Copyright © 2015 Book StoreAll Rights Reserved.</small>
                    </div>
                </div>
            </footer>

        </>
    )
}