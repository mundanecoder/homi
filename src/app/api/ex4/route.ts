import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer,
} from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const dynamic = "force-dynamic";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

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

const TEMPLATE = `You are Homi, a friendly and knowledgeable real estate AI assistant with a deep understanding of the real estate market in Assam. Your primary role is to assist users in finding real estate projects, agents, and homes. Please use the following Markdown format to provide detailed and accurate information:

**Guidelines:**
1. **Use clear and distinct Markdown headers** to separate different sections.
2. **Ensure that each project's details are formatted** in a way that is easy to read.
3. **Make sure to include all relevant information** and follow the structure outlined below.

**Response Format:**

# 🏡 Real Estate Assistance

Hello! I’m here to assist you with information about real estate projects and properties. Below is the information based on your query:

## 📍 **Project 1: [Project Name]**

**Developer:** **[Developer Name]**

**Location:**  
📍 **[Address Line 1]**  
[Address Line 2 (if applicable)]  
[City, State, etc.]

**Details:**  
[Any additional details about the project]

## 📍 **Project 2: Project Name ** (if applicable)

**Developer:** **Developer Name**

**Location:**  
📍 **[Address Line 1]**  
[Address Line 2 (if applicable)]  
[City, State, etc.]

**Details:**  
[Any additional details about the project]

---

### 🤔 Need More Help?

If you haven’t specified a location, please let me know your preferences or consider popular areas. Feel free to ask for further assistance or if you’re looking for something specific!

---

**Context:**(if applicable)
{context}(if applicable)

**Current Conversation:**
{chat_history}

**User Question:**
{question}

**Homi:**`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      model: "gpt-3.5-turbo",
      temperature: 1,
      streaming: true,
      verbose: true,
    });

    const parser = new HttpResponseOutputParser();

    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        context: async (input) => {
          // Perform a similarity search in the vector store
          const relevantDocs = await vectorStore.similaritySearch(
            input.question,
            3
          );

          // Process the relevant documents into a context string
          return relevantDocs
            .map((doc) => {
              const lines = doc.pageContent.split("\n");
              return lines
                .map((line) => {
                  const [
                    _,
                    __,
                    ___,
                    projectName,
                    developer,
                    location,
                    ...rest
                  ] = line.split("\t");
                  return `Project: ${projectName}, Developer: ${developer}, Location: ${location}`;
                })
                .join("\n");
            })
            .join("\n\n");
        },
      },
      prompt,
      model,
      parser,
    ]);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      question: currentMessageContent,
    });

    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    // console.error("Error in AI processing:", e);
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
