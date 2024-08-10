import { Chat } from "./components/chat";
import Navbar from "./components/Navbar";

export const runtime = "edge";

export default function Page() {
  return (
    <>
      <Navbar />
      <Chat />
    </>
  );
}
