"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import AddEditNoteDialog from "./ui/AddEditNoteDialog";
import { Note } from "@prisma/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface NoteProps {
  note: Note;
}

export default function NotePage({ note }: NoteProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const router = useRouter();
  const wasUpdated = note.updatedAt > note.createdAt;

  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();

  const handleEditButtonClick = () => {
    // Copy note description to clipboard
    navigator.clipboard.writeText(note.description).then(
      () => {
        alert("Text copied to clipboard successfully!");
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      },
    );
  };

  return (
    <>
      <Card className="h-32 w-full cursor-pointer md:h-64 lg:h-64">
        <CardHeader>
          <CardTitle className="capitalize">{note.note}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 whitespace-pre-line">{note.description}</p>
        </CardContent>
        <div className="flex w-full items-center justify-between p-2">
          <Button variant="destructive">Delete</Button>
          <Button onClick={handleEditButtonClick}>Copy</Button>
        </div>
      </Card>
      <AddEditNoteDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        noteToEdit={note}
      />
    </>
  );
}
