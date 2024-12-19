import { NotesContext } from "../context/NotesContext"
import { useContext } from "react"

export const useNotesContext = () => {
  const context = useContext(NotesContext)

  if(!context) {
    throw Error('useNotesContext must be used inside an NotesContextProvider')
  }

  return context
}