import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'notes.json');

function readNotes() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeNotes(notes) {
  fs.writeFileSync(filePath, JSON.stringify({ notes }, null, 2));
}

export async function GET() {
  const data = readNotes();
  return NextResponse.json(data);
}

export async function POST(req) {
  const { title, content, isTodo } = await req.json();
  const data = readNotes();
  const newNote = { id: Date.now(), title, content, isTodo };
  data.notes.push(newNote);
  writeNotes(data.notes);
  return NextResponse.json(newNote);
}

export async function DELETE(req) {
  const { id } = await req.json();
  let data = readNotes();
  data.notes = data.notes.filter((note) => note.id !== id);
  writeNotes(data.notes);
  return NextResponse.json({ message: 'Note deleted' });
}

export async function PUT(req) {
  const { id, title, content, isTodo } = await req.json();
  let data = readNotes();
  const index = data.notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    data.notes[index] = { id, title, content, isTodo };
    writeNotes(data.notes);
  }
  return NextResponse.json(data.notes[index]);
}
