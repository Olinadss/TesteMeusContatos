import { api } from '@/lib/axios'

export interface GetContactsResponse {
  id: string
  nome: string
  email: string
  telefone: string
  favorito: boolean
}

export async function getContacts() {
  const response = await api.get<GetContactsResponse[]>('/contacts')

  return response.data
}
