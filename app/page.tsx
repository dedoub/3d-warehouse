'use client'

import { useState, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { generatePackages } from '@/lib/data'
import { SelectionProvider, useSelection } from '@/lib/selection'
import { WarehouseConfig, DEFAULT_CONFIG } from '@/lib/config'
import Header from './components/Header'
import CargoTrackingPanel from './components/CargoTrackingPanel'
import DetailPanel from './components/DetailPanel'
import SceneEditor from './components/SceneEditor'

const WarehouseScene = dynamic(() => import('./components/WarehouseScene'), { ssr: false })

function LoadingScreen() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-ana-sky to-white">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-ana-blue border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-ana-dark font-medium">Loading 3D Cargo Management System...</p>
      </div>
    </div>
  )
}

function SelectionPanel() {
  const { selected, setSelected } = useSelection()
  if (!selected) return null
  return <DetailPanel selected={selected} onClose={() => setSelected(null)} />
}

function HomeContent() {
  const [activeWarehouse, setActiveWarehouse] = useState('warehouse-1')
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const [config, setConfig] = useState<WarehouseConfig>(DEFAULT_CONFIG)

  const packages = useMemo(() => generatePackages(config.packageCount), [config.packageCount])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header
        activeWarehouse={activeWarehouse}
        onWarehouseChange={setActiveWarehouse}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Suspense fallback={<LoadingScreen />}>
          <WarehouseScene packages={packages} activeWarehouse={activeWarehouse} config={config} />
        </Suspense>
      </div>

      {/* Scene Editor */}
      <SceneEditor config={config} onChange={setConfig} />

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-ana-soft-gray">
        <p className="text-xs text-ana-dark/80">
          <span className="font-semibold text-ana-blue">Controls:</span>{' '}
          Drag to rotate • Scroll to zoom • Right-click to pan • Click objects for details
        </p>
      </div>

      {/* Selection Detail Panel */}
      <SelectionPanel />

      {/* Cargo Tracking Panel */}
      <CargoTrackingPanel
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        packages={packages}
      />
    </div>
  )
}

export default function Home() {
  return (
    <SelectionProvider>
      <HomeContent />
    </SelectionProvider>
  )
}
