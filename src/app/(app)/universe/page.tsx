'use client';

import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Float, Stars, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrowRight, IconMapPin } from '@tabler/icons-react';
import { Card, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

function Building({ position, scale, color }: { position: [number, number, number], scale: [number, number, number], color: string }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

function InvestmentCity({ onClick, onPointerOver, onPointerOut, isActive }: { onClick: () => void, onPointerOver: (e: unknown) => void, onPointerOut: (e: unknown) => void, isActive: boolean }) {
  const group = useRef<THREE.Group>(null);
  const targetScale = isActive ? 1.1 : 1;
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, isActive ? 0.5 : 0, delta * 5);
    }
  });

  return (
    <group
      position={[-4, 0, -3]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      ref={group as any}
    >
      <Float speed={isActive ? 2 : 1} rotationIntensity={0.2} floatIntensity={0.5}>
        <Building position={[0, 1, 0]} scale={[1, 2, 1]} color={isActive ? '#3b82f6' : '#94a3b8'} />
        <Building position={[1, 0.75, 1]} scale={[1, 1.5, 1]} color={isActive ? '#60a5fa' : '#cbd5e1'} />
        <Building position={[-1, 1.25, 0.5]} scale={[1, 2.5, 1]} color={isActive ? '#2563eb' : '#64748b'} />
        <Text position={[0, 3.5, 0]} fontSize={0.6} color="white" anchorX="center" anchorY="middle">
          Investment City
        </Text>
      </Float>
    </group>
  );
}

function RetirementMountain({ onClick, onPointerOver, onPointerOut, isActive }: { onClick: () => void, onPointerOver: (e: unknown) => void, onPointerOut: (e: unknown) => void, isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = isActive ? 1.1 : 1;
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      meshRef.current.rotation.y += delta * (isActive ? 0.5 : 0.1);
    }
  });

  return (
    <group
      position={[4, 0, -4]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <Float speed={isActive ? 2 : 1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef as any} position={[0, 1.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[2, 3, 4]} />
          <meshStandardMaterial color={isActive ? '#10b981' : '#94a3b8'} roughness={0.8} />
        </mesh>
        <Text position={[0, 4, 0]} fontSize={0.6} color="white" anchorX="center" anchorY="middle">
          Retirement Peak
        </Text>
      </Float>
    </group>
  );
}

function DebtFreeValley({ onClick, onPointerOver, onPointerOut, isActive }: { onClick: () => void, onPointerOver: (e: unknown) => void, onPointerOut: (e: unknown) => void, isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = isActive ? 1.1 : 1;
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, isActive ? 0.5 : 0, delta * 5);
    }
  });

  return (
    <group
      position={[-3, 0, 3]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <Float speed={isActive ? 2 : 1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef as any} position={[0, 0.5, 0]} castShadow receiveShadow>
          <torusGeometry args={[1.5, 0.4, 16, 32]} />
          <meshStandardMaterial color={isActive ? '#f59e0b' : '#94a3b8'} roughness={0.4} metalness={0.6} />
        </mesh>
        <Text position={[0, 2.5, 0]} fontSize={0.6} color="white" anchorX="center" anchorY="middle">
          Debt-Free Valley
        </Text>
      </Float>
    </group>
  );
}

function EmergencyFundLake({ onClick, onPointerOver, onPointerOut, isActive }: { onClick: () => void, onPointerOver: (e: unknown) => void, onPointerOut: (e: unknown) => void, isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = isActive ? 1.1 : 1;
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      // Make it wave
      meshRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime) * 0.1 * (isActive ? 2 : 1);
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.1 * (isActive ? 2 : 1);
    }
  });

  return (
    <group
      position={[3, 0.1, 3]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <Float speed={isActive ? 2 : 1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef as any} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 2, 0.2, 32]} />
          <meshPhysicalMaterial 
            color={isActive ? '#06b6d4' : '#94a3b8'} 
            roughness={0.1} 
            metalness={0.1}
            transmission={0.8}
            thickness={0.5}
          />
        </mesh>
        <Text position={[0, 2, 0]} fontSize={0.6} color="white" anchorX="center" anchorY="middle">
          Emergency Fund
        </Text>
      </Float>
    </group>
  );
}

const REGIONS = {
  invest: {
    id: 'invest',
    title: 'Investment City',
    description: 'Build your wealth block by block. Explore stocks, mutual funds, and crypto.',
    color: 'bg-blue-500',
    link: '/learn/compound-interest'
  },
  retire: {
    id: 'retire',
    title: 'Retirement Peak',
    description: 'Plan for the long term. Secure your future and enjoy the view from the top.',
    color: 'bg-emerald-500',
    link: '/tools/retirement'
  },
  debt: {
    id: 'debt',
    title: 'Debt-Free Valley',
    description: 'Navigate your way out of loans and credit card debt into financial freedom.',
    color: 'bg-amber-500',
    link: '/tools/emi'
  },
  emergency: {
    id: 'emergency',
    title: 'Emergency Fund',
    description: 'Your safety net for unexpected rainy days. Keep it liquid, keep it safe.',
    color: 'bg-cyan-500',
    link: '/learn'
  }
};

export default function UniversePage() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const router = useRouter();

  const handlePointerOver = (id: string) => {
    document.body.style.cursor = 'pointer';
    setActiveRegion(id);
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
    setActiveRegion(null);
  };

  const handleNavigate = (link: string) => {
    router.push(link);
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full bg-[#0f172a] overflow-hidden rounded-[var(--radius-xl)] shadow-lg">
      {/* HUD overlay */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-h1 text-white flex items-center gap-3">
          <IconMapPin className="text-brand-primary" size={40} />
          Financial Universe
        </h1>
        <p className="text-brand-text-tertiary mt-2 text-lg">
          Explore your personalized financial roadmap
        </p>
      </div>

      <AnimatePresence>
        {activeRegion && REGIONS[activeRegion as keyof typeof REGIONS] && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute right-8 top-1/4 z-10 w-80"
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 text-white shadow-2xl">
              <div className={`w-12 h-12 rounded-full mb-4 ${REGIONS[activeRegion as keyof typeof REGIONS].color} flex items-center justify-center`}>
                <IconMapPin size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {REGIONS[activeRegion as keyof typeof REGIONS].title}
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {REGIONS[activeRegion as keyof typeof REGIONS].description}
              </p>
              <Button 
                variant="primary" 
                className="w-full justify-center shadow-lg hover:shadow-brand-primary/50 transition-shadow"
                onClick={() => handleNavigate(REGIONS[activeRegion as keyof typeof REGIONS].link)}
              >
                Explore Area
                <IconArrowRight size={18} className="ml-2" />
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white/70 shadow-lg">
        Tip: Drag to rotate, scroll to zoom. Click a region to explore.
      </div>

      {/* 3D Scene */}
      <Canvas shadows camera={{ position: [0, 8, 12], fov: 45 }}>
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 10, 30]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={1024}
        />
        
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {/* Regions */}
        <InvestmentCity 
          isActive={activeRegion === 'invest'} 
          onPointerOver={(e: unknown) => { (e as any).stopPropagation(); handlePointerOver('invest'); }} 
          onPointerOut={(e: unknown) => { (e as any).stopPropagation(); handlePointerOut(); }} 
          onClick={() => handleNavigate(REGIONS.invest.link)}
        />
        
        <RetirementMountain 
          isActive={activeRegion === 'retire'} 
          onPointerOver={(e: unknown) => { (e as any).stopPropagation(); handlePointerOver('retire'); }} 
          onPointerOut={(e: unknown) => { (e as any).stopPropagation(); handlePointerOut(); }} 
          onClick={() => handleNavigate(REGIONS.retire.link)}
        />
        
        <DebtFreeValley 
          isActive={activeRegion === 'debt'} 
          onPointerOver={(e: unknown) => { (e as any).stopPropagation(); handlePointerOver('debt'); }} 
          onPointerOut={(e: unknown) => { (e as any).stopPropagation(); handlePointerOut(); }} 
          onClick={() => handleNavigate(REGIONS.debt.link)}
        />
        
        <EmergencyFundLake 
          isActive={activeRegion === 'emergency'} 
          onPointerOver={(e: unknown) => { (e as any).stopPropagation(); handlePointerOver('emergency'); }} 
          onPointerOut={(e: unknown) => { (e as any).stopPropagation(); handlePointerOut(); }} 
          onClick={() => handleNavigate(REGIONS.emergency.link)}
        />

        {/* Base / Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]} receiveShadow>
          <ringGeometry args={[8, 8.2, 64]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.5} />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]} receiveShadow>
          <ringGeometry args={[12, 12.2, 64]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.3} />
        </mesh>

        <ContactShadows position={[0, -0.4, 0]} opacity={0.5} scale={20} blur={2} far={10} />
        
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.1}
          minDistance={8}
          maxDistance={25}
          autoRotate={!activeRegion}
          autoRotateSpeed={0.5}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
