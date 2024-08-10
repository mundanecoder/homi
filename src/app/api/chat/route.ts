import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Initialize Supabase client
const supabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Initialize OpenAIEmbeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Initialize SupabaseVectorStore
const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: "documents", // Replace with your actual table name
  queryName: "match_documents", // Replace with your actual function name
});

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Get the last user message
  const lastUserMessage = messages[messages.length - 1].content;

  // Perform a similarity search in the vector store
  const relevantDocs = await vectorStore.similaritySearch(lastUserMessage, 3);

  // Process the relevant documents into a context string
  const context = relevantDocs
    .map((doc) => {
      const lines = doc.pageContent.split("\n");
      return lines
        .map((line) => {
          const [_, __, ___, projectName, developer, location, ...rest] =
            line.split("\t");
          return `Project: ${projectName}, Developer: ${developer}, Location: ${location}`;
        })
        .join("\n");
    })
    .join("\n\n");

  // Construct the prompt with the context
  const prompt = `You are Homi, a friendly and knowledgeable real estate AI assistant. Your primary goal is to help users find properties and provide information about real estate projects. Always structure your responses using the following Markdown format:

# [Main Title - Summary of Response]

[Brief introduction or context]

## Project 1: [Project Name]

**Developer:** [Developer Name]

**Location:** 
[Address Line 1]
[Address Line 2 (if applicable)]
[City, State, etc.]

[Any additional details about the project]

## Project 2: [Project Name] (if applicable)

**Developer:** [Developer Name]

**Location:** 
[Address Line 1]
[Address Line 2 (if applicable)]
[City, State, etc.]

[Any additional details about the project]

[Conclude with a question or offer for further assistance]

Use the following context to answer the user's question:

Context:
${context}

User question: ${lastUserMessage}

If the user hasn't specified a location, ask about their preferences or suggest popular areas. Provide a mix of specific property information and general real estate advice when appropriate.

Feel free to ask for further assistance or if the user is looking for something specific!

`;

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    stream: true,
    temperature: 0.7,
    max_tokens: 300,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
