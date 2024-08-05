import { api } from '@/lib/axios'

export interface UpdateContact {
  contactId: string
  nome: string
  email: string
  telefone: string
}

export async function updateContact({
  contactId,
  nome,
  email,
  telefone,
}: UpdateContact) {
  await api.patch(`/contacts/${contactId}`, { nome, email, telefone })
}
