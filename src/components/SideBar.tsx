"use client";
import { Plus } from "lucide-react";

import { Button } from "./ui/button";
import AiChatButton from "./AiChatButton";
import { useState } from "react";
import AddEditNoteDialog from "./ui/AddEditNoteDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";

const butCss =
  "inline-flex text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2";

export default function SideBar() {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const path = usePathname();
  return (
    <div className="flex w-full flex-col items-center gap-y-4 border-r-2 p-4">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <Link
          href="/dashboard/notes"
          className={path === "/dashboard/notes" ? butCss : "text-white"}
        >
          Notes
        </Link>
      </div>
      <div className="flex flex-col gap-y-4">
        {" "}
        <Button onClick={() => setShowAddEditNoteDialog(true)}>
          <Plus size={20} className="mr-2" />
          Add Note
        </Button>
        <AiChatButton />
        <AddEditNoteDialog
          open={showAddEditNoteDialog}
          setOpen={setShowAddEditNoteDialog}
        />
      </div>
    </div>
  );
}
