"use client";

import React, { useState, useMemo, useRef, Suspense } from "react";
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
import * as Slider from "@radix-ui/react-slider";
import Link from 'next/link';
import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react';
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui";
import { ErrorBoundary } from 'react-error-boundary';

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

function ErrorFallback() {
  return (
    <div className="flex-1 flex items-center justify-center bg-brand-surface-elevated rounded-2xl border border-brand-border h-[400px]">
      <div className="text-center p-6">
        <p className="text-brand-danger font-semibold mb-2">Visualization Failed</p>
        <p className="text-sm text-brand-text-secondary">We encountered an issue rendering the 3D scene.</p>
      </div>
    </div>
  );
}

const MAX_YEARS = 50;

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

const localFormatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

export default function CompoundInterestLab() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [years, setYears] = useState(30);
  const [expectedReturn, setExpectedReturn] = useState(8);

  const monthlyRate = expectedReturn / 100 / 12;
  const months = years * 12;
  const totalContributions = monthlyInvestment * months;
  const futureValue =
    monthlyRate === 0
      ? totalContributions
      : monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const totalInterest = futureValue - totalContributions;

  return (
    <PageLayout>
      <Container>
        <div className="py-6 flex items-center">
          <Link href="/learn" className="text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 font-medium text-sm transition-colors">
            <IconArrowLeft size={16} /> Back to Learn
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 min-h-[700px] mb-12">
          
          {/* Controls Sidebar */}
          <Card variant="elevated" className="w-full lg:w-1/3 xl:w-1/4 p-6 sm:p-8 flex flex-col gap-8 shadow-xl bg-white/80 backdrop-blur-xl border border-white/40">
            <div>
              <h1 className="text-3xl font-display text-brand-primary mb-2">
                Wealth Lab
              </h1>
              <p className="text-sm text-brand-text-secondary font-medium">
                Visualize the exponential power of compound interest in 3D.
              </p>
            </div>

            {/* Results Summary */}
            <div className="bg-brand-surface-elevated rounded-xl p-5 border border-brand-border/60 space-y-4">
              <div>
                <p className="text-xs text-brand-text-secondary font-bold uppercase tracking-wider mb-1">
                  Future Value
                </p>
                <p className="text-4xl font-display text-brand-text-primary">
                  {localFormatCurrency(futureValue)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-border/60">
                <div>
                  <p className="text-[10px] text-brand-text-tertiary font-bold uppercase tracking-wider mb-1">Contributions</p>
                  <p className="text-base font-semibold text-brand-text-secondary">
                    {localFormatCurrency(totalContributions)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-brand-success font-bold uppercase tracking-wider mb-1">Total Interest</p>
                  <p className="text-base font-semibold text-brand-success">
                    {localFormatCurrency(totalInterest)}
                  </p>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-8 flex-1">
              {/* Monthly Investment */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-brand-text-primary">
                    Monthly Investment
                  </label>
                  <span className="text-sm font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md border border-brand-primary/20">
                    {localFormatCurrency(monthlyInvestment)}
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[monthlyInvestment]}
                  max={5000}
                  step={50}
                  onValueChange={(val) => setMonthlyInvestment(val[0])}
                >
                  <Slider.Track className="bg-brand-surface-elevated border border-brand-border relative grow rounded-full h-2.5 overflow-hidden">
                    <Slider.Range className="absolute bg-brand-primary h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-6 h-6 bg-white border-2 border-brand-primary shadow-md rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-transform cursor-grab active:cursor-grabbing" />
                </Slider.Root>
              </div>

              {/* Years */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-brand-text-primary">
                    Years to Grow
                  </label>
                  <span className="text-sm font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-1 rounded-md border border-brand-secondary/20">
                    {years} Years
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[years]}
                  max={50}
                  min={1}
                  step={1}
                  onValueChange={(val) => setYears(val[0])}
                >
                  <Slider.Track className="bg-brand-surface-elevated border border-brand-border relative grow rounded-full h-2.5 overflow-hidden">
                    <Slider.Range className="absolute bg-brand-secondary h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-6 h-6 bg-white border-2 border-brand-secondary shadow-md rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 transition-transform cursor-grab active:cursor-grabbing" />
                </Slider.Root>
              </div>

              {/* Expected Return */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-brand-text-primary">
                    Expected Return
                  </label>
                  <span className="text-sm font-bold text-brand-warning bg-brand-warning/10 px-2 py-1 rounded-md border border-brand-warning/20">
                    {expectedReturn}%
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[expectedReturn]}
                  max={20}
                  min={0}
                  step={0.5}
                  onValueChange={(val) => setExpectedReturn(val[0])}
                >
                  <Slider.Track className="bg-brand-surface-elevated border border-brand-border relative grow rounded-full h-2.5 overflow-hidden">
                    <Slider.Range className="absolute bg-brand-warning h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-6 h-6 bg-white border-2 border-brand-warning shadow-md rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-warning/50 transition-transform cursor-grab active:cursor-grabbing" />
                </Slider.Root>
              </div>
            </div>
          </Card>

          {/* 3D Canvas Container */}
          <Card variant="elevated" className="flex-1 relative min-h-[500px] w-full overflow-hidden p-0 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] border-brand-border">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className="absolute inset-0">
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
                    
                    {/* Use an explicit path or preset with Suspense */}
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
              </div>
            </ErrorBoundary>
            
            <div className="absolute bottom-6 right-6 text-xs text-brand-text-tertiary font-medium bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
              Drag to rotate • Scroll to zoom
            </div>
          </Card>
        </div>
      </Container>
    </PageLayout>
  );
}
