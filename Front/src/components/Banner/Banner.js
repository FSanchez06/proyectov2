import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Image from "../designLayouts/Image";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [dotActive, setDocActive] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3002/banners')
      .then(response => response.json())
      .then(data => setBanners(data));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (prev, next) => {
      setDocActive(next);
    },
    appendDots: (dots) => (
      <div style={{ position: "absolute", top: "50%", left: "7%", transform: "translateY(-50%)" }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div style={i === dotActive ? { width: "30px", color: "#262626", borderRight: "3px #262626 solid", padding: "8px 0", cursor: "pointer" } : { width: "30px", color: "transparent", borderRight: "3px white solid", padding: "8px 0", cursor: "pointer" }}>
        0{i + 1}
      </div>
    ),
  };

  return (
    <div className="w-full bg-white">
      <Slider {...settings}>
        {banners.map(banner => (
          <Link key={banner.id} to="/offer">
            <div>
              <Image imgSrc={banner.imageUrl} />
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;