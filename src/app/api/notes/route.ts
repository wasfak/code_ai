import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { noteIndex } from "@/lib/pinecone";
import { createNoteSchema, updateNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const parseResult = createNoteSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { note, description } = parseResult.data;

    const embedding = await getEmbeddingForNote(note || "", description || "");

    const patient = await prisma.$transaction(async (tx) => {
      const patient = await tx.note.create({
        data: {
          userId: userId,
          note,
          description,
        },
      });

      await noteIndex.upsert([
        {
          id: patient.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      console.log(patient);
      return patient;
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

/* export const PUT = async (req: Request) => {
  try {
    const body = await req.json();

    const parseResult = updatePatientSchema.safeParse(body);

    if (!parseResult.success) {
      console.log(parseResult.error);

      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      id,
      fullName,
      age,
      gender,
      phoneNumber,
      email,
      address,
      emergencyContacts,
      medicalHistories,
      psychiatricHistories,
      intakeAssessments,
      additionalNotes,
      medicalCondition,
    } = parseResult.data;

    const note = await prisma.patient.findUnique({ where: { id } });

    if (!note) {
      return NextResponse.json(
        { error: "no patient to modify" },
        { status: 500 },
      );
    }
    const embedding = await getEmbeddingForNote(
      fullName || "",
      age || "",
      gender || "",
      phoneNumber || "",
      email || "",
      address || "",
      emergencyContacts || "",
      medicalHistories || "",
      psychiatricHistories || "",
      intakeAssessments || "",
      additionalNotes || "",
      medicalCondition || "",
    );

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await prisma.patient.update({
        where: { id },
        data: {
          fullName,
          medicalCondition,
          age,
          gender,
          phoneNumber,
          email,
          address,
          emergencyContacts,
          medicalHistories,
          psychiatricHistories,
          intakeAssessments,
          additionalNotes,
        },
      });
      await noteIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return updatedNote;
    });
    return NextResponse.json({ success: "Server Error" }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};
 */
/* export const DELETE = async (req: Request) => {
  try {
    const body = await req.json();

    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return NextResponse.json({ error: "no note to modify" }, { status: 500 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({ where: { id } });
      await noteIndex.deleteOne(id);
    });

    return NextResponse.json({ message: "Note Deleted" }, { status: 200 });
  } catch (error) {
    console.log();
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};
 */

async function getEmbeddingForNote(note: string, description: string) {
  return getEmbedding(note + "\n\n" + description + "\n\n" ?? "");
}
