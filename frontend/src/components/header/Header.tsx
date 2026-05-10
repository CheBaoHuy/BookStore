import React, {useEffect, useState} from "react";
import './Header.css'
import {FaMapMarkerAlt, FaSearch, FaShoppingCart} from "react-icons/fa";
import {IoMdPhonePortrait} from "react-icons/io";
import axios from "axios";

import {CategoryResponse, Product} from "../../models";
import {Link, useNavigate} from "react-router-dom";
import '../../common/Common.css'
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
export const Header =()=> {
    const navigate = useNavigate()
    const [showResults, setShowResults] = useState(false);
    const [search, setSearch] = useState("")
  const cart = useSelector( (state: RootState)=> state.carts)
    const getToken = localStorage.getItem("token")
    // const [isLogin, setIsLogin]
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase())
    );
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [responseCat, responsePro] = await Promise.all([
                    axios.get<CategoryResponse[]>("http://localhost:8080/api/v1/category/get-all"),
                    axios.get<Product[]>("http://localhost:8080/api/v1/product/products")
                ])
                setCategories(responseCat.data)
                setProducts(responsePro.data)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData()

    }, [cart])
    useEffect(() => {
        if (getToken === null){
            // navigate("/sign-in")
        }

        console.log(getToken)

    }, [getToken]);

    const Logout = (e: any) => {
        e.preventDefault();
        localStorage.removeItem("token")
        navigate("/")
    }
    return (
        <>
            <nav className="navbar navbar-expand-md bg-body-tertiary fixed-top header py-0">
                <div className="top-bar d-md-block">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 text-start">
                                <FaMapMarkerAlt className="top-bar-icon"/>
                                Đại học Nông Lâm Thành phố Hồ Chí Minh
                                <IoMdPhonePortrait className="top-bar-icon"/>
                                08529954522
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 text-end">
                                <ul className="menu mb-0">
                                    {/*<li className="menu-item"><a href="#">Yêu thích</a></li>*/}
                                    <li className="menu-item">
                                        {
                                            getToken === null ?
                                                <Link to="/sign-in">Đăng nhập</Link> :
                                                <Link to="/my-account">Tài khoản của tôi</Link>
                                        }
                                    </li>
                                    <li className="menu-item"><Link to="/checkout">Thanh toán</Link></li>
                                    {
                                        getToken !== null &&
                                        <li className="menu-item" onClick={e=> Logout(e)}>
                                            <Link to="/sign-in">Đăng xuất</Link>
                                        </li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <Link className="navbar-brand fs-4 logo" to="/home">
                        <img src="http://wp.acmeedesign.com/bookstore/wp-content/uploads/2016/01/logo_green.png" alt=""/>
                    </Link>
                    <button className="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-start" tabIndex={-1} id="offcanvasNavbar"
                         aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            {/*<h5 className="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5>*/}
                            <button type="button" className="btn-close shadown-none" data-bs-dismiss="offcanvas"
                                    aria-label="Close"></button>
                        </div>
                        {/*Slidebar body*/}
                        <div className="offcanvas-body">
                            <div className="d-flex justify-content-center align-items-center search-container">
                                <div className="search">
                                    <FaSearch className="icon-search"/>
                                    <input type="text" className="form-control border-0"
                                           placeholder="Tìm kiếm..."
                                           onChange={event => setSearch(event.target.value)}
                                           onFocus={() => setShowResults(true)}
                                           onBlur={() => setShowResults(false)}
                                    />
                                    {showResults ? <div className="search-results">
                                        {search === "" || filteredProducts.length === 0 ?
                                            <p className="text-center mb-0">Kết quả tìm kiếm</p>
                                            :
                                            <div className="results-container">
                                                {filteredProducts.map((item, index) =>
                                                    <div className="result mb-2" key={index}>
                                                        {item.image ?
                                                            <img src={item.image} alt={item.title}/> :
                                                            <div className="not-image"></div>
                                                        }
                                                        <div className="info-result w-100">
                                                            <p className="name mb-2">{item.title}</p>
                                                            <div className="d-flex justify-content-between">
                                                                <small className="cat">{item.category.name}</small>
                                                                <small className="price">{item.currentPrice}đ</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    </div> : ""}

                                </div>
                                <div className="icon-cart" data-count={cart.cartTotalQuantity}>
                                    <Link className={"link-cart"} to={"/cart"}><FaShoppingCart className="ms-3"/></Link>
                                </div>
                            </div>
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 d-md-none">
                                <li className="nav-item border-bottom">
                                    <Link className="nav-link active" aria-current="page" to={"/"}>Trang chủ</Link>
                                </li>
                                {getToken && JSON.parse(getToken).role === 'ROLE_ADMIN' ?
                                <li className="nav-item border-0">
                                    <Link className="nav-link active" aria-current="page" to={"/admin"}>Quản lý</Link>
                                </li> : null}
                                {categories.map((cat, index) =>
                                    <li className="nav-item dropdown border-0" key={index}>
                                        <nav className="nav-link dropdown-toggle" role="button"
                                             data-bs-toggle="dropdown" aria-expanded="false">
                                            {cat.category.name}
                                        </nav>
                                        <ul className="dropdown-menu">
                                            {cat.categories.map((subCat, index) =>
                                                <li key={index}>
                                                    <Link className="dropdown-item"
                                                          to={`/category/${subCat.id}`}>{subCat.name}</Link>
                                                </li>
                                            )}
                                        </ul>
                                    </li>
                                )}
                                <li className="nav-item border-0">
                                    {
                                        getToken === null ?
                                            <Link className="nav-link active text-center" aria-current="page"
                                                  to="/sign-in">Đăng nhập</Link> :
                                            <Link className="nav-link active text-center" aria-current="page"
                                                  to="/my-account">Tài khoản của tôi</Link>
                                    }
                                </li>
                                {getToken !== null && <li className="nav-item border-0 " onClick={e => Logout(e)}>
                                    <Link className="nav-link active text-center" aria-current="page" to="/sign-in">Đăng
                                        xuất</Link>
                                </li>}

                            </ul>
                        </div>
                    </div>
                </div>
                <nav className="main-menu">
                    <div className="container">
                        <ul className="menu drop-down">
                            <li className="menu-item">
                                <Link className={"fix-css"} to={"/"}>Trang chủ</Link>
                            </li>
                            <li className="menu-item show-drop-down">
                                <p>Thể loại</p>
                                <div className="drop-down-content">
                                    {categories.map((cat, index) =>
                                        <div className="category" key={index}>
                                            <h3 className="parent-cat">{cat.category.name}</h3>
                                            <div className="sub-cat-container">
                                                <ul className="sub-cat">
                                                    {cat.categories.map((subCat, index) =>
                                                        <li className="sub-cat-item" key={index}>
                                                            <Link to={`/category/${subCat.id}`}>{subCat.name}</Link>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </li>
                            <li className="menu-item">
                                <Link className={"fix-css"} to={"/about-us"}>Về chúng tôi</Link></li>
                            {getToken && JSON.parse(getToken).role === 'ROLE_ADMIN' ?
                                <li className="menu-item">
                                    <Link className={"fix-css"} to={"/admin"}>Quản lý</Link>
                                </li> : ""}


                        </ul>
                    </div>
                </nav>
            </nav>
        </>
    )
}