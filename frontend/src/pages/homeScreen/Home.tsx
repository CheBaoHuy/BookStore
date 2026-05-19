import React, { useState } from "react";
import "./Home.css";

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
                src="https://wp.acmeedesign.com/bookstore/wp-content/uploads/2016/02/497109-1280x720-350x140.jpg"
                alt=""
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

  const [carousel, setCarousel] = useState(1);

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
            E-books
          </div>

          <div
            className={carousel === 3 ? "tab-title active" : "tab-title"}
            onClick={() => setCarousel(3)}
          >
            Text Book
          </div>
        </div>

        <Carousel
          responsive={responsive}
          infinite={true}
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              className="product-wrap"
              key={item}
            >
              <div className="product-img">
                <img
                  src={centerImg4}
                  alt={`Colorless Tsukuru ${item}`}
                />

                <div className="product-buttons d-flex justify-content-evenly">
                  <FaCartPlus className="product-btn-icon" />
                  <FaRegHeart className="product-btn-icon" />
                </div>
              </div>

              <div className="product-content">
                <h4>Colorless Tsukuru {item}</h4>
                <span className="price">100.000 VNĐ</span>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      </div>

      <div className="subscribe-for-deals mt-5">
        <div className="sfd-wrapper">
          <h3 className="text-center mb-5">
            Join <span>100,321</span> Happy Readers
          </h3>

          <button className="sfd-button">
            SIGN UP TODAY
            <FaLongArrowAltRight />
          </button>
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
