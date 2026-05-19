import React from "react";
import '../header/Header.css'
import { FaMapMarkerAlt, FaSearch, FaShoppingCart   } from "react-icons/fa";
import { IoMdPhonePortrait } from "react-icons/io";
export const Header =()=> {
    return (
        <>
            <div className="top-bar">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 text-start">
                            <FaMapMarkerAlt className="top-bar-icon"/>
                            Đại học Nông Lâm Thành phố Hồ Chí Minh
                            <IoMdPhonePortrait  className="top-bar-icon"/>
                            0000000000
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 text-end">
                            <ul className="menu mb-0">
                                <li className="menu-item"><a href="">Yêu thích</a></li>
                                <li className="menu-item"><a href="">Tài khoản của tôi</a></li>
                                <li className="menu-item"><a href="">Thanh toán</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-lg-8 col-md-6 logo">
                            <a href="">
                                <img src="http://wp.acmeedesign.com/bookstore/wp-content/uploads/2016/01/logo_green.png" alt=""/>
                            </a>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 bks-cart-widget ">
                            <nav className="navbar ">
                                <div className="container-fluid d-flex align-items-center">
                                    <form className="d-flex" role="search">
                                        <input className="form-control me-2" type="search" placeholder="Search"
                                               aria-label="Search"/>
                                            <button className="btn " type="submit"><FaSearch/></button>
                                    </form>
                                    <div className="mini-cart">
                                        <FaShoppingCart />
                                    </div>
                                </div>
                            </nav>

                        </div>
                    </div>
                </div>
            </header>
            <nav className="main-menu">
                <div className="container">
                    <ul className="menu">
                        <li className="menu-item">Trang chủ</li>
                        <li className="menu-item">Học tập</li>
                        <li className="menu-item">Tiểu thuyết</li>
                        <li className="menu-item">Kinh doanh</li>
                        <li className="menu-item">Sức khỏe  </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}