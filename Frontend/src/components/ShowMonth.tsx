import { useState } from 'react'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store'
import type { Event } from '@/Types/Event'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import EditButton from './form/Update'
import DeleteEvent from './DeleteButton'


type GroupedEvents = {
  [monthYear: string]: {
    monthYearLabel: string
    ingresosTotal: number
    egresosTotal: number
    events: Event[]
  }
}

function useGroupedEvents(): GroupedEvents {
  const events = useSelector((state: RootState) => state.counters.events)
  const grouped: GroupedEvents = {}

  events.forEach(event => {
    const date = dayjs(event.Fecha, 'YYYY-MM-DD')
    const key = date.format('YYYY-MM')
    let label = date.format('MMMM YYYY')
    label = label.charAt(0).toUpperCase() + label.slice(1)

    if (!grouped[key]) {
      grouped[key] = {
        monthYearLabel: label,
        ingresosTotal: 0,
        egresosTotal: 0,
        events: [],
      }
    }

    grouped[key].events.push(event)

    if (event.Tipo === 'Ingreso') {
      grouped[key].ingresosTotal += event.Cantidad
    } else if (event.Tipo === 'Egreso') {
      grouped[key].egresosTotal += event.Cantidad
    }
  })

  return grouped
}

export default function EventsByMonth() {
  const grouped = useGroupedEvents()
  const [expandedMonths, setExpandedMonths] = useState<string[]>([])
  const [balanceInicial, setBalanceInicial] = useState(0)

  function toggleMonth(key: string) {
    setExpandedMonths(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }


  const sortedKeys = Object.keys(grouped).sort()


  const balanceMensualAcumulado: { [key: string]: number } = {}
  let balanceGlobal = balanceInicial

  sortedKeys.forEach(key => {
    const month = grouped[key]
    const balanceMes = month.ingresosTotal - month.egresosTotal
    balanceGlobal += balanceMes
    balanceMensualAcumulado[key] = balanceGlobal
  })

  return (
    <div>
      <div className="mb-6">
        <label className="block font-semibold mb-1">Balance Inicial:</label>
        <input
          type="number"
          value={balanceInicial}
          onChange={(e) => setBalanceInicial(Number(e.target.value))}
          className="border rounded px-2 py-1 w-40"
          placeholder="$0.00"
        />
      </div>

      {sortedKeys.map(key => {
        const monthData = grouped[key]
        const balanceMes = monthData.ingresosTotal - monthData.egresosTotal
        const balanceAcumulado = balanceMensualAcumulado[key]

        return (
          <div key={key} className="mb-6 border rounded p-4 shadow">
            <div
              onClick={() => toggleMonth(key)}
              className="cursor-pointer flex justify-between items-center"
            >
              <h2 className="text-xl font-bold">{monthData.monthYearLabel}</h2>
              <div className="flex gap-4 items-center">
                <div className="flex items-center text-green-600">
                  <IconArrowUp size={20} />
                  <span className="ml-1 font-semibold">${monthData.ingresosTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center text-red-600">
                  <IconArrowDown size={20} />
                  <span className="ml-1 font-semibold">${monthData.egresosTotal.toFixed(2)}</span>
                </div>
                <div
                  className={`ml-4 font-bold ${
                    balanceMes >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  Balance: ${balanceMes.toFixed(2)}
                </div>
              </div>
            </div>

            {expandedMonths.includes(key) && (
              <ul className="mt-4 space-y-2">
                {monthData.events.map(event => (
                  <li
                    key={event.id}
                    className="p-2 border rounded hover:bg-gray-100 flex justify-between items-center"
                    data-tooltip-id={`desc-${event.id}`}
                    data-tooltip-content={event.description || 'Sin descripción'}
                  >
                    <div>
                      <strong>{event.name}</strong>
                    </div>
                    <div className="text-sm text-gray-600">{dayjs(event.Fecha).format('DD/MM/YYYY')}</div>
                    <div className="font-semibold">
                      {event.Tipo === 'Egreso' ? '-' : ''}
                      ${event.Cantidad.toFixed(2)}
                    </div>
                    <div>
                      {event.Tipo === 'Ingreso' ? (
                        <span className="text-green-600 font-bold">Ingreso</span>
                      ) : (
                        <span className="text-red-600 font-bold">Egreso</span>
                      )}
                    </div>
                    <EditButton eventId={event.id} />
                    <DeleteEvent data={event}/>
                    <Tooltip id={`desc-${event.id}`} place="top" />
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-2 font-semibold">
              Balance Global acumulado: ${balanceAcumulado.toFixed(2)}
            </div>
          </div>
        )
      })}

      <div className="mt-6 p-4 border-t font-bold text-lg">
        Balance Total Global: ${balanceMensualAcumulado[sortedKeys[sortedKeys.length - 1]]?.toFixed(2) ?? balanceInicial.toFixed(2)}
      </div>
    </div>
  )
}