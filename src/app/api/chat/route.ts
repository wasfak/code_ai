import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { noteIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages: ChatCompletionMessage[] = body.messages;
    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();

    if (!userId) {
      throw new Error("User ID not found");
    }

    const vectorQueryResponse = await noteIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relevantPatientsWithHistory = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    const formattedData = relevantPatientsWithHistory
      .map((info) => {
        const { note, description } = info;
        return `Note: ${note}\nDescription: ${description}\n`;
      })
      .join("\n\n");

    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content:
        `You are an advanced AI assistant designed to help users by retrieving the code that is most relevant to their needs from their database which I will give you.\n\n` +
        `Today's date is ${today} and the user programme name and the description of it is inside:\n\n${formattedData}`,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
}
