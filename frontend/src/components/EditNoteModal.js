// EditNoteModal.js
import { useState, useContext } from 'react';
import { useNotesContext } from '../hooks/useNotesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import './EditNoteModal.css';
import TokenContext from '../context/TokenContext';

const EditNoteModal = ({ note, onClose }) => {
  const { dispatch } = useNotesContext();
  const { user } = useAuthContext();
  const {userToken} = useContext(TokenContext)

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userToken) return;

    const updatedNote = { ...note, title, content };

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
      onClose();
    }
  };

  return (
    <div className="edit-note-modal-overlay">
      <div className="edit-note-modal-container">
        <button className="close-button" onClick={onClose}>X</button>
        <form className="edit-note-form" onSubmit={handleSubmit}>
          <label>Note Title:</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal;
