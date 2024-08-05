import { useMutation, useQuery } from '@tanstack/react-query'
import { Pencil, Plus, Search, Star } from 'lucide-react'
import { ChangeEvent, useState } from 'react'

import { getContacts } from '@/api/get-contacts'
import { updateContactFavorite } from '@/api/update-contact-favorite'
import { CreateNewContact } from '@/components/create-new-contact'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { queryClient } from '@/lib/react.query'

export function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [idContact, setIdContact] = useState<string>('')
  const [filterContact, setFilterContact] = useState('')

  const { data: result } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterContact(e.target.value)
  }

  const mutation = useMutation({
    mutationFn: updateContactFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })

  const handleFavoriteClick = (contactId: string, isFavorite: boolean) => {
    mutation.mutate({ contactId, favorito: !isFavorite })
  }

  function updateContact(id: string) {
    handleOpenDialog()
    setIdContact(id)
  }

  function handleOpenDialog() {
    setIsDialogOpen(true)
  }

  function handleCloseDialog() {
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex h-screen justify-center">
        <div className="flex w-[600px] flex-col">
          <Header />

          <div className="mt-4 flex gap-4">
            <Input
              startIcon={Search}
              value={filterContact}
              placeholder="Procurar contato"
              onChange={handleInputChange}
            />
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog}>
                <Plus />
              </Button>
            </DialogTrigger>
          </div>

          {result &&
            result
              .filter((contact) =>
                contact.nome
                  .toLowerCase()
                  .includes(filterContact.toLowerCase()),
              )
              .map((contact, index) => (
                <div
                  key={contact.id}
                  className="mt-4 flex h-12 w-full items-center justify-between gap-2 rounded-sm px-2 hover:bg-slate-200"
                >
                  {contact.nome}
                  <div className="flex gap-2">
                    <DialogTrigger asChild key={index}>
                      <Button
                        variant={'outline'}
                        size={'icon'}
                        onClick={() => updateContact(String(contact.id))}
                      >
                        <Pencil />
                      </Button>
                    </DialogTrigger>
                    <Button
                      variant={'outline'}
                      size={'icon'}
                      onClick={() =>
                        handleFavoriteClick(contact.id, contact.favorito)
                      }
                    >
                      {contact.favorito ? <Star fill="#f59e0b" /> : <Star />}
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <CreateNewContact
        idContact={idContact}
        setIdContact={setIdContact}
        onClose={handleCloseDialog}
      />
    </Dialog>
  )
}
