"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      api: "api/ex4",
      onError: (e) => {
        // console.log(e);
      },
    });
  const chatParent = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  const dummyQuestions = [
    "What are the current real estate trends in my area?",
    "How can I find the best investment property?",
    "What should I know before buying a house?",
    "what should I do to avoid getting scammed when getting a house?",

    "Can you explain the different types of home loans available in india?",
    "What are the eligibility criteria for obtaining a home loan?",
  ];

  const handleDummyQuestionClick = (question: string) => {
    setInput(question);
    handleSubmit(new Event("submit") as unknown as FormEvent<HTMLFormElement>);
  };

  return (
    <main className="flex items-center justify-center w-full h-[93.5vh] max-h-dvh bg-background dark:bg-black dark:text-white/80 ">
      <section className="w-full max-w-5xl py-4 h-full flex items-center justify-center">
        <section className="w-full h-full flex items-center justify-center">
          <section className="container px-0 lg:pb-10 flex flex-col flex-grow gap-4 max-w-3xl h-full">
            <section className="px-2 lg:px-0">
              <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-3xl mx-auto items-center"
              >
                <Input
                  className="flex-1 min-h-[40px]"
                  placeholder="Type your question here..."
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                />
                <Button className="ml-2" type="submit">
                  Submit
                </Button>
              </form>
            </section>
            <ul
              ref={chatParent}
              className="h-[90vh] p-0 flex-grow bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4 px-4 py-8"
              style={{
                scrollbarWidth: "none",
              }}
            >
              {messages.length === 0 ? (
                <div className="h-full my-4 items-center flex self-center ">
                  <ul className="flex gap-2 flex-col text-sm">
                    {dummyQuestions.map((question, index) => (
                      <li
                        key={index}
                        className="flex justify-center items-center text-center text-primary px-4 border py-4 flex-col cursor-pointer hover:bg-muted"
                        onClick={() => handleDummyQuestionClick(question)}
                      >
                        <p>{question}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                messages.map((m, index) => (
                  <div key={index}>
                    {m.role === "user" ? (
                      <li key={m.id} className="flex flex-row ">
                        <div className="rounded-xl p-4 bg-background shadow-md flex border w-full ">
                          <p className="text-sm">{m.content}</p>
                        </div>
                      </li>
                    ) : (
                      <li key={m.id} className="flex flex-row-reverse">
                        <div className="rounded-xl p-4 bg-background shadow-sm flex w-full">
                          <ReactMarkdown className="text-sm markdown-content">
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      </li>
                    )}
                  </div>
                ))
              )}
            </ul>
          </section>
        </section>
      </section>
    </main>
  );
}
