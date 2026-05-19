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
                                    <p>Phone: 0793684680</p>
                                </li>
                                <li className="widget-list">
                                    <CiMail className={"widget-icon"}/>
                                    <p>Email: 201030277@st.hcmuaf.edu.vn</p>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6">
                            <div className="widget-nav-menu">
                                <h2 className="widget-title">
                                    SHOPPING GUIDE
                                </h2>
                                <ul className="menu-footer-container">
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">How to buy</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Fag</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Store Locations</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Return Policy</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Payment</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Shipment</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6">
                            <div className="widget-nav-menu">
                                <h2 className="widget-title">
                                    information
                                </h2>
                                <ul className="menu-footer-container">
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">About Us</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Delivery information</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Primary policy</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Discount</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Customer service</a>
                                    </li>
                                    <li className="menu-item">
                                        <FaRegCircle className="menu-item-icon"/>
                                        <a href="">Terms & condition</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6">
                            <div className="widget-nav-menu">
                                <h2 className="widget-title">
                                    store locations
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