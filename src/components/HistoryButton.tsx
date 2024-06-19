"use client";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

import AddPatientHistory from "./ui/AddPatientHistory";
import { History } from "@prisma/client";

type Prop = {
  patientId: string;
  history?: History;
};

export default function HistoryButton({ patientId, history }: Prop) {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowAddEditNoteDialog(true)}>
        <Plus size={20} className="mr-2" />
        Add History
      </Button>
      <AddPatientHistory
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
        patientId={patientId}
        historyToEdit={history}
      />
    </>
  );
}
