'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { CargoPackage } from './data'

export type SelectionType = 'cargo' | 'shelf' | 'truck' | 'uld'

export interface CargoSelection {
  type: 'cargo'
  id: string
  data: CargoPackage
}

export interface ShelfSelection {
  type: 'shelf'
  id: string
  data: {
    rackIndex: number
    packages: CargoPackage[]
    totalWeight: number
  }
}

export interface TruckSelection {
  type: 'truck'
  id: string
  data: {
    packages: CargoPackage[]
    totalWeight: number
    hasCargo: boolean
  }
}

export interface ULDSelection {
  type: 'uld'
  id: string
  data: {
    uldId: string
    packages: CargoPackage[]
    totalWeight: number
    fillLevel: number
  }
}

export type Selection = CargoSelection | ShelfSelection | TruckSelection | ULDSelection

interface SelectionContextValue {
  selected: Selection | null
  setSelected: (s: Selection | null) => void
}

const SelectionContext = createContext<SelectionContextValue>({
  selected: null,
  setSelected: () => {},
})

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Selection | null>(null)
  return (
    <SelectionContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectionContext.Provider>
  )
}

export function useSelection() {
  return useContext(SelectionContext)
}
