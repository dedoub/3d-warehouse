'use client'

import { Selection } from '@/lib/selection'
import { STATUS_COLORS } from '@/lib/data'

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS['in-warehouse']
  const label = status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    priority: 'bg-red-50 text-red-700',
    express: 'bg-amber-50 text-amber-700',
    standard: 'bg-gray-50 text-gray-700',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors] || colors.standard}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

function CargoDetails({ data }: { data: Selection & { type: 'cargo' } }) {
  const pkg = data.data
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-ana-blue">{pkg.trackingNumber}</span>
        <PriorityBadge priority={pkg.priority} />
      </div>
      <StatusBadge status={pkg.status} />
      <div className="divide-y divide-gray-100">
        <InfoRow label="Description" value={pkg.description} />
        <InfoRow label="Weight" value={`${pkg.weight} kg`} />
        <InfoRow label="Destination" value={pkg.destination} />
        <InfoRow label="Flight" value={pkg.flight} />
        {pkg.shelfId && <InfoRow label="Shelf" value={pkg.shelfId} />}
        {pkg.uldId && <InfoRow label="ULD" value={pkg.uldId} />}
      </div>
    </div>
  )
}

function ShelfDetails({ data }: { data: Selection & { type: 'shelf' } }) {
  const { rackIndex, packages, totalWeight } = data.data
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-semibold text-purple-700">{packages.length}</div>
          <div className="text-xs text-purple-600">Packages</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-semibold text-blue-700">{totalWeight.toFixed(1)}</div>
          <div className="text-xs text-blue-600">kg Total</div>
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-gray-500 uppercase">Stored Items</p>
        {packages.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Empty rack</p>
        ) : (
          packages.map(pkg => (
            <div key={pkg.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <div>
                <span className="font-mono text-xs font-medium text-ana-blue">{pkg.trackingNumber}</span>
                <p className="text-xs text-gray-500">{pkg.description}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-600">{pkg.weight} kg</span>
                <p className="text-xs text-gray-400">→ {pkg.destination.split(',')[0]}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function TruckDetails({ data }: { data: Selection & { type: 'truck' } }) {
  const { packages, totalWeight, hasCargo } = data.data
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-semibold text-amber-700">{packages.length}</div>
          <div className="text-xs text-amber-600">Packages</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-semibold text-blue-700">{totalWeight.toFixed(1)}</div>
          <div className="text-xs text-blue-600">kg Total</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${hasCargo ? 'bg-green-500' : 'bg-gray-300'}`} />
        <span className="text-sm">{hasCargo ? 'Cargo Loaded' : 'Empty'}</span>
      </div>
      {packages.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase">Manifest</p>
          {packages.map(pkg => (
            <div key={pkg.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <div>
                <span className="font-mono text-xs font-medium text-ana-blue">{pkg.trackingNumber}</span>
                <p className="text-xs text-gray-500">{pkg.description}</p>
              </div>
              <PriorityBadge priority={pkg.priority} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ULDDetails({ data }: { data: Selection & { type: 'uld' } }) {
  const { uldId, packages, totalWeight, fillLevel } = data.data
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <div className="text-lg font-semibold text-green-700">{packages.length}</div>
          <div className="text-xs text-green-600">Items</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <div className="text-lg font-semibold text-blue-700">{totalWeight.toFixed(0)}</div>
          <div className="text-xs text-blue-600">kg</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 text-center">
          <div className="text-lg font-semibold text-purple-700">{Math.round(fillLevel * 100)}%</div>
          <div className="text-xs text-purple-600">Full</div>
        </div>
      </div>
      {/* Fill bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Fill Level</span>
          <span>{Math.round(fillLevel * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${fillLevel * 100}%` }}
          />
        </div>
      </div>
      {packages.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase">Loaded Cargo</p>
          {packages.map(pkg => (
            <div key={pkg.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <div>
                <span className="font-mono text-xs font-medium text-ana-blue">{pkg.trackingNumber}</span>
                <p className="text-xs text-gray-500">{pkg.description}</p>
              </div>
              <span className="text-xs text-gray-600">{pkg.weight} kg</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const TITLES: Record<string, string> = {
  cargo: 'Package Details',
  shelf: 'Shelf Information',
  truck: 'Truck Manifest',
  uld: 'ULD Container',
}

export default function DetailPanel({ selected, onClose }: { selected: Selection; onClose: () => void }) {
  const subtitle = selected.type === 'uld'
    ? (selected as Selection & { type: 'uld' }).data.uldId
    : selected.type === 'shelf'
    ? `Rack ${(selected as Selection & { type: 'shelf' }).data.rackIndex + 1}`
    : selected.type === 'cargo'
    ? (selected as Selection & { type: 'cargo' }).data.trackingNumber
    : selected.id

  return (
    <div className="absolute right-4 top-20 z-20 w-80 bg-white rounded-xl shadow-2xl border border-ana-soft-gray overflow-hidden animate-in slide-in-from-right-5 duration-300">
      {/* Header */}
      <div className="bg-ana-blue px-4 py-3 flex justify-between items-center">
        <div>
          <p className="text-white/70 text-xs uppercase tracking-wide">{TITLES[selected.type]}</p>
          <h3 className="text-white font-semibold">{subtitle}</h3>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {selected.type === 'cargo' && <CargoDetails data={selected as Selection & { type: 'cargo' }} />}
        {selected.type === 'shelf' && <ShelfDetails data={selected as Selection & { type: 'shelf' }} />}
        {selected.type === 'truck' && <TruckDetails data={selected as Selection & { type: 'truck' }} />}
        {selected.type === 'uld' && <ULDDetails data={selected as Selection & { type: 'uld' }} />}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Click elsewhere to dismiss</p>
      </div>
    </div>
  )
}
