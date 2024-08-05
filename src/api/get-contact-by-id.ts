import { api } from '@/lib/axios'

import { GetContactsResponse } from './get-contacts'

export async function getContactById(id: string) {
  const response = await api.get<GetContactsResponse>(`/contacts/${id}`)

  return response.data
}
