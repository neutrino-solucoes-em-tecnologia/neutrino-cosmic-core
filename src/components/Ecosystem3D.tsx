import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import * as THREE from 'three';

interface Company {
  name: string;
  description: string;
  color: string;
  position: [number, number, number];
  url?: string;
}

const companies: Company[] = [
  {
    name: 'Boson Rewards',
    description: 'Programa de fidelidade e recompensas',
    color: '#B9A44C',
    position: [3, 0, 0],
  },
  {
    name: 'Photon Media',
    description: 'Soluções em mídia e comunicação',
    color: '#6A00F4',
    position: [2.5, 2, 0],
  },
  {
    name: 'Graviton Bank',
    description: 'Tecnologia financeira e banking',
    color: '#0C4767',
    position: [1, 2.8, 0],
  },
  {
    name: 'QuarkCode',
    description: 'Desenvolvimento de software',
    color: '#566E3D',
    position: [-1, 2.8, 0],
  },
  {
    name: 'Muon City',
    description: 'Smart cities e IoT',
    color: '#B9A44C',
    position: [-2.5, 2, 0],
  },
  {
    name: 'GluonPet',
    description: 'Tecnologia para pet care',
    color: '#6A00F4',
    position: [-3, 0, 0],
  },
  {
    name: 'Lepton Skin',
    description: 'Tecnologia para beleza e cosmética',
    color: '#0C4767',
    position: [-2.5, -2, 0],
  },
  {
    name: 'Tachyon Aroma',
    description: 'Tecnologia sensorial e aromaterapia',
    color: '#566E3D',
    position: [-1, -2.8, 0],
  },
  {
    name: 'Proton Motors',
    description: 'Mobilidade e veículos elétricos',
    color: '#B9A44C',
    position: [1, -2.8, 0],
  },
  {
    name: 'Quasar Home',
    description: 'Automação residencial',
    color: '#6A00F4',
    position: [2.5, -2, 0],
  },
  {
    name: 'Electron Commerce',
    description: 'E-commerce e marketplace',
    color: '#0C4767',
    position: [0, 0, 3],
  },
];

function Particle({ company, onClick }: { company: Company; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group position={company.position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={company.color}
          emissive={company.color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {hovered && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {company.name}
        </Text>
      )}
      
      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[Math.sqrt(company.position[0] ** 2 + company.position[1] ** 2 + company.position[2] ** 2), 0.01, 16, 100]} />
        <meshBasicMaterial color={company.color} opacity={0.2} transparent />
      </mesh>
    </group>
  );
}

function NucleusCore() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#0C4767"
          emissive="#0C4767"
          emissiveIntensity={1}
          metalness={1}
          roughness={0}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh scale={1.5}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#0C4767" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

export const Ecosystem3D = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <section id="ecosystem" className="relative py-32 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
          O Ecossistema Neutrino
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-inter mb-4">
          Explore as partículas que orbitam nosso núcleo tecnológico
        </p>
        <p className="text-sm text-muted-foreground font-inter">
          Clique e arraste para rotacionar • Role para dar zoom • Passe o mouse sobre as partículas
        </p>
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        <div className="h-[600px] rounded-2xl overflow-hidden bg-gradient-to-b from-background via-card to-background border border-border shadow-card">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <OrbitControls
              enablePan={false}
              minDistance={5}
              maxDistance={15}
              autoRotate
              autoRotateSpeed={0.5}
            />
            
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#B9A44C" />
            
            <NucleusCore />
            
            {companies.map((company) => (
              <Particle
                key={company.name}
                company={company}
                onClick={() => setSelectedCompany(company)}
              />
            ))}
          </Canvas>
        </div>

        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl p-6 shadow-glow max-w-md w-full mx-4"
          >
            <h3 className="text-2xl font-orbitron font-bold mb-2" style={{ color: selectedCompany.color }}>
              {selectedCompany.name}
            </h3>
            <p className="text-muted-foreground font-inter mb-4">
              {selectedCompany.description}
            </p>
            <button
              onClick={() => setSelectedCompany(null)}
              className="text-sm text-secondary hover:text-secondary-glow transition-colors font-inter"
            >
              Fechar
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
