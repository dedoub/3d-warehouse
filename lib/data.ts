export type CargoStatus = 'on-truck' | 'unloading' | 'in-warehouse' | 'loading-to-uld' | 'on-uld' | 'delivered'
export type CargoPriority = 'standard' | 'express' | 'priority'

export interface CargoPackage {
  id: string
  trackingNumber: string
  description: string
  weight: number
  destination: string
  status: CargoStatus
  priority: CargoPriority
  flight: string
  shelfId?: string
  shelfRow?: number
  uldId?: string
}

export interface Warehouse {
  id: string
  name: string
  code: string
  status: 'active' | 'maintenance'
  location: string
}

export const WAREHOUSES: Warehouse[] = [
  { id: 'warehouse-1', name: 'Import Cargo Terminal', code: 'NRT-A1', status: 'active', location: 'Terminal West' },
  { id: 'warehouse-2', name: 'Export Cargo Terminal', code: 'NRT-A2', status: 'active', location: 'Terminal East' },
]

const DESTINATIONS = [
  'Tokyo, Japan', 'Los Angeles, USA', 'Singapore', 'Hong Kong',
  'Shanghai, China', 'Seoul, Korea', 'Bangkok, Thailand', 'Sydney, Australia',
  'Frankfurt, Germany', 'London, UK', 'Narita, Japan', 'San Francisco, USA',
  'Taipei, Taiwan', 'Manila, Philippines', 'Jakarta, Indonesia',
  'Kuala Lumpur, Malaysia', 'Ho Chi Minh, Vietnam', 'Mumbai, India',
  'Dubai, UAE', 'Amsterdam, Netherlands',
]

const DESCRIPTIONS = [
  'Electronic Components', 'Medical Supplies', 'Automotive Parts',
  'Fashion Apparel', 'Fresh Seafood', 'Pharmaceutical Products',
  'Industrial Machinery', 'Consumer Electronics', 'Aircraft Components',
  'Chemical Materials', 'Luxury Goods', 'Agricultural Products',
  'Scientific Equipment', 'Perishable Foods', 'Hazardous Materials',
]

const FLIGHTS = ['NH 101', 'NH 203', 'NH 305', 'NH 407', 'NH 509', 'NH 611', 'NH 713', 'NH 815']
const PRIORITIES: CargoPriority[] = ['standard', 'express', 'priority']
const STATUSES: CargoStatus[] = ['on-truck', 'unloading', 'in-warehouse', 'loading-to-uld', 'on-uld']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generatePackages(count: number): CargoPackage[] {
  return Array.from({ length: count }, (_, i) => {
    const status = pick(STATUSES)
    const pkg: CargoPackage = {
      id: `pkg-${i}`,
      trackingNumber: `ANA${String(100000 + Math.floor(Math.random() * 900000))}`,
      description: pick(DESCRIPTIONS),
      weight: Math.round((5 + Math.random() * 495) * 10) / 10,
      destination: pick(DESTINATIONS),
      status,
      priority: pick(PRIORITIES),
      flight: pick(FLIGHTS),
    }
    if (status === 'in-warehouse') {
      pkg.shelfId = `shelf-${Math.floor(Math.random() * 8)}`
      pkg.shelfRow = Math.floor(Math.random() * 4)
    }
    if (status === 'on-uld' || status === 'loading-to-uld') {
      pkg.uldId = `ULD-${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(Math.random() * 100)}`
    }
    return pkg
  })
}

export const STATUS_COLORS: Record<CargoStatus, { bg: string; text: string; dot: string }> = {
  'on-truck': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'unloading': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'in-warehouse': { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  'loading-to-uld': { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  'on-uld': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  'delivered': { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' },
}

export const FILTER_OPTIONS: Record<string, string> = {
  all: 'All Cargo',
  'on-truck': 'On Truck',
  'in-warehouse': 'In Warehouse',
  'on-uld': 'On ULD',
}
