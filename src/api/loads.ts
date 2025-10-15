import { api } from './http'

export type Load = {
  id?: number
  internalLoadNo: string
  brokerId: number
  status?: string
}

export type LoadStop = {
  id?: number
  sequenceNo?: number
  type: 'PU' | 'DL'
  partyId: number
  windowStart?: string
  windowEnd?: string
  strictWindow?: boolean
}

export const createLoad = async (req: { internalLoadNo: string; brokerId: number }) => {
  const { data } = await api.post('/api/loads', req)
  return data as Load
}

export const addStops = async (loadId: number, stops: LoadStop[]) => {
  const { data } = await api.post(`/api/loads/${loadId}/stops`, stops)
  return data
}

export const updateStatus = async (loadId: number, status: string) => {
  const { data } = await api.patch(`/api/loads/${loadId}/status`, undefined, { params: { status } })
  return data
}
