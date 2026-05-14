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


// ================= SLIDESHOW =================
export const SlideShow = () => {
  return (
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTmdcZ7EdLJAP3mi6SpE3nDsJj4x8z8lNQxlgV4x_V&s"
            className="d-block w-100"
            alt=""
          />
        </div>

        <div className="carousel-item">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTmdcZ7EdLJAP3mi6SpE3nDsJj4x8z8lNQxlgV4x_V&s"
            className="d-block w-100"
            alt=""
          />
        </div>

        <div className="carousel-item">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTmdcZ7EdLJAP3mi6SpE3nDsJj4x8z8lNQxlgV4x_V&s"
            className="d-block w-100"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};


// ================= BLOG =================
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
          {[1,2,3,4].map((item)=>(
            <div className="post" key={item}>
              <img
                src="https://wp.acmeedesign.com/bookstore/wp-content/uploads/2016/02/497109-1280x720-350x140.jpg"
                alt=""
              />

              <div className="post-content">
                <h5>An Audio Post</h5>

                <p>
                  Dynamically target high-payoff intellectual
                  capital...
                </p>

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
      breakpoint: {
        max: 3000,
        min: 1024
      },
      items: 4
    },

    tablet: {
      breakpoint: {
        max: 1024,
        min: 464
      },
      items: 3
    },

    mobile: {
      breakpoint: {
        max: 464,
        min: 0
      },
      items: 2
    }
  };

  const [carousel, setCarousel] = useState(1);

  return (
    <>
      <Header />

      <SlideShow />

      <div className="container mt-5">

        <div className="tabs-list d-flex gap-4">

          <div
            className={
              carousel === 1
                ? "tab-title active"
                : "tab-title"
            }
            onClick={() => setCarousel(1)}
          >
            Best Selling
          </div>

          <div
            className={
              carousel === 2
                ? "tab-title active"
                : "tab-title"
            }
            onClick={() => setCarousel(2)}
          >
            E-books
          </div>

          <div
            className={
              carousel === 3
                ? "tab-title active"
                : "tab-title"
            }
            onClick={() => setCarousel(3)}
          >
            Text Book
          </div>

        </div>


        <Carousel
          responsive={responsive}
          infinite={true}
          className="mt-5"
        >
          {[1,2,3,4,5].map((item)=>(
            <div
              className="product-wrap"
              key={item}
            >
              <div className="product-img">

                <img
                  src="https://wp.acmeedesign.com/bookstore/wp-content/uploads/2016/02/book17-216x265.png"
                  alt=""
                />

                <div className="product-buttons d-flex justify-content-evenly">

                  <FaCartPlus
                    className="product-btn-icon"
                  />

                  <FaRegHeart
                    className="product-btn-icon"
                  />

                </div>

              </div>

              <div className="product-content">

                <h4>
                  Colorless Tsukuru {item}
                </h4>

                <span>
                  100.000 VNĐ
                </span>

              </div>

            </div>
          ))}
        </Carousel>

      </div>


      <div className="subscribe-for-deals mt-5">

        <h3 className="text-center">
          Join 100,321 Happy Readers
        </h3>

        <div className="text-center mt-3">
          <button className="sfd-button">
            SIGN UP TODAY
            <FaLongArrowAltRight />
          </button>
        </div>

      </div>


      <Blog />


      <div className="news-letter-subscription mt-5">

        <div className="container">

          <h3>
            SUBSCRIBE TO OUR NEWSLETTER
          </h3>

          <div className="d-flex">

            <input
              type="email"
              placeholder="Email address"
            />

            <CiMail />

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default Home;