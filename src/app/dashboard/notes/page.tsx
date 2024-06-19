import Note from "@/components/Note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Notes Page",
};

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) throw Error("no user id");

  const allNotes = await prisma.note.findMany({ where: { userId } });

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {allNotes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
      {allNotes.length === 0 && (
        <p className="font-extrabold text-white">No Notes Yet!!</p>
      )}
    </div>
  );
}
