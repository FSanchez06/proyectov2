import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { Canvas } from '@react-three/fiber';
import { useGLTF, AccumulativeShadows, RandomizedLight, Environment, CameraControls } from '@react-three/drei';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './styles.css';

const Desing = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [colors, setColors] = useState(["#ffffff", "#ffffff", "#ffffff", "#ffffff"]); // Estado para los colores de cada modelo

  useEffect(() => {
    setPrevLocation(location.state?.data || "Inicio");
  }, [location]);

  // Manejar el cambio de color para cada slide
  const handleColorChange = (index, color) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Diseño 3D" prevLocation={prevLocation} />
      <div className="pb-30 h-[100vh] w-[150vh] mt-2 mb-5 flex items-center">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          allowTouchMove={false} // Desactiva el deslizamiento
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {colors.map((color, index) => (
            <SwiperSlide key={index}>
              <ThreeDSlide modelPath="/shoe.gltf" color={color} />
              <div className="absolute top-4 right-4">
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => handleColorChange(index, e.target.value)} 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const ThreeDSlide = ({ modelPath, color }) => (
  <Canvas shadows camera={{ position: [5, 0, 5], fov: 35 }}>
    <ambientLight intensity={Math.PI} />
    <Model modelPath={modelPath} position={[0, 0, 0.85]} scale={10} color={color} />
    <Model modelPath={modelPath} position={[0, 0, -0.85]} rotation={[0, 0.5, Math.PI]} scale={-1} color={color} />
    <AccumulativeShadows position={[0, -0.5, 0]} temporal frames={100} alphaTest={0.75} opacity={0.9}>
      <RandomizedLight radius={6} position={[5, 5, -10]} bias={0.001} />
    </AccumulativeShadows>
    <CameraControls />
    <Environment preset="city" />
  </Canvas>
);

// El componente Model aplicará el color a todos los materiales
function Model({ modelPath, color, ...props }) {
  const { nodes, materials } = useGLTF(modelPath);

  useEffect(() => {
    if (materials) {
      Object.keys(materials).forEach((key) => {
        materials[key].color.set(color); // Aplica el color a todos los materiales del modelo
      });
    }
  }, [color, materials]);

  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.shoe.geometry} material={materials.laces} />
      <mesh castShadow receiveShadow geometry={nodes.shoe_1.geometry} material={materials.mesh} />
      <mesh castShadow receiveShadow geometry={nodes.shoe_2.geometry} material={materials.caps} />
      <mesh castShadow receiveShadow geometry={nodes.shoe_3.geometry} material={materials.inner} />
      <mesh castShadow receiveShadow geometry={nodes.shoe_4.geometry} material={materials.sole} />
      <mesh castShadow receiveShadow geometry={nodes.shoe_5.geometry} material={materials.stripes} />
      <mesh castShadow receiveShadow geometry={nodes.shoe_6.geometry} material={materials.band} />
      <mesh castShadow receiveShadow geometry={nodes.shoe_7.geometry} material={materials.patch} />
    </group>
  );
}

export default Desing;
