import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import NoteModel from '../components/NoteModel';
import NoteCard from '../components/NoteCard';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  // State management
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [filteredNote, setFilteredNote] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [query, setQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Check if the user is logged in

  // Fetch notes if logged in
  useEffect(() => {
    if (isLoggedIn) fetchNotes();
  }, [isLoggedIn]);

  // Filter notes based on query
  useEffect(() => {
    setFilteredNote(
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, notes]);

  // Fetch notes from the API
  const fetchNotes = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/note', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotes(data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes. Please try again.');
    }
  };

  const closeModel = () => {
    setIsModelOpen(false);
    setCurrentNote(null);
  };

  const handleAddNoteClick = () => {
    if (!isLoggedIn) {
      toast.warning('Please log in or sign up to create a note.');
    } else {
      setIsModelOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Update login status
    toast.success('You have been logged out.');
  };

  // Render message when no notes are available
  const renderNoNotesMessage = () => (
    <div className="flex flex-col items-center justify-center">
      <FontAwesomeIcon icon={faClipboardList} className="mb-4 text-gray-400 text-6xl" />
      {isLoggedIn ? (
        <p className="text-xl text-gray-600 text-center">No Notes Available</p>
      ) : (
        <p className="text-lg text-gray-500 text-center">Log in to create your Note!</p>
      )}
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar setQuery={setQuery} clearNotes={() => setNotes([])} onLogout={handleLogout} />

      {/* Notes Grid */}
      <div
        className={`px-8 pt-4 ${
          filteredNote.length > 0
            ? 'grid grid-cols-1 md:grid-cols-3 gap-6'
            : 'grid place-items-center h-[calc(100vh-4rem)]'
        }`}
      >
        {filteredNote.length > 0 ? (
          filteredNote.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={(note) => {
                setCurrentNote(note);
                setIsModelOpen(true);
              }}
              deleteNote={async (id) => {
                try {
                  const response = await axios.delete(`http://localhost:5000/api/note/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                  });
                  if (response.data.success) {
                    toast.success('Note successfully deleted!');
                    fetchNotes();
                  }
                } catch (error) {
                  console.error('Error deleting note:', error);
                  toast.error('Failed to delete the note.');
                }
              }}
            />
          ))
        ) : (
          renderNoNotesMessage()
        )}
      </div>

      {/* Add Note Button */}
      <button
        onClick={handleAddNoteClick}
        className="fixed right-4 bottom-4 text-2xl bg-teal-500 text-white font-bold p-4 rounded-full"
      >
        +
      </button>

      {/* Note Model */}
      {isModelOpen && (
        <NoteModel
          closeModel={closeModel}
          addNote={async (title, description) => {
            try {
              const response = await axios.post(
                'http://localhost:5000/api/note/add',
                { title, description },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );
              if (response.data.success) {
                toast.success('Note added successfully!');
                fetchNotes();
                closeModel();
              }
            } catch (error) {
              console.error('Error adding note:', error);
              toast.error('Failed to add the note.');
            }
          }}
          currentNote={currentNote}
          editNote={async (id, title, description) => {
            try {
              const response = await axios.put(
                `http://localhost:5000/api/note/${id}`,
                { title, description },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );
              if (response.data.success) {
                toast.success('Note successfully updated!');
                fetchNotes();
                closeModel();
              }
            } catch (error) {
              console.error('Error editing note:', error);
              toast.error('Failed to update the note.');
            }
          }}
        />
      )}
    </div>
  );
};

export default Home;
