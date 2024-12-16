import { create } from 'zustand'

type State = {
  bearerToken: string,
  numeroConta: string,
  setBearerToken: (newToken: string) => void,
  setNumeroConta: (newToken: string) => void,
}

const useRochaBankStore = create<State>((set) => ({
  bearerToken: '',
  numeroConta: '',
  setBearerToken: (newToken: string) => set({ bearerToken: newToken }),
  setNumeroConta: (newNumeroConta: string) => set({ numeroConta: newNumeroConta }),
}))

export default useRochaBankStore