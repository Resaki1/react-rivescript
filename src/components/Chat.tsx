import { useRef, useState } from "react";
import Messages from "./Messages";
import "./Chat.css";

const loading_done = (bot: RiveScript) => {
  console.log("Bot has finished loading!");
  bot.sortReplies();
};

const loading_error = (e: string) => {
  console.log("Error loading Bot: " + e);
};

const bot = new RiveScript();
bot
  .loadFile([
    "src/brain/begin.rive",
    "src/brain/admin.rive",
    "src/brain/clients.rive",
    "src/brain/eliza.rive",
    "src/brain/myself.rive",
    "src/brain/rpg.rive",
    "src/brain/javascript.rive",
    "src/brain/war.rive",
  ])
  .then(() => loading_done(bot))
  .catch((e: string) => loading_error(e));

let username = "local";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [replies, setReplies] = useState<string[]>([]);
  const dummy = useRef<HTMLLIElement>(null);

  const getReply = (message: string) => {
    setMessage("");
    setMessages([...messages, message]);
    bot.reply(username, message, ["hi"]).then((reply: string) => {
      setReplies([...replies, reply]);
      dummy.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <>
      <Messages messages={messages} replies={replies} dummy={dummy} />
      <div className="input__wrapper">
        <input
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getReply(message)}
          value={message}
        />
        <button onClick={() => getReply(message)}>send</button>
      </div>
    </>
  );
};

export default Chat;
