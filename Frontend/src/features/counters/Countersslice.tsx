import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Event } from '@/Types/Event';
import { v4 as uuidv4 } from 'uuid';

const initialFormState: Partial<Event> = {
  id: '',
  name: '',
  description: '',
  Cantidad: 0,
  Fecha: '',
  Tipo: '',
}


const initialState: {
  events: Event[]
  form: Partial<Event>
  formDraft: Partial<Event>
} = {
  events: [],
  form: initialFormState,
  formDraft: initialFormState,
}

export const countersSlice = createSlice({
  name: 'counters',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Event>) => {
      state.events.push({
        ...action.payload,
        id: uuidv4(),
      })
    },
    updateTask: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(e => e.id === action.payload.id)
      if (index !== -1) {
        state.events[index] = action.payload
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload)
    },

 
    setForm: (state, action: PayloadAction<Partial<Event>>) => {
      state.form = action.payload
    },
    setFormField: (state, action: PayloadAction<{ field: keyof  Event; value: any }>) => {
      state.formDraft[action.payload.field] = action.payload.value
    },
    resetForm: (state) => {
      state.form = initialFormState
    },

   
    setFormDraft: (state, action: PayloadAction<Partial<Event>>) => {
      state.formDraft = action.payload
    },
    setFormDraftField: (state, action: PayloadAction<{ field: keyof Event; value: any }>) => {
      state.formDraft[action.payload.field] = action.payload.value
    },
    resetFormDraft: (state) => {
      state.formDraft = initialFormState
    },

    setEvents: (state, action: PayloadAction<Event[]>) => {
  if (JSON.stringify(state.events) !== JSON.stringify(action.payload)) {
    state.events = action.payload
  }
}

}})

export const {
  addTask,
  updateTask,
  deleteTask,
  setForm,
  setFormField,
  resetForm,
  setFormDraft,
  setFormDraftField,
  resetFormDraft,
  setEvents
} = countersSlice.actions

export default countersSlice.reducer
