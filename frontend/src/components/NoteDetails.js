import { useNotesContext } from '../hooks/useNotesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import './NoteDetails.css';
import { useContext } from 'react';
import TokenContext from '../context/TokenContext';

import format from 'date-fns/format';
const NoteDetails = ({ note, onEdit }) => {
  const { dispatch } = useNotesContext();
  const { user } = useAuthContext();
  const {userToken} = useContext(TokenContext)

  const handleDeleteClick = async () => {
    if (!userToken) return;

    const response = await fetch(`/api/notes/${note._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_NOTE', payload: json });
    }
  };

  const handleBookmarkClick = async () => {
    if (!userToken) return;

    const updatedNote = { ...note, bookmarked: !note.bookmarked };

    const response = await fetch(`/api/notes/${note._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(updatedNote),
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_NOTE', payload: json });
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'MMMM d, yyyy h:mm a');
  };

  return (
    <div className="note-details" onClick={()=> onEdit(note)}>
      <h4>{note.title}</h4>
      <div className='text'>
      <p>{note.content}</p>
      </div>
      <p className="datetime">
        {formatDate(note.createdAt)}
      </p><div className='actions'>
        <span className="material-symbols-outlined delete" onClick={handleDeleteClick}>delete</span>
        <span className={`material-symbols-outlined bookmark ${note.bookmarked ? 'bookmarked' : ''}`} onClick={handleBookmarkClick}>star</span>
      </div>
    </div>
  );
};

export default NoteDetails;
