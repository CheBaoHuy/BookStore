import React, { useEffect, useState } from "react";
import './Home.css'
import { FaLongArrowAltRight, FaCartPlus, FaRegHeart } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Product } from "../../models";
import axios from "axios"
import { Link } from "react-router-dom"
import {addToCart} from "../../redux/reducer/CartReducer";
import {useDispatch} from "react-redux";
import Banner from "../../images/bookstore.jpg"
export const SlideShow = () => {

    return (
        <div className="container" style={{ marginTop: 200 }}>
            <div id="carouselExampleAutoplaying" className="carousel slide " data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={Banner} className="d-block w-100" alt="..." />
                    </div>

                </div>
            </div>
        </div>
    )
}
export const Home = () => {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
        }
    };
    const [carousel, setCarousel] = useState(1);
    const [bestSell, setBestSell] = useState<any[]>([])
    const [newest, setNewest] = useState<Product[]>([])
    const dispatch = useDispatch();
    const handleAddToCart = (product: Product) => {
        dispatch(addToCart(product))
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [responseB, responseN] = await Promise.all(
                    [axios.get<any>(`http://localhost:8080/api/v1/product/best-sellers`),
                    axios.get<Product[]>(`http://localhost:8080/api/v1/product/newest`)]
                )
                setBestSell(responseB.data)
                setNewest(responseN.data)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData()
    }, [])
    console.log(bestSell);

    const formatToVNPrice = (price: any) => {
        return price.toLocaleString('vi-VN') + ' VNĐ';
    }

    return (
        <>
            <SlideShow />
            <div className="main container">
                {/*<div className="row home-category pt-5 pb-5">*/}
                {/*    <div className="col-sm-4">*/}
                {/*        <div className="column-inner">*/}
                {/*            <div className="home-category-img">*/}
                {/*                <img src="https://wp.acmeedesign.com/bookstore/wp-content/uploads/2016/02/home-1-ebook.jpg" alt="" />*/}
                {/*                <div className="home-category-content">*/}
                {/*                    <div className="home-category-text">*/}
                {/*                        <h6>shop category</h6>*/}
                {/*                        <h2>E-BOOKS</h2>*/}
                {/*                        <a href="#">shop now <FaLongArrowAltRight /></a>*/}
                {/*                    </div>*/}
                {/*                </div>*/}

                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="col-sm-4">*/}
                {/*        <div className="column-inner">*/}
                {/*            <div className="home-category-img">*/}
                {/*                <img src="https://wp.acmeedesign.com/bookstore/wp-content/uploads/2016/02/home-1-text-book.jpg" alt="" />*/}
                {/*                <div className="home-category-content">*/}
                {/*                    <div className="home-category-text">*/}
                {/*                        <h6>shop category</h6>*/}
                {/*                        <h2>E-BOOKS</h2>*/}
                {/*                        <a href="#">shop now <FaLongArrowAltRight /></a>*/}
                {/*                    </div>*/}
                {/*                </div>*/}

                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="col-sm-4">*/}
                {/*        <div className="column-inner">*/}
                {/*            <div className="home-category-img">*/}
                {/*                <img src="https://wp.acmeedesign.com/bookstore/wp-content/uploads/2016/02/home-1-offer.jpg" alt="" />*/}
                {/*                <div className="home-category-content">*/}
                {/*                    <div className="home-category-text">*/}
                {/*                        <h6>shop category</h6>*/}
                {/*                        <h2>E-BOOKS</h2>*/}
                {/*                        <a href="#">shop now <FaLongArrowAltRight /></a>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="products-slider">
                    <div className="tabs-list">
                        <div className={carousel === 1 ? "tab-title active" : "tab-title"}
                            onClick={() => setCarousel(1)}>Mới nhất</div>
                        <div className={carousel === 2 ? "tab-title active" : "tab-title"}
                            onClick={() => setCarousel(2)}>Bán chạy nhất</div>
                        {/* <div className={carousel === 3 ? "tab-title active" : "tab-title"}
                            onClick={() => setCarousel(3)}>text book</div> */}
                    </div>
                    <div className="tabs-panel mt-5">
                        <Carousel
                            responsive={responsive}
                            ssr={true}
                            infinite={true}
                            containerClass={carousel === 2 ? "" : "hide-carousel-container"}
                        >
                            {bestSell.map((item, index) => (
                                <div className="product-wrap" key={index}>
                                    <div className="product-img">
                                        <Link to={`/detail/${item[0]}`}>
                                            <img src={item[1]} alt="" />
                                        </Link>
                                        <div className="product-buttons d-flex justify-content-evenly">
                                            <p className="d-flex align-items-center mb-0 text-white">
                                                <FaCartPlus
                                                    className={"product-btn-icon"}
                                                    onClick={() => handleAddToCart(item)}
                                                />
                                                Thêm vào giỏ hàng
                                            </p>

                                            {/*<FaRegHeart className={"product-btn-icon"}/>*/}
                                        </div>
                                    </div>
                                    <div className="product-content">
                                        <h4 className="product-title">
                                            <Link to={`/detail/${item[0]}`}>
                                                {item[2]}
                                            </Link>
                                        </h4>
                                        <span className="price">
                                            {item[4]}
                                            <span className="currency-symbol">
                                                &nbsp;VNĐ
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                        <Carousel
                            responsive={responsive}
                            ssr={true}
                            infinite={true}
                            containerClass={carousel === 1 ? "" : "hide-carousel-container"}
                        >
                            {newest?.map((item, index) => (
                                <div className="product-wrap" key={index}>
                                    <div className="product-img">
                                        <Link to={`/detail/${item.id}`}>
                                            {item.image && <img src={item.image} alt=""/>}
                                        </Link>
                                        <div className="product-buttons d-flex justify-content-evenly">
                                            <p className="d-flex align-items-center mb-0 text-white"
                                               onClick={() => handleAddToCart(item)}>
                                                <FaCartPlus
                                                    className={"product-btn-icon"}

                                                />
                                                Thêm vào giỏ hàng
                                            </p>
                                        </div>
                                    </div>
                                    <div className="product-content">
                                        <h4 className="product-title">
                                            <Link to={`/detail/${item.id}`}>{item.title}</Link>
                                        </h4>
                                        <span className="price">
                                            {formatToVNPrice(item.currentPrice)}

                                        </span>
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
            <div className="subscribe-for-deals mt-5">
                <div className="sfd-wrapper">
                    <h3 className={"text-center mb-5"}>Tham gia
                        <span> 100,321 </span>
                        độc giả hài lòng và truy cập vào toàn bộ bộ sưu tập của chúng tôi gồm
                        <span> 1000 </span>
                        cuốn sách điện tử với giá của một
                    </h3>
                    <div className="sfd-button-container d-flex justify-content-center mt-4">
                        <button className={"sfd-button "}>
                            <Link to={`/sign-up`} className="text-white">
                                Đăng ký ngay <FaLongArrowAltRight />
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
            {/*<Blog />*/}
            <div className="news-letter-subscription">
                <div className="row"> 
                    
                    <div className="col-md-6">
                        <h3 className="news-letter-heading">
                            THEO DÕI BẢN TIN CỦA CHÚNG TÔI
                        </h3>
                        <p className="news-letter-content">Nhập địa chỉ email của bạn để nhận thông tin cập nhật thường xuyên cũng như tin tức về các sự kiện sắp tới và ưu đãi đặc biệt.</p>
                    </div>
                    <div className="col-md-6">
                        <div className="news-letter-form">
                            <form action="" className={"d-flex justify-content-end mt-3"}>
                                <input type="text" placeholder={"Địa chỉ email"} />
                                <CiMail className={"news-letter-icon"} />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



