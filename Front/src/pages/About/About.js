import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const About = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    setPrevLocation(location.state.data);
  }, [location]);
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Sobre Nosotros" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="max-w-[600px] ml-5 text-base text-lightText mb-2">
          <span className="text-primeColor font-semibold text-lg">Siena Confecciones</span>{" "}
          es una empresa de venta de gorras al por mayor que para mejorar la experiencia 
          de sus usuarios implemento un sistema de modelado 3D customizable para que nuestros
          clientes puedan personalizar y diseñar su propia gorra para vestir a la moda y como mas 
          les gusta.
        </h1>
        <Link to="/shop">
          <button className="w-52 h-10 mt-5 ml-5 bg-primeColor text-white hover:bg-black duration-300">
            Continuar Comprando
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
