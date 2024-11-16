'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isTodo, setIsTodo] = useState(false);

  useEffect(() => {
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => setNotes(data.notes));
  }, []);

  const addNote = async () => {
    const newNote = { title, content, isTodo };
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    });
    const data = await res.json();
    setNotes([...notes, data]);
    setTitle('');
    setContent('');
    setIsTodo(false);
  };

  const deleteNote = async (id) => {
    await fetch('/api/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotes(notes.filter((note) => note.id !== id));
  };

  const toggleTodo = async (id) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      const updatedNote = { ...note, isTodo: !note.isTodo };
      await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      });
      setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
    }
  };

  return (
    <main className="flex flex-col items-center bg-gray-900 min-h-screen text-white p-4">
      <h1 className="text-3xl font-bold mb-4">My Notes</h1>

      <div className="w-full max-w-md">
        <input
          className="w-full p-2 mb-2 bg-gray-800 text-white border border-gray-700 rounded"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 mb-2 bg-gray-800 text-white border border-gray-700 rounded"
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isTodo}
            onChange={() => setIsTodo(!isTodo)}
            className="mr-2"
          />
          <label>Mark as Todo</label>
        </div>
        <button
          onClick={addNote}
          className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          Add Note
        </button>
      </div>

      <div className="w-full max-w-md mt-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-gray-800 mb-2 border border-gray-700 rounded"
          >
            <h2 className="text-xl font-bold">{note.title}</h2>
            <p>{note.content}</p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => toggleTodo(note.id)}
                className={`p-2 rounded ${note.isTodo ? 'bg-green-700' : 'bg-gray-700'}`}
              >
                {note.isTodo ? 'Todo' : 'Note'}
              </button>
              <button
                onClick={() => deleteNote(note.id)}
                className="p-2 bg-red-700 hover:bg-red-600 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
