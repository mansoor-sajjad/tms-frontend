import { api } from './http'

export type Broker = {
  id?: number
  name: string
  billingEmail?: string
  updateEmail?: string
  phone?: string
  creditRating?: string
  paymentTerms?: string
  active?: boolean
}

export const listBrokers = async (): Promise<Broker[]> => {
  const { data } = await api.get('/api/brokers', { validateStatus: s => s === 200 || s === 404 })
  // if no GET-all endpoint, consider server not implemented; fallback to 404 -> []
  return Array.isArray(data) ? data : []
}

export const createBroker = async (b: Broker): Promise<Broker> => {
  const { data } = await api.post('/api/brokers', b)
  return data
}

export const getBroker = async (id: number): Promise<Broker> => {
  const { data } = await api.get(`/api/brokers/${id}`)
  return data
}
