'use client'

import { useState, useMemo } from 'react'
import { CargoPackage, STATUS_COLORS, FILTER_OPTIONS } from '@/lib/data'

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

function PriorityDot({ priority }: { priority: string }) {
  if (priority === 'priority') return <span className="text-red-500 text-xs font-bold">●</span>
  if (priority === 'express') return <span className="text-amber-500 text-xs font-bold">●</span>
  return null
}

function PackageCard({ pkg }: { pkg: CargoPackage }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <PriorityDot priority={pkg.priority} />
          <span className="font-mono text-sm font-semibold text-ana-blue">{pkg.trackingNumber}</span>
        </div>
        <StatusBadge status={pkg.status} />
      </div>
      <p className="text-sm text-gray-700 mb-2">{pkg.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span>{pkg.weight} kg</span>
          <span>→ {pkg.destination}</span>
        </div>
        {pkg.shelfId && <span className="text-purple-600">Rack {(pkg.shelfRow ?? 0) + 1}</span>}
        {pkg.uldId && <span className="text-green-600">{pkg.uldId}</span>}
      </div>
    </div>
  )
}

function FilterButton({ label, count, isActive, onClick }: { label: string; count: number; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
        isActive ? 'bg-ana-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
        isActive ? 'bg-white/20' : 'bg-gray-200'
      }`}>
        {count}
      </span>
    </button>
  )
}

export default function CargoTrackingPanel({
  isOpen,
  onClose,
  packages,
}: {
  isOpen: boolean
  onClose: () => void
  packages: CargoPackage[]
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    let result = packages
    if (filter !== 'all') {
      if (filter === 'on-truck') result = result.filter(p => p.status === 'on-truck' || p.status === 'unloading')
      else if (filter === 'in-warehouse') result = result.filter(p => p.status === 'in-warehouse')
      else if (filter === 'on-uld') result = result.filter(p => p.status === 'on-uld' || p.status === 'loading-to-uld')
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.trackingNumber.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q)
      )
    }
    return result
  }, [packages, filter, search])

  const counts = useMemo(() => ({
    all: packages.length,
    'on-truck': packages.filter(p => p.status === 'on-truck' || p.status === 'unloading').length,
    'in-warehouse': packages.filter(p => p.status === 'in-warehouse').length,
    'on-uld': packages.filter(p => p.status === 'on-uld' || p.status === 'loading-to-uld').length,
  }), [packages])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-ana-blue px-4 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-white font-semibold text-lg">Cargo Tracking</h2>
            <p className="text-white/70 text-sm">{packages.length} packages in system</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tracking number, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ana-blue/20 focus:border-ana-blue"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto">
          {Object.entries(FILTER_OPTIONS).map(([key, label]) => (
            <FilterButton
              key={key}
              label={label}
              count={counts[key as keyof typeof counts]}
              isActive={filter === key}
              onClick={() => setFilter(key)}
            />
          ))}
        </div>

        {/* Package list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No packages found</p>
            </div>
          ) : (
            filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)
          )}
        </div>

        {/* Footer stats */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-amber-600">{counts['on-truck']}</div>
              <div className="text-xs text-gray-500">Incoming</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-purple-600">{counts['in-warehouse']}</div>
              <div className="text-xs text-gray-500">Stored</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">{counts['on-uld']}</div>
              <div className="text-xs text-gray-500">Outgoing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
