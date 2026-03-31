'use client'

import { WAREHOUSES } from '@/lib/data'

export default function Header({
  activeWarehouse,
  onWarehouseChange,
  onOpenTracking,
}: {
  activeWarehouse: string
  onWarehouseChange: (id: string) => void
  onOpenTracking: () => void
}) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-ana-soft-gray">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ana-blue flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-ana-dark font-semibold text-lg">3D Cargo Management System</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Warehouse buttons */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            {WAREHOUSES.map((wh) => (
              <button
                key={wh.id}
                onClick={() => onWarehouseChange(wh.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeWarehouse === wh.id
                    ? 'bg-white shadow-sm text-ana-blue'
                    : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                  activeWarehouse === wh.id ? 'bg-ana-blue' : 'bg-ana-blue/10'
                }`}>
                  <svg className={`w-3.5 h-3.5 transition-colors ${
                    activeWarehouse === wh.id ? 'text-white' : 'text-ana-blue'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span>{wh.name.split(' ')[0]} {wh.name.split(' ').slice(-1)}</span>
              </button>
            ))}
          </div>

          {/* Cargo tracking button */}
          <button
            onClick={onOpenTracking}
            className="flex items-center gap-2 px-4 py-2 bg-ana-blue text-white rounded-lg text-sm font-medium hover:bg-ana-blue/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Cargo Tracking
          </button>

          {/* Live status */}
          <div className="flex items-center gap-6 ml-2">
            <div className="h-10 w-px bg-ana-soft-gray" />
            <div className="text-right">
              <div className="text-xs text-ana-dark/60">Live Status</div>
              <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Operational
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
