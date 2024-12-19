import { createContext, useReducer } from 'react';

// Create a Context for the Notes
export const NotesContext = createContext();

// Define the initial state for the notes
const initialState = {
  notes: []
};

// Reducer function to handle different actions
export const notesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTES': 
      return {
        ...state,
        notes: action.payload
      };
    case 'CREATE_NOTE':
      return {
        ...state,
        notes: [action.payload, ...state.notes]
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload._id)
      };
      case 'UPDATE_NOTE':
        return {
          ...state,
          notes: state.notes.map((note) =>
            note._id === action.payload._id ? action.payload : note
          )
        };
    default:
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
  }
};

// Context Provider component to wrap around the application
export const NotesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  return (
    <NotesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
};
