import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/form/input'
import { useMutation, useQuery } from '@tanstack/react-query'
import { type CreateEvent, CreateEventSchema, type UpdateEvent} from '@/Types/Event'
import { useNavigate } from '@tanstack/react-router'
import { useEffect} from 'react'
import { DataRepo } from '@/API/datasource/index'
import { NumberInput, Textarea, Select  } from '@mantine/core'
import dayjs from 'dayjs'
import { z } from 'zod'
import { DatePickerInput, } from '@mantine/dates'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/app/store'
import { setFormField, resetFormDraft,setFormDraft} from '@/features/counters/Countersslice'
import type { ReactNode } from 'react'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
type RouteComponentProps = {
  children?: ReactNode
}
export const Route = createFileRoute('/From/$id')({
  component: RouteComponent,
})
function RouteComponent({ children }: RouteComponentProps) {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const form = useSelector((state: RootState) => state.counters.formDraft)

  const mode = !id || id === 'uuid' ? 'create' : 'update'

  const { data } = useQuery({
    enabled: mode === 'update',
    queryKey: ['Event', id],
    queryFn: () => DataRepo.getEventById(id),
  })

  useEffect(() => {
    if (mode === 'create') {
      dispatch(resetFormDraft())
    }
  }, [dispatch, mode])

  useEffect(() => {
    if (data) {
      dispatch(
        setFormDraft({
          id: data.id,
          name: data.name,
          description: data.description ?? '',
          Cantidad: data.Cantidad,
          Fecha: data.Fecha,
          Tipo: data.Tipo,
        })
      )
    }
  }, [data, dispatch])

  const { mutate, isPending } = useMutation<boolean, Error, CreateEvent>({
    mutationKey: ['event'],
    mutationFn: (values) => {
      if (mode === 'create') {
        return DataRepo.saveEvent(values)
      } else {
        return DataRepo.updateEvent({
          ...values,
          id: id,
        })
      }
    },
    onSettled: (_, error) => {
      if (error) {
        alert(`Error saving event: ${error.message}`)
      } else {
        if (mode === 'create') {
          alert('Event created successfully!')
        }
        if (mode === 'update') {
          alert('Event updated successfully!')
        }

        navigate({ to: '/FlujoDeBalance' })
      }
    },
  })

  const jsonString = JSON.stringify(form)
  console.log(jsonString)

  return (
    <form
      className="lex flex-col gap-4 p-4 max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault()
        submitForm()
      }}
    >
      <h1 className="text-2xl font-bold">Form</h1>
<div className="mb-3 p-2 border rounded bg-gray-100 text-gray-700">
        {form.id  || children || <em>Consultar el ID en los datos una vez creada la transacción </em>}
      </div>
      <Input
        type="text"
        placeholder="Ingresar el nombre de la tansacion"
        className="w-full"
        data-slot="input"
        label="Name"
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />

      <NumberInput
        type="text"
        label="Cantidad"
        placeholder="Ingresar al menos 0.01 ctvs"
        className=" text-base mt-5"
        data-slot="input"
        decimalScale={2}
        allowNegative={true}
        value={form.Cantidad}
        onChange={(value: string | number) =>
          handleChange('Cantidad', Number(value))
        }
      />

      <Select
        label="Tipo"
        data-slot="select"
        className="w-full"
        data={[
          { value: 'Ingreso', label: 'Ingreso' },
          { value: 'Egreso', label: 'Egreso' },
        ]}
        value={form.Tipo}
        onChange={(value) => {
          if (value !== null) {
            handleChange('Tipo', value)
          }
        }}
      />

      <DatePickerInput
        clearable
        defaultValue={dayjs().format('YYYY-MM-DD')}
        label="Pick date"
        placeholder="Pick date"
        value={form.Fecha}
        onChange={(val) => handleChange('Fecha', val ?? '')}
        valueFormat="YYYY-MM-DD"
      />



      <Textarea
        label="Editar descripción"
        placeholder="Descripción"
        value={form.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />

      <button
        className="mt-7 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        type="submit"
      >
        {isPending
          ? 'Saving..'
          : (mode === 'create' ? 'Create' : 'Update') + ' Event'}
      </button>
    </form>
  )

  function handleChange(field: keyof typeof form, value: string | number) {
    dispatch(setFormField({ field, value }))
  }

  function submitForm() {
    try {
      if (mode === 'create') {
        const forms = CreateEventSchema.parse({
          name: form.name,
          description: form.description,
          Cantidad: form.Cantidad,
          Fecha: form.Fecha,
          Tipo: form.Tipo,
        })
        mutate(forms)
      } else {
        if (!id && !form.id) {
          alert('ID inválido para actualización')
          return
        }

        const validated: UpdateEvent = {
          id: form.id || id,
          name: form.name ?? '',
          description: form.description ?? '',
          Cantidad: form.Cantidad ?? 0,
          Fecha: form.Fecha ?? '',
          Tipo: form.Tipo ?? '',
        }

        mutate(validated)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(
          `Error de validación: ${error.errors.map((e) => e.message).join(', ')}`
        )
      } else {
        alert('Error desconocido al validar')
      }
    }
  }
}
