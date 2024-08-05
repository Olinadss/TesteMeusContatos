import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createNewContacts } from '@/api/create-new-contact'
import { getContactById } from '@/api/get-contact-by-id'
import { updateContact } from '@/api/update-contact'
import { queryClient } from '@/lib/react.query'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

const createNewContactSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'E-mail é obrigatório' }),
  telefone: z.string(),
})

type CreateNewContactSchema = z.infer<typeof createNewContactSchema>

interface CreateNewContactProps {
  idContact: string
  setIdContact: Dispatch<SetStateAction<string>>
  onClose: () => void
}

export function CreateNewContact({
  idContact,
  setIdContact,
  onClose,
}: CreateNewContactProps) {
  const { data: contactById } = useQuery({
    queryKey: ['contact', idContact],
    queryFn: () => getContactById(idContact),
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<CreateNewContactSchema>({
    resolver: zodResolver(createNewContactSchema),
    values: {
      nome: contactById?.nome ?? '',
      email: contactById?.email ?? '',
      telefone: contactById?.telefone ?? '',
    },
  })

  const { mutateAsync: createNewContactFn } = useMutation({
    mutationFn: createNewContacts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      reset()
      onClose()
    },
  })

  const mutation = useMutation({
    mutationFn: updateContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })

  async function handleCreateNewContact(data: CreateNewContactSchema) {
    if (idContact) {
      onClose()
      mutation.mutate({
        contactId: idContact,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
      })
    } else {
      await createNewContactFn({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
      })
    }
  }

  function clearForms() {
    onClose()
    setIdContact('')
    reset()
  }

  return (
    <DialogContent>
      <DialogHeader>
        {idContact ? (
          <DialogTitle>Editar contato</DialogTitle>
        ) : (
          <DialogTitle>Criar novo contato</DialogTitle>
        )}
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleCreateNewContact)}>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Label className="w-1/4 text-right" htmlFor="name">
                Nome
              </Label>
              <Input
                className="w-3/4"
                id="name"
                placeholder="Nome"
                {...register('nome')}
              />
            </div>
            {errors.nome && (
              <p className="ml-[6.5rem] text-sm text-red-500">
                {errors.nome.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Label className="w-1/4 text-right" htmlFor="email">
                E-mail
              </Label>
              <Input
                className="w-3/4"
                id="email"
                placeholder="examplo@exemplo.com.br"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="ml-[6.5rem] text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Label className="w-1/4 text-right" htmlFor="phone">
                Telefone
              </Label>
              <Input
                className="w-3/4"
                id="phone"
                placeholder="11999999999"
                {...register('telefone')}
              />
            </div>
            {errors.telefone && (
              <p className="ml-[6.5rem] text-sm text-red-500">
                {errors.telefone.message}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={'ghost'} onClick={clearForms}>
              Cancelar
            </Button>
          </DialogClose>

          <Button type="submit" variant={'success'} disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
