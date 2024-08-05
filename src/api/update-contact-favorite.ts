import { api } from '@/lib/axios'

export interface UpdateContactFavorite {
  contactId: string
  favorito: boolean
}

export async function updateContactFavorite({
  contactId,
  favorito,
}: UpdateContactFavorite) {
  await api.patch(`/contacts/${contactId}`, { favorito })
}
