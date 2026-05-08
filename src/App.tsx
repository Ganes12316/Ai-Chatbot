import { ChatWindow } from "./components/chat/ChatWindow";
import { useChat } from "./hooks/useChat";

export default function App() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      error={error}
      onSend={sendMessage}
      onClear={clearMessages}
    />
  );
}