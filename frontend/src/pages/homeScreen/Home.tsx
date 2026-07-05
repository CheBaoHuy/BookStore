import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducer/CartReducer";
import { Product } from "../../models";
import { Link } from "react-router-dom";

import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";

import {
  FaLongArrowAltRight,
  FaCartPlus,
  FaRegHeart
} from "react-icons/fa";

import { CiMail } from "react-icons/ci";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import centerImg from "../../images/center.jpg";
import centerImg2 from "../../images/center-2.jpg";
import centerImg3 from "../../images/center-3.jpg";
import centerImg4 from "../../images/center-4.jpg";
import { getBookCover } from "../../common/imageHelper";

// ================= SLIDESHOW =================
export const SlideShow = () => {
  const bannerResponsive = {
    all: {
      breakpoint: { max: 4000, min: 0 },
      items: 1
    }
  };

  return (
    <div className="main-banner-slider">
      <Carousel
        responsive={bannerResponsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={4000}
        showDots={true}
        arrows={true}
        itemClass="banner-item"
      >
        <div>
          <img src={centerImg} className="d-block w-100" alt="Banner 1" />
        </div>
        <div>
          <img src={centerImg2} className="d-block w-100" alt="Banner 2" />
        </div>
        <div>
          <img src={centerImg3} className="d-block w-100" alt="Banner 3" />
        </div>
      </Carousel>
    </div>
  );
};


export const Blog = () => {
  const blogImages = [centerImg4, centerImg3, centerImg2, centerImg];
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <div className="new-blog pt-5">
      <div className="container text-center">
        <h3>Tin Tức Mới</h3>

        <Carousel
          responsive={responsive}
          infinite={true}
          showDots={true}
        >
          {[1, 2, 3, 4].map((item) => (
            <div className="post" key={item}>
              <img
                src={blogImages[item - 1]}
                alt="Bài viết"
              />

              <div className="post-content">
                <h5>An Audio Post</h5>

                <p>Dynamically target high-payoff intellectual capital...</p>

                <button className="btn">
                  Read more
                  <FaLongArrowAltRight />
                </button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

// ================= HOME =================
const Home = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
    }
  };

  const dispatch = useDispatch();
  const [carousel, setCarousel] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:8080/api/products?size=8";
        if (carousel === 2) {
          url = "http://localhost:8080/api/products?categoryId=2&size=8"; // Category ID 2 = Tiểu thuyết
        } else if (carousel === 3) {
          url = "http://localhost:8080/api/products?categoryId=1&size=8"; // Category ID 1 = Học tập
        }
        const response = await axios.get(url);
        if (response.data && response.data.content) {
          setProducts(response.data.content);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [carousel]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  return (
    <>
      <Header />

      <SlideShow />

      <div className="container mt-5">
      <div className="products-slider">
        <div className="tabs-list d-flex gap-0">
          <div
            className={carousel === 1 ? "tab-title active" : "tab-title"}
            onClick={() => setCarousel(1)}
          >
            Best Selling
          </div>

          <div
            className={carousel === 2 ? "tab-title active" : "tab-title"}
            onClick={() => setCarousel(2)}
          >
            Tiểu Thuyết
          </div>

          <div
            className={carousel === 3 ? "tab-title active" : "tab-title"}
            onClick={() => setCarousel(3)}
          >
            Học Tập
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center my-5 py-4">
            <h5 className="text-muted">Không có sản phẩm nào thuộc danh mục này</h5>
          </div>
        ) : (
          <Carousel
            responsive={responsive}
            infinite={true}
          >
            {products.map((product) => (
              <div
                className="product-wrap"
                key={product.id}
              >
                <div className="product-img" style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <Link to={`/product/${product.id}`} className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <img
                      src={getBookCover(product.image, product.id)}
                      alt={product.title}
                      style={{ maxHeight: "200px", maxWidth: "100%", objectFit: "contain" }}
                    />
                  </Link>

                  <div className="product-buttons d-flex justify-content-evenly">
                    <FaCartPlus className="product-btn-icon" onClick={() => handleAddToCart(product)} title="Thêm vào giỏ hàng" />
                    <FaRegHeart className="product-btn-icon" title="Yêu thích" />
                  </div>
                </div>

                <div className="product-content">
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <h4 title={product.title} style={{ color: "#1a202c" }}>{product.title}</h4>
                  </Link>
                  <p style={{ fontSize: "12px", color: "#718096", margin: "2px 0 6px" }}>{product.author}</p>
                  <span className="price">{product.currentPrice.toLocaleString("vi-VN")} VNĐ</span>
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </div>
      </div>

      <div className="subscribe-for-deals mt-5">
        <div className="sfd-wrapper">
          <h3 className="text-center mb-5">
            Join <span>100,321</span> Happy Readers
          </h3>

          <Link to="/register" className="sfd-button text-decoration-none">
            SIGN UP TODAY
            <FaLongArrowAltRight />
          </Link>
        </div>
      </div>

      <Blog />

      <div className="news-letter-subscription">

        <div className="container">

          <div className="newsletter-wrapper">

            <div className="newsletter-text">

              <h3 className="news-letter-heading">
                SUBSCRIBE TO OUR NEWSLETTER
              </h3>

              <p className="news-letter-content">
                Get the latest updates, offers and book releases directly in your inbox.
              </p>

            </div>

            <div className="news-letter-form">

              <input
                type="email"
                placeholder="Enter your email address"
              />

              <button className="newsletter-btn">
                <CiMail className="news-letter-icon" />
              </button>

            </div>

          </div>
        </div>
      </div>
<Footer />
    </>
  );
};

export default Home;
