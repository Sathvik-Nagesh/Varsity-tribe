import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
  Html,
  useProgress
} from "@react-three/drei";
import * as THREE from "three";
import { IconLoader2 } from '@tabler/icons-react';

const MAX_YEARS = 50;

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-2 text-brand-primary w-48 text-center">
        <IconLoader2 className="animate-spin text-brand-primary" size={32} />
        <span className="font-semibold text-sm text-brand-text-secondary">{progress.toFixed(0)}% loaded</span>
      </div>
    </Html>
  );
}

function AnimatedStep({
  index,
  isActive,
  value,
  maxValue,
}: {
  index: number;
  isActive: boolean;
  value: number;
  maxValue: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const theta = index * 0.4;
  const radius = 1.2 + (index / 50) * 4;
  const x = Math.cos(theta) * radius;
  const z = Math.sin(theta) * radius;

  const maxHeight = 8;
  const safeMaxValue = maxValue <= 0 ? 1 : maxValue;
  const targetHeight = isActive
    ? Math.max(0.1, (value / safeMaxValue) * maxHeight)
    : 0.001;
  const targetY = targetHeight / 2;

  const color = useMemo(() => {
    return new THREE.Color().setHSL(0.55 + (index / 50) * 0.1, 0.9, 0.6); // Soft blue/cyan gradient
  }, [index]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const dampFactor = 6;
      meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetHeight, dampFactor, delta);
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, dampFactor, delta);
      meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, x, dampFactor, delta);
      meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, z, dampFactor, delta);

      const targetScaleXZ = isActive ? 1 : 0.001;
      meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetScaleXZ, dampFactor, delta);
      meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScaleXZ, dampFactor, delta);
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.1}
        metalness={0.1}
        transmission={0.4}
        thickness={0.5}
        envMapIntensity={1}
      />
    </mesh>
  );
}

function WealthSpiral({
  monthlyInvestment,
  years,
  expectedReturn,
}: {
  monthlyInvestment: number;
  years: number;
  expectedReturn: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const monthlyRate = expectedReturn / 100 / 12;

  const maxValue = useMemo(() => {
    const totalMonths = years * 12;
    if (monthlyRate === 0) return monthlyInvestment * totalMonths;
    return (
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
    );
  }, [monthlyInvestment, years, monthlyRate]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group position={[0, -2.5, 0]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={groupRef}>
          {Array.from({ length: MAX_YEARS }).map((_, i) => {
            const isActive = i < years;
            const year = i + 1;
            const months = year * 12;
            let value = 0;
            if (isActive) {
              if (monthlyRate === 0) {
                value = monthlyInvestment * months;
              } else {
                value =
                  monthlyInvestment *
                  ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
              }
            }

            return (
              <AnimatedStep
                key={i}
                index={i}
                isActive={isActive}
                value={value}
                maxValue={maxValue}
              />
            );
          })}
        </group>
      </Float>
      
      <pointLight position={[0, 4, 0]} color="#3b82f6" intensity={1.5} distance={15} />
      <ambientLight intensity={0.8} />
      
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.3}
        scale={20}
        blur={2.5}
        far={10}
        color="#334155"
      />
    </group>
  );
}

export default function CompoundInterest3D({
  monthlyInvestment,
  years,
  expectedReturn,
}: {
  monthlyInvestment: number;
  years: number;
  expectedReturn: number;
}) {
  return (
    <Canvas
      camera={{ position: [8, 6, 8], fov: 45 }}
      className="w-full h-full cursor-move"
      shadows
      dpr={[1, 2]}
    >
      <Suspense fallback={<CanvasLoader />}>
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        
        <WealthSpiral
          monthlyInvestment={monthlyInvestment}
          years={years}
          expectedReturn={expectedReturn}
        />
        
        <Environment preset="city" />
        
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={25}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  );
}
