import { api } from './http'

export type Party = {
  id?: number
  name: string
  phone?: string
  address?: string
  hours?: string
  notes?: string
}

export const createParty = async (p: Party): Promise<Party> => {
  const { data } = await api.post('/api/parties', p)
  return data
}
