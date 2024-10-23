import React, { useEffect, useState, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { proxy, useSnapshot } from 'valtio';
import * as THREE from 'three';

const state = proxy({
  current: null,
  items: {
    billd1: '#9c9c9c',
    billd2: '#9c9c9c',
    billd3: '#9c9c9c',
    billd4: '#9c9c9c',
    billd5: '#9c9c9c',
    contornbase: '#9c9c9c',
    interiorcontorno: '#3c3c3c',
    eyeleft1: '#9c9c9c',
    eyeright1: '#9c9c9c',
    bill: '#ffffff',
    body: '#ffffff',
    central: '#000000',
    eyeleft2: '#9c9c9c',
    eyerigth2: '#9c9c9c',
    default: '#ffffff',
  },
});

const Desing = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");

  useEffect(() => {
    setPrevLocation(location.state?.data || "Inicio");
  }, [location]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Diseño 3D" prevLocation={prevLocation} />
      <div className="pb-30 pt-30 h-[80vh] w-[150vh] mt-0 mb-5 flex items-center">
        <>
          <Picker snap={useSnapshot(state)} />
          <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <Suspense fallback={null}>
              <Cap />
            </Suspense>
            <OrbitControls />
          </Canvas>
        </>
      </div>
    </div>
  );
};

function Cap(props) {
  const snap = useSnapshot(state);
  const { nodes } = useGLTF('cap.glb');
  const [hovered, set] = useState(null);

  return (
    <group
      {...props}
      dispose={null}
      onPointerOver={(e) => {
        e.stopPropagation();
        set(e.object.material.name);
      }}
      onPointerOut={(e) => {
        e.intersections.length === 0 && set(null);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        state.current = e.object.material.name;
      }}
      onPointerMissed={() => {
        state.current = null;
      }}
    >
      <group scale={0.01}>
        <group position={[7.888, 2.828, 0]}>
          <group position={[0, -151.665, 153.183]}>
            <mesh
              geometry={nodes.billdetail1.geometry}
              material={new THREE.MeshStandardMaterial({ color: snap.items.billd1 })}
              position={[0, 0, -184.563]}
              rotation={[Math.PI, 0, Math.PI]}
              scale={[2.715, 0.024, 2.743]}
            />
            <mesh
              geometry={nodes.billdetail2.geometry}
              material={new THREE.MeshStandardMaterial({ color: snap.items.billd2 })}
              position={[0, 0, -184.563]}
              rotation={[Math.PI, 0, Math.PI]}
              scale={[3.136, 0.027, 3.169]}
            />
            <mesh
              geometry={nodes.billdetail3.geometry}
              material={new THREE.MeshStandardMaterial({ color: snap.items.billd3 })}
              position={[0, 0, -184.563]}
              rotation={[Math.PI, 0, Math.PI]}
              scale={[3.499, 0.031, 3.451]}
            />
            <mesh
              geometry={nodes.billdetail4.geometry}
              material={new THREE.MeshStandardMaterial({ color: snap.items.billd4 })}
              position={[0, 0, -184.563]}
              rotation={[Math.PI, 0, Math.PI]}
              scale={[3.79, 0.033, 3.83]}
            />
            <mesh
              geometry={nodes.billdetail5.geometry}
              material={new THREE.MeshStandardMaterial({ color: snap.items.billd5 })}
              position={[0, 0, -184.563]}
              rotation={[Math.PI, 0, Math.PI]}
              scale={[4.014, 0.035, 4.056]}
            />
          </group>
          <group position={[0, -155.508, -116.791]}>
            <mesh
              geometry={nodes.contornbase.geometry}
              material={new THREE.MeshStandardMaterial({ color: snap.items.contornbase })}
              position={[0, 2.864, 0]}
              rotation={[Math.PI, 0, Math.PI]}
              scale={[4.362, 0.106, 4.407]}
            />
            <mesh
              geometry={nodes.interiorcontorn.geometry}
              material={new THREE.MeshStandardMaterial({ color: snap.items.interiorcontorno })}
              position={[0, -3.179, 3.578]}
              rotation={[Math.PI, 0, Math.PI]}
              scale={[4.128, 0.1, 4.171]}
            />
          </group>
          <group position={[83.961, 139.164, -202.166]}>
            <mesh
              geometry={nodes.eyelet1_left001.geometry}
              material={new THREE.MeshStandardMaterial({ color: snap.items.eyeleft1 })}
              rotation={[-1.926, 0.287, 0.174]}
              scale={[0.349, 0.349, 0.578]}
            />
          </group>
          <group position={[-85.186, 139.164, -202.166]} rotation={[-Math.PI, 0, 0]} scale={[-1.101, -1, -1]}>
            <mesh
              geometry={nodes.eyelet1_right001.geometry}
              material={new THREE.MeshStandardMaterial({ color: snap.items.eyeright1 })}
              rotation={[-1.926, 0.287, 0.174]}
              scale={[0.349, 0.349, 0.578]}
            />
          </group>
          <mesh
            geometry={nodes.bill.geometry}
            material={new THREE.MeshStandardMaterial({ color: snap.items.bill })}
            position={[0, -157.781, -121.671]}
            rotation={[Math.PI, 0, Math.PI]}
            scale={[4.362, 0.106, 4.407]}
          />
          <mesh
            geometry={nodes.body.geometry}
            material={new THREE.MeshStandardMaterial({ color: snap.items.body })}
            position={[1.053, -56.997, -116.848]}
            scale={4.778}
          />
          <mesh
            geometry={nodes.centerupball.geometry}
            material={new THREE.MeshStandardMaterial({ color: snap.items.central })}
            position={[2.725, 164.237, -116.947]}
            scale={[0.5, 0.738, 0.5]}
          />
          <mesh
            geometry={nodes.eyelet2_left.geometry}
            material={new THREE.MeshStandardMaterial({ color: snap.items.eyeleft2 })}
            position={[86.8, 135.476, -29.212]}
            rotation={[-1.242, 0.324, -0.103]}
            scale={[0.349, 0.349, 0.578]}
          />
          <mesh
            geometry={nodes.eyelet2_right.geometry}
            material={new THREE.MeshStandardMaterial({ color: snap.items.eyerigth2 })}
            position={[-81.764, 137.411, -38.882]}
            rotation={[-1.286, -0.329, -0.096]}
            scale={[0.349, 0.349, 0.578]}
          />
        </group>
        <mesh
          geometry={nodes.UI.geometry}
          material={new THREE.MeshStandardMaterial({ color: snap.items.default })}
          position={[12.049, 31, -51.866]}
          rotation={[0, -1.22, 0]}
        />
      </group>
    </group>
  );
}

function Picker() {
  const snap = useSnapshot(state);
  
  const handleColorChange = (part) => (event) => {
    const newColor = event.target.value;
    state.items[part] = newColor; // Update the color in state
  };

  return (
    <div className="picker">
      {Object.keys(snap.items).map((part) => (
        <div key={part}>
          <label>{part}</label>
          <input 
            type="color" 
            value={snap.items[part]} 
            onChange={handleColorChange(part)} 
          />
        </div>
      ))}
      <div>Selected Part: {snap.current}</div>
    </div>
  );
}


export default Desing;
