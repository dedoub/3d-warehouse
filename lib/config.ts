export interface WarehouseConfig {
  // Warehouse building
  buildingWidth: number
  buildingDepth: number
  buildingHeight: number
  wallOpacity: number
  roofOpacity: number

  // Racks
  rackRows: number
  rackCols: number
  rackSpacingX: number
  rackSpacingZ: number
  shelvesPerRack: number
  rackStartX: number
  rackStartZ: number

  // Trucks
  truckCount: number
  truckStartX: number
  truckZ: number
  truckSpacing: number

  // Conveyors
  showConveyors: boolean

  // ULD
  uldStartX: number
  uldZ: number
  uldSpacing: number

  // Colors
  floorColor: string
  wallColor: string
  rackColor: string
  cargoStandard: string
  cargoExpress: string
  cargoPriority: string

  // Cargo count
  packageCount: number
}

export const DEFAULT_CONFIG: WarehouseConfig = {
  buildingWidth: 40,
  buildingDepth: 24,
  buildingHeight: 8,
  wallOpacity: 0.5,
  roofOpacity: 0.3,

  rackRows: 2,
  rackCols: 4,
  shelvesPerRack: 4,
  rackSpacingX: 6,
  rackSpacingZ: 8,
  rackStartX: -12,
  rackStartZ: -4,

  truckCount: 2,
  truckStartX: -18,
  truckZ: 14,
  truckSpacing: 8,

  showConveyors: true,

  uldStartX: 10,
  uldZ: -8,
  uldSpacing: 3,

  floorColor: '#d1d5db',
  wallColor: '#94a3b8',
  rackColor: '#6b7280',
  cargoStandard: '#0072CE',
  cargoExpress: '#f59e0b',
  cargoPriority: '#ef4444',

  packageCount: 30,
}
