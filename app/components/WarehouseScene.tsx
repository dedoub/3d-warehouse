'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { CargoPackage } from '@/lib/data'
import { useMemo } from 'react'
import * as THREE from 'three'

// Floor
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[60, 40]} />
      <meshStandardMaterial color="#e8ecf0" />
    </mesh>
  )
}

// Warehouse building shell
function WarehouseBuilding() {
  return (
    <group>
      {/* Floor slab */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[40, 0.2, 24]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 4, -12]} castShadow>
        <boxGeometry args={[40, 8, 0.3]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.6} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-20, 4, 0]} castShadow>
        <boxGeometry args={[0.3, 8, 24]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.4} />
      </mesh>

      {/* Right wall */}
      <mesh position={[20, 4, 0]} castShadow>
        <boxGeometry args={[0.3, 8, 24]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.4} />
      </mesh>

      {/* Roof beams */}
      {[-15, -5, 5, 15].map((x) => (
        <mesh key={x} position={[x, 8, 0]} castShadow>
          <boxGeometry args={[0.4, 0.6, 24]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      ))}

      {/* Roof */}
      <mesh position={[0, 8.3, 0]}>
        <boxGeometry args={[40, 0.15, 24]} />
        <meshStandardMaterial color="#475569" transparent opacity={0.3} />
      </mesh>

      {/* Floor markings - lanes */}
      {[-8, 0, 8].map((z) => (
        <mesh key={z} position={[0, 0.11, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[38, 0.15]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      ))}
    </group>
  )
}

// Storage rack
function Rack({ position, packages }: { position: [number, number, number]; packages: CargoPackage[] }) {
  const shelfCount = 4

  return (
    <group position={position}>
      {/* Rack frame - vertical posts */}
      {[[-1.2, 0, -0.4], [1.2, 0, -0.4], [-1.2, 0, 0.4], [1.2, 0, 0.4]].map(([x, , z], i) => (
        <mesh key={i} position={[x, 2, z]} castShadow>
          <boxGeometry args={[0.08, 4, 0.08]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
      ))}

      {/* Shelves */}
      {Array.from({ length: shelfCount }, (_, row) => (
        <mesh key={row} position={[0, row * 1 + 0.5, 0]} castShadow>
          <boxGeometry args={[2.5, 0.06, 1]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
      ))}

      {/* Cargo boxes on shelves */}
      {packages.slice(0, shelfCount * 2).map((pkg, i) => {
        const row = Math.floor(i / 2)
        const col = i % 2
        const color = pkg.priority === 'priority' ? '#ef4444' :
                      pkg.priority === 'express' ? '#f59e0b' : '#0072CE'
        return (
          <mesh
            key={pkg.id}
            position={[col * 1 - 0.5, row * 1 + 0.8, 0]}
            castShadow
          >
            <boxGeometry args={[0.8, 0.5, 0.6]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
      })}
    </group>
  )
}

// Truck
function Truck({ position, hasCargo }: { position: [number, number, number]; hasCargo: boolean }) {
  return (
    <group position={position}>
      {/* Cabin */}
      <mesh position={[-1.8, 1.2, 0]} castShadow>
        <boxGeometry args={[1.5, 1.6, 2]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      {/* Windshield */}
      <mesh position={[-2.56, 1.5, 0]}>
        <boxGeometry args={[0.05, 0.8, 1.4]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.7} />
      </mesh>
      {/* Container */}
      <mesh position={[0.7, 1.4, 0]} castShadow>
        <boxGeometry args={[3.5, 2, 2.2]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      {/* Wheels */}
      {[[-2, 0.3, 1.1], [-2, 0.3, -1.1], [1.5, 0.3, 1.1], [1.5, 0.3, -1.1]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}
      {/* Cargo indicator */}
      {hasCargo && (
        <mesh position={[0.7, 2.6, 0]}>
          <boxGeometry args={[2.8, 0.3, 1.8]} />
          <meshStandardMaterial color="#f59e0b" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}

// ULD Container
function ULDContainer({ position, id, packageCount }: { position: [number, number, number]; id: string; packageCount: number }) {
  const fillLevel = Math.min(packageCount / 5, 1)

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[2, 0.15, 1.5]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      {/* Container walls (wireframe-like) */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[1.8, 1.5, 1.3]} />
        <meshStandardMaterial color="#d1d5db" transparent opacity={0.3} wireframe />
      </mesh>
      {/* Fill level */}
      {fillLevel > 0 && (
        <mesh position={[0, 0.2 + fillLevel * 0.6, 0]}>
          <boxGeometry args={[1.6, fillLevel * 1.2, 1.1]} />
          <meshStandardMaterial color="#22c55e" transparent opacity={0.4} />
        </mesh>
      )}
      {/* Label */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.8, 0.25, 0.01]} />
        <meshStandardMaterial color="#0072CE" />
      </mesh>
    </group>
  )
}

// Conveyor belt
function Conveyor({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const length = Math.sqrt(
    (end[0] - start[0]) ** 2 + (end[2] - start[2]) ** 2
  )
  const midX = (start[0] + end[0]) / 2
  const midZ = (start[2] + end[2]) / 2
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0])

  return (
    <group position={[midX, start[1], midZ]} rotation={[0, -angle, 0]}>
      {/* Belt */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[length, 0.1, 0.6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Rollers */}
      {Array.from({ length: Math.floor(length / 0.5) }, (_, i) => (
        <mesh key={i} position={[i * 0.5 - length / 2 + 0.25, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.55, 8]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
      ))}
      {/* Side rails */}
      <mesh position={[0, 0.06, 0.32]}>
        <boxGeometry args={[length, 0.12, 0.04]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <mesh position={[0, 0.06, -0.32]}>
        <boxGeometry args={[length, 0.12, 0.04]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
    </group>
  )
}

export default function WarehouseScene({ packages, activeWarehouse }: { packages: CargoPackage[]; activeWarehouse: string }) {
  const warehousePackages = useMemo(() => packages.filter(p => p.status === 'in-warehouse'), [packages])
  const truckPackages = useMemo(() => packages.filter(p => p.status === 'on-truck'), [packages])
  const uldPackages = useMemo(() => packages.filter(p => p.status === 'on-uld' || p.status === 'loading-to-uld'), [packages])

  // Group ULD packages by ULD ID
  const uldGroups = useMemo(() => {
    const groups: Record<string, CargoPackage[]> = {}
    uldPackages.forEach(p => {
      const id = p.uldId || 'unknown'
      if (!groups[id]) groups[id] = []
      groups[id].push(p)
    })
    return Object.entries(groups).slice(0, 4)
  }, [uldPackages])

  // Split warehouse packages across racks
  const rackData = useMemo(() => {
    const racks: CargoPackage[][] = Array.from({ length: 8 }, () => [])
    warehousePackages.forEach((p, i) => {
      racks[i % 8].push(p)
    })
    return racks
  }, [warehousePackages])

  const offset = activeWarehouse === 'warehouse-2' ? 50 : 0

  return (
    <Canvas shadows style={{ background: 'linear-gradient(to bottom, #E8F4FD, #ffffff)' }}>
      <PerspectiveCamera makeDefault position={[25 + offset, 18, 25]} fov={50} />
      <OrbitControls
        target={[offset, 2, 0]}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={10}
        maxDistance={50}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight args={[new THREE.Color('#87CEEB'), new THREE.Color('#e8ecf0'), 0.3]} />

      <group position={[offset, 0, 0]}>
        <Floor />
        <WarehouseBuilding />

        {/* Storage racks - 2 rows of 4 */}
        {rackData.map((pkgs, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          return (
            <Rack
              key={i}
              position={[-12 + col * 6, 0, -4 + row * 8]}
              packages={pkgs}
            />
          )
        })}

        {/* Trucks at loading dock */}
        <Truck position={[-18, 0, 14]} hasCargo={truckPackages.length > 0} />
        <Truck position={[-10, 0, 14]} hasCargo={truckPackages.length > 2} />

        {/* Conveyor belts */}
        <Conveyor start={[-14, 0.5, 12]} end={[-14, 0.5, 4]} />
        <Conveyor start={[-6, 0.5, 12]} end={[-6, 0.5, 4]} />
        <Conveyor start={[6, 0.5, 4]} end={[14, 0.5, 4]} />

        {/* ULD containers at export area */}
        {uldGroups.map(([uldId, pkgs], i) => (
          <ULDContainer
            key={uldId}
            position={[10 + i * 3, 0, -8]}
            id={uldId}
            packageCount={pkgs.length}
          />
        ))}
      </group>

      <Environment preset="city" />
    </Canvas>
  )
}
