import { api } from '@/lib/axios'

export interface CreateContactsResponse {
  nome: string
  email: string
  telefone: string
}

export async function createNewContacts({
  nome,
  email,
  telefone,
}: CreateContactsResponse) {
  const response = await api.post<CreateContactsResponse>('/contacts', {
    nome,
    email,
    telefone,
  })

  return response.data
}
