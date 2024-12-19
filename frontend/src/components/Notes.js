import { useEffect, useState, useContext } from 'react';
import { useNotesContext } from "../hooks/useNotesContext";
// import { useAuthContext } from "../hooks/useAuthContext";
import TokenContext from '../context/TokenContext';

import './Notes.css';

// Components
import NoteDetails from './NoteDetails';
import NoteForm from './NoteForm';
import EditNoteModal from './EditNoteModal';

const Notes = () => {
  const {userToken} = useContext(TokenContext)
  const { notes, dispatch } = useNotesContext();
  // const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
     if (!userToken) return;

    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes', {
          headers: { 'Authorization': `Bearer ${userToken}` },
        });
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: 'SET_NOTES', payload: json });
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
    };

    fetchNotes();
  }, [ userToken]);

  const filteredNotes = notes ? notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBookmark = showBookmarks ? note.bookmarked : true;
    return matchesSearch && matchesBookmark;
  }) : [];

  return (
    <div className="home">
      <div className="top">
      <div className="search-bar">
          {/* <span className="material-symbols-outlined search-icon">search</span> */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => setShowBookmarks(!showBookmarks)}>
          {showBookmarks ? "Show All" : "Bookmarks"}
        </button>
        <button onClick={() => setShowNoteForm(true)}>+ New Note</button>
      </div>
      <div className="notes">
        {filteredNotes.map(note => (
          <NoteDetails key={note._id} note={note} onEdit={setSelectedNote} />
        ))}
      </div>
      {showNoteForm && (
        <div className="note-form-overlay">
          <div className="note-form-container">
            <button className="close-button" onClick={() => setShowNoteForm(false)}>X</button>
            <NoteForm />
          </div>
        </div>
      )}
      {selectedNote && (
        <EditNoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}
    </div>
  );
};

export default Notes;
