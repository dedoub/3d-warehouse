'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Html } from '@react-three/drei'
import { CargoPackage } from '@/lib/data'
import { useSelection } from '@/lib/selection'
import { useMemo, useState } from 'react'
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
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[40, 0.2, 24]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      <mesh position={[0, 4, -12]} castShadow>
        <boxGeometry args={[40, 8, 0.3]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-20, 4, 0]} castShadow>
        <boxGeometry args={[0.3, 8, 24]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.4} />
      </mesh>
      <mesh position={[20, 4, 0]} castShadow>
        <boxGeometry args={[0.3, 8, 24]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.4} />
      </mesh>
      {[-15, -5, 5, 15].map((x) => (
        <mesh key={x} position={[x, 8, 0]} castShadow>
          <boxGeometry args={[0.4, 0.6, 24]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      ))}
      <mesh position={[0, 8.3, 0]}>
        <boxGeometry args={[40, 0.15, 24]} />
        <meshStandardMaterial color="#475569" transparent opacity={0.3} />
      </mesh>
      {[-8, 0, 8].map((z) => (
        <mesh key={z} position={[0, 0.11, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[38, 0.15]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      ))}
    </group>
  )
}

// Interactive cargo box
function CargoBox({ pkg, position, size }: { pkg: CargoPackage; position: [number, number, number]; size: [number, number, number] }) {
  const { selected, setSelected } = useSelection()
  const [hovered, setHovered] = useState(false)
  const isSelected = selected?.type === 'cargo' && selected.id === pkg.id

  const color = pkg.priority === 'priority' ? '#ef4444' :
                pkg.priority === 'express' ? '#f59e0b' : '#0072CE'

  return (
    <group position={position}>
      <mesh
        castShadow
        onClick={(e) => {
          e.stopPropagation()
          setSelected({ type: 'cargo', id: pkg.id, data: pkg })
        }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>

      {/* Wireframe highlight */}
      {(hovered || isSelected) && (
        <mesh scale={[1.1, 1.1, 1.1]}>
          <boxGeometry args={size} />
          <meshBasicMaterial
            color={isSelected ? '#3B82F6' : '#60A5FA'}
            transparent
            opacity={isSelected ? 0.4 : 0.25}
            wireframe
          />
        </mesh>
      )}

      {/* Hover tooltip */}
      {hovered && !isSelected && (
        <Html position={[0, size[1] / 2 + 0.5, 0]} center distanceFactor={30}>
          <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none shadow-lg">
            Click for details
          </div>
        </Html>
      )}
    </group>
  )
}

// Storage rack with click interactions
function Rack({ position, packages, rackIndex }: { position: [number, number, number]; packages: CargoPackage[]; rackIndex: number }) {
  const { selected, setSelected } = useSelection()
  const [hovered, setHovered] = useState(false)
  const isSelected = selected?.type === 'shelf' && selected.id === `rack-${rackIndex}`
  const shelfCount = 4

  const handleRackClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setSelected({
      type: 'shelf',
      id: `rack-${rackIndex}`,
      data: {
        rackIndex,
        packages,
        totalWeight: packages.reduce((sum, p) => sum + p.weight, 0),
      },
    })
  }

  return (
    <group position={position}>
      {/* Rack frame - vertical posts */}
      {[[-1.2, 0, -0.4], [1.2, 0, -0.4], [-1.2, 0, 0.4], [1.2, 0, 0.4]].map(([x, , z], i) => (
        <mesh
          key={i}
          position={[x, 2, z]}
          castShadow
          onClick={handleRackClick}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        >
          <boxGeometry args={[0.08, 4, 0.08]} />
          <meshStandardMaterial color={hovered || isSelected ? '#3B82F6' : '#6b7280'} />
        </mesh>
      ))}

      {/* Shelves */}
      {Array.from({ length: shelfCount }, (_, row) => (
        <mesh
          key={row}
          position={[0, row * 1 + 0.5, 0]}
          castShadow
          onClick={handleRackClick}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        >
          <boxGeometry args={[2.5, 0.06, 1]} />
          <meshStandardMaterial color={hovered || isSelected ? '#93C5FD' : '#9ca3af'} />
        </mesh>
      ))}

      {/* Rack highlight wireframe */}
      {(hovered || isSelected) && (
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[2.8, 4.2, 1.2]} />
          <meshBasicMaterial
            color={isSelected ? '#3B82F6' : '#60A5FA'}
            transparent
            opacity={isSelected ? 0.15 : 0.1}
            wireframe
          />
        </mesh>
      )}

      {/* Hover tooltip */}
      {hovered && !isSelected && (
        <Html position={[0, 4.5, 0]} center distanceFactor={30}>
          <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none shadow-lg">
            Rack {rackIndex + 1} • {packages.length} items — Click to view
          </div>
        </Html>
      )}

      {/* Cargo boxes on shelves */}
      {packages.slice(0, shelfCount * 2).map((pkg, i) => {
        const row = Math.floor(i / 2)
        const col = i % 2
        return (
          <CargoBox
            key={pkg.id}
            pkg={pkg}
            position={[col * 1 - 0.5, row * 1 + 0.8, 0]}
            size={[0.8, 0.5, 0.6]}
          />
        )
      })}
    </group>
  )
}

// Truck with click interaction
function Truck({ position, hasCargo, truckId, packages }: {
  position: [number, number, number]
  hasCargo: boolean
  truckId: string
  packages: CargoPackage[]
}) {
  const { selected, setSelected } = useSelection()
  const [hovered, setHovered] = useState(false)
  const isSelected = selected?.type === 'truck' && selected.id === truckId

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setSelected({
      type: 'truck',
      id: truckId,
      data: {
        packages,
        totalWeight: packages.reduce((sum, p) => sum + p.weight, 0),
        hasCargo,
      },
    })
  }

  const pointerHandlers = {
    onClick: handleClick,
    onPointerOver: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' },
    onPointerOut: () => { setHovered(false); document.body.style.cursor = 'auto' },
  }

  return (
    <group position={position}>
      {/* Cabin */}
      <mesh position={[-1.8, 1.2, 0]} castShadow {...pointerHandlers}>
        <boxGeometry args={[1.5, 1.6, 2]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      {/* Windshield */}
      <mesh position={[-2.56, 1.5, 0]}>
        <boxGeometry args={[0.05, 0.8, 1.4]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.7} />
      </mesh>
      {/* Container */}
      <mesh position={[0.7, 1.4, 0]} castShadow {...pointerHandlers}>
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

      {/* Wireframe highlight */}
      {(hovered || isSelected) && (
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[5.5, 3, 2.5]} />
          <meshBasicMaterial
            color={isSelected ? '#3B82F6' : '#60A5FA'}
            transparent
            opacity={isSelected ? 0.3 : 0.2}
            wireframe
          />
        </mesh>
      )}

      {/* Hover tooltip */}
      {hovered && !isSelected && (
        <Html position={[0, 3.5, 0]} center distanceFactor={40}>
          <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none shadow-lg">
            Click to view manifest
          </div>
        </Html>
      )}
    </group>
  )
}

// ULD Container with click interaction
function ULDContainer({ position, id, packages }: {
  position: [number, number, number]
  id: string
  packages: CargoPackage[]
}) {
  const { selected, setSelected } = useSelection()
  const [hovered, setHovered] = useState(false)
  const isSelected = selected?.type === 'uld' && selected.id === id
  const fillLevel = Math.min(packages.length / 5, 1)

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setSelected({
      type: 'uld',
      id,
      data: {
        uldId: id,
        packages,
        totalWeight: packages.reduce((sum, p) => sum + p.weight, 0),
        fillLevel,
      },
    })
  }

  const pointerHandlers = {
    onClick: handleClick,
    onPointerOver: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' },
    onPointerOut: () => { setHovered(false); document.body.style.cursor = 'auto' },
  }

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]} castShadow {...pointerHandlers}>
        <boxGeometry args={[2, 0.15, 1.5]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      {/* Container walls */}
      <mesh position={[0, 0.9, 0]} castShadow {...pointerHandlers}>
        <boxGeometry args={[1.8, 1.5, 1.3]} />
        <meshStandardMaterial color="#d1d5db" transparent opacity={0.3} wireframe />
      </mesh>
      {/* Fill level */}
      {fillLevel > 0 && (
        <mesh position={[0, 0.2 + fillLevel * 0.6, 0]} {...pointerHandlers}>
          <boxGeometry args={[1.6, fillLevel * 1.2, 1.1]} />
          <meshStandardMaterial color="#22c55e" transparent opacity={0.4} />
        </mesh>
      )}
      {/* Label */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.8, 0.25, 0.01]} />
        <meshStandardMaterial color="#0072CE" />
      </mesh>

      {/* Wireframe highlight */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[2.2, 1.8, 1.7]} />
          <meshBasicMaterial
            color={isSelected ? '#3B82F6' : '#60A5FA'}
            transparent
            opacity={isSelected ? 0.3 : 0.2}
            wireframe
          />
        </mesh>
      )}

      {/* Hover tooltip */}
      {hovered && !isSelected && (
        <Html position={[0, 2.5, 0]} center distanceFactor={40}>
          <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none shadow-lg">
            {id} • {packages.length} items — Click to view
          </div>
        </Html>
      )}
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
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[length, 0.1, 0.6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {Array.from({ length: Math.floor(length / 0.5) }, (_, i) => (
        <mesh key={i} position={[i * 0.5 - length / 2 + 0.25, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.55, 8]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
      ))}
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
  const { setSelected } = useSelection()
  const warehousePackages = useMemo(() => packages.filter(p => p.status === 'in-warehouse'), [packages])
  const truckPackages = useMemo(() => packages.filter(p => p.status === 'on-truck'), [packages])
  const uldPackages = useMemo(() => packages.filter(p => p.status === 'on-uld' || p.status === 'loading-to-uld'), [packages])

  const uldGroups = useMemo(() => {
    const groups: Record<string, CargoPackage[]> = {}
    uldPackages.forEach(p => {
      const id = p.uldId || 'unknown'
      if (!groups[id]) groups[id] = []
      groups[id].push(p)
    })
    return Object.entries(groups).slice(0, 4)
  }, [uldPackages])

  const rackData = useMemo(() => {
    const racks: CargoPackage[][] = Array.from({ length: 8 }, () => [])
    warehousePackages.forEach((p, i) => {
      racks[i % 8].push(p)
    })
    return racks
  }, [warehousePackages])

  const offset = activeWarehouse === 'warehouse-2' ? 50 : 0

  // Split truck packages between two trucks
  const truck1Packages = useMemo(() => truckPackages.slice(0, Math.ceil(truckPackages.length / 2)), [truckPackages])
  const truck2Packages = useMemo(() => truckPackages.slice(Math.ceil(truckPackages.length / 2)), [truckPackages])

  return (
    <Canvas
      shadows
      style={{ background: 'linear-gradient(to bottom, #E8F4FD, #ffffff)' }}
      onPointerMissed={() => setSelected(null)}
    >
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

        {/* Storage racks */}
        {rackData.map((pkgs, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          return (
            <Rack
              key={i}
              position={[-12 + col * 6, 0, -4 + row * 8]}
              packages={pkgs}
              rackIndex={i}
            />
          )
        })}

        {/* Trucks */}
        <Truck position={[-18, 0, 14]} hasCargo={truck1Packages.length > 0} truckId="truck-1" packages={truck1Packages} />
        <Truck position={[-10, 0, 14]} hasCargo={truck2Packages.length > 0} truckId="truck-2" packages={truck2Packages} />

        {/* Conveyors */}
        <Conveyor start={[-14, 0.5, 12]} end={[-14, 0.5, 4]} />
        <Conveyor start={[-6, 0.5, 12]} end={[-6, 0.5, 4]} />
        <Conveyor start={[6, 0.5, 4]} end={[14, 0.5, 4]} />

        {/* ULD containers */}
        {uldGroups.map(([uldId, pkgs], i) => (
          <ULDContainer
            key={uldId}
            position={[10 + i * 3, 0, -8]}
            id={uldId}
            packages={pkgs}
          />
        ))}
      </group>

      <Environment preset="city" />
    </Canvas>
  )
}
