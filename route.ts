import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { noteIndex } from "@/lib/pinecone";
import { createPatientSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const parseResult = createPatientSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(parseResult.data);

    const {
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

    const patient = await prisma.$transaction(async (tx) => {
      const patient = await tx.patient.create({
        data: {
          userId: userId,
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
          id: patient.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return patient;
    });

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

/* export const PUT = async (req: Request) => {
  try {
    const body = await req.json();

    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.log(parseResult.error);

      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, content } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return NextResponse.json({ error: "no note to modify" }, { status: 500 });
    }
    const embedding = await getEmbeddingForNote(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await prisma.note.update({
        where: { id },
        data: {
          title,
          content,
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
}; */

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
type Embedding = {
  fullName: string;
  age: string; // Consider using number if age will always be numerical
  gender: string;
  medicalCondition?: string;
  phoneNumber: string;
  email?: string;
  address: string;
  emergencyContacts: string;
  medicalHistories: string;
  psychiatricHistories: string;
  intakeAssessments?: string;
  additionalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
};

async function getEmbeddingForNote(
  fullName: string,
  age: string,
  gender: string,
  phoneNumber: string,
  email: string,
  address: string,
  emergencyContacts: string,
  medicalHistories: string,
  psychiatricHistories: string,
  intakeAssessments: string,
  additionalNotes: string,
  medicalCondition: string,
) {
  return getEmbedding(
    fullName +
      "\n\n" +
      age +
      "\n\n" +
      gender +
      "\n\n" +
      phoneNumber +
      "\n\n" +
      email +
      "\n\n" +
      address +
      "\n\n" +
      emergencyContacts +
      "\n\n" +
      medicalHistories +
      "\n\n" +
      psychiatricHistories +
      "\n\n" +
      intakeAssessments +
      "\n\n" +
      additionalNotes +
      "\n\n" +
      medicalCondition +
      "\n\n" ?? "",
  );
}
