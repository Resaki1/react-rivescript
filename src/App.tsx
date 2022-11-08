import { useState } from "react";
import "./App.css";

const loading_done = (bot: RiveScript) => {
  console.log("Bot has finished loading!");
  bot.sortReplies();
};

const loading_error = () => {
  console.log("Error loading Bot!");
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
  ])
  .then(() => loading_done(bot))
  .catch(loading_error);

let username = "local";
function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const getReply = (message: string) => {
    bot
      .reply(username, message, ["hi"])
      .then((reply: string) => setReply(reply));
  };

  return (
    <div className="App">
      <p>{reply}</p>
      <input onChange={(e) => setMessage(e.target.value)} value={message} />
      <button onClick={() => getReply(message)}>send</button>
    </div>
  );
}

export default App;
