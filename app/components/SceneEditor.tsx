'use client'

import { useState } from 'react'
import { WarehouseConfig } from '@/lib/config'

function Slider({ label, value, onChange, min, max, step = 1, unit = '' }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit?: string
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-ana-blue font-medium">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-ana-blue" />
    </div>
  )
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono">{value}</span>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="w-7 h-7 rounded border border-gray-200 cursor-pointer" />
      </div>
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600">{label}</span>
      <button onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full transition-colors relative ${value ? 'bg-ana-blue' : 'bg-gray-300'}`}>
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${value ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
        {title}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-3 space-y-3">{children}</div>}
    </div>
  )
}

export default function SceneEditor({ config, onChange }: { config: WarehouseConfig; onChange: (c: WarehouseConfig) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  const update = <K extends keyof WarehouseConfig>(key: K, value: WarehouseConfig[K]) => {
    onChange({ ...config, [key]: value })
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-20 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-ana-soft-gray hover:bg-white transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4 text-ana-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-xs font-medium text-ana-dark">Edit Scene</span>
      </button>

      {/* Editor panel */}
      {isOpen && (
        <div className="absolute top-20 left-4 z-20 w-72 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-ana-soft-gray overflow-hidden">
          {/* Header */}
          <div className="bg-ana-blue px-4 py-2.5 flex justify-between items-center">
            <h3 className="text-white text-sm font-semibold">Scene Editor</h3>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 max-h-[65vh] overflow-y-auto space-y-1">
            <Section title="Building">
              <Slider label="Width" value={config.buildingWidth} onChange={v => update('buildingWidth', v)} min={20} max={60} unit="m" />
              <Slider label="Depth" value={config.buildingDepth} onChange={v => update('buildingDepth', v)} min={12} max={40} unit="m" />
              <Slider label="Height" value={config.buildingHeight} onChange={v => update('buildingHeight', v)} min={4} max={16} unit="m" />
              <Slider label="Wall Opacity" value={config.wallOpacity} onChange={v => update('wallOpacity', v)} min={0} max={1} step={0.1} />
              <Slider label="Roof Opacity" value={config.roofOpacity} onChange={v => update('roofOpacity', v)} min={0} max={1} step={0.1} />
            </Section>

            <Section title="Racks">
              <Slider label="Rows" value={config.rackRows} onChange={v => update('rackRows', v)} min={1} max={4} />
              <Slider label="Columns" value={config.rackCols} onChange={v => update('rackCols', v)} min={1} max={8} />
              <Slider label="Shelves / Rack" value={config.shelvesPerRack} onChange={v => update('shelvesPerRack', v)} min={2} max={6} />
              <Slider label="Spacing X" value={config.rackSpacingX} onChange={v => update('rackSpacingX', v)} min={3} max={10} unit="m" />
              <Slider label="Spacing Z" value={config.rackSpacingZ} onChange={v => update('rackSpacingZ', v)} min={4} max={14} unit="m" />
            </Section>

            <Section title="Vehicles" defaultOpen={false}>
              <Slider label="Trucks" value={config.truckCount} onChange={v => update('truckCount', v)} min={0} max={4} />
              <Slider label="Truck Spacing" value={config.truckSpacing} onChange={v => update('truckSpacing', v)} min={5} max={12} unit="m" />
              <Toggle label="Show Conveyors" value={config.showConveyors} onChange={v => update('showConveyors', v)} />
              <Slider label="ULD Spacing" value={config.uldSpacing} onChange={v => update('uldSpacing', v)} min={2} max={5} unit="m" />
            </Section>

            <Section title="Colors" defaultOpen={false}>
              <ColorPicker label="Floor" value={config.floorColor} onChange={v => update('floorColor', v)} />
              <ColorPicker label="Walls" value={config.wallColor} onChange={v => update('wallColor', v)} />
              <ColorPicker label="Racks" value={config.rackColor} onChange={v => update('rackColor', v)} />
              <ColorPicker label="Standard Cargo" value={config.cargoStandard} onChange={v => update('cargoStandard', v)} />
              <ColorPicker label="Express Cargo" value={config.cargoExpress} onChange={v => update('cargoExpress', v)} />
              <ColorPicker label="Priority Cargo" value={config.cargoPriority} onChange={v => update('cargoPriority', v)} />
            </Section>

            <Section title="Data" defaultOpen={false}>
              <Slider label="Package Count" value={config.packageCount} onChange={v => update('packageCount', v)} min={5} max={100} />
            </Section>
          </div>
        </div>
      )}
    </>
  )
}
