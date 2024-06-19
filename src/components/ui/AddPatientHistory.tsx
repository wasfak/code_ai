"use client";

import {
  CreateHistorySchema,
  createHistorySchema,
} from "@/lib/validation/note";

import { History } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

import LoadingButton from "../LoadingButton";

interface AddEditPatientHistoryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  historyToEdit?: History;
  patientId: string;
}

type FieldNames = "notes" | "diagnosis" | "treatments";

const data: FieldNames[] = ["notes", "diagnosis", "treatments"];
export default function AddPatientHistory({
  open,
  setOpen,
  historyToEdit,
  patientId,
}: AddEditPatientHistoryProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  const form = useForm<CreateHistorySchema>({
    resolver: zodResolver(createHistorySchema),
    defaultValues: {
      diagnosis: historyToEdit?.diagnosis || "",
      notes: historyToEdit?.notes || "",
      treatments: historyToEdit?.treatments || "",
    },
  });

  async function onSubmit(input: CreateHistorySchema) {
    try {
      if (historyToEdit) {
        const response = await fetch("/api/history", {
          method: "PUT",
          body: JSON.stringify({ id: historyToEdit?.id, ...input }),
        });
        if (!response.ok) throw Error("status code " + response.status);
      } else {
        const response = await fetch("/api/history", {
          method: "POST",
          body: JSON.stringify({
            patientId,
            ...input,
          }),
        });

        if (!response.ok) throw Error("status code " + response.status);

        form.reset();
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteNote() {
    if (!historyToEdit) return;
    try {
      setDeleteInProgress(true);
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({ id: historyToEdit?.id }),
      });

      if (!response.ok) throw Error("status code " + response.status);

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="my-2 h-[100vh] w-full max-w-xl overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>
            {historyToEdit ? "Edit History" : "Add History"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {data.map((item, i) => (
              <FormField
                key={i}
                control={form.control}
                name={item}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item}</FormLabel>
                    <FormControl>
                      <Input placeholder={item} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <DialogFooter className="gap-1 sm:gap-0">
              {historyToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete History
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
