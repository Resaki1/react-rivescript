import { useEffect, useRef, useState } from "react";
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

  const [content, setContent] = useState<string[][][]>([]);

  const fetchWikipedia = async () => {
    // const url = "https://en.wikipedia.org/w/api.php?action=parse&page=Casualties_of_the_Russo-Ukrainian_War&section=10&prop=wikitext&format=json&origin=*";
    const url =
      "https://www.wikitable2json.com/api/Casualties_of_the_Russo-Ukrainian_War?lang=en&cleanRef=true";
    return fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setContent(response);
        return response;
      });
  };

  useEffect(() => {
    fetchWikipedia().then((response: any) => {
      console.log(response);
      getData(response);
    });
  }, []);

  const getReply = (message: string) => {
    setMessage("");
    setMessages([...messages, message]);
    bot.reply(username, message, ["hi"]).then((reply: string) => {
      setTimeout(() => {
        setReplies([...replies, reply]);
        dummy.current?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
      dummy.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const getData = (response: string[][][]) => {
    // Total Table
    const table = response ? response[2] : [];

    const civilians = table.filter((row) => row[0] == "Civilians");
    const civilians_ukrainian = civilians.filter(
      (row) => row[3]?.includes("Ukrai") || row[3]?.includes("PR")
    );
    const civilians_russian = civilians.filter((row) =>
      row[3]?.includes("Russ")
    );
    const russianSoldiers = table.filter((row) => row[0].includes("Russian"));
    const russianSoldiers_ukrainian = russianSoldiers.filter(
      (row) => row[3]?.includes("Ukrai") || row[3]?.includes("PR")
    );
    const russianSoldiers_russian = russianSoldiers.filter((row) =>
      row[3]?.includes("Russ")
    );
    const ukrainianSoldiers = table.filter(
      (row) => row[0]?.includes("Ukrain") || row[0]?.includes("Donetsk")
    );
    const ukrainianSoldiers_ukrainian = ukrainianSoldiers.filter(
      (row) => row[3]?.includes("Ukrai") || row[3]?.includes("PR")
    );
    const ukrainianSoldiers_russian = ukrainianSoldiers.filter((row) =>
      row[3]?.includes("Russ")
    );

    localStorage.setItem(
      "casulties",
      JSON.stringify({
        civilians: {
          ukrainian: civilians_ukrainian.length
            ? civilians_ukrainian[0][1]
            : "No data provided",
          russian: civilians_russian.length
            ? civilians_russian[0][1]
            : "No data provided",
        },
        russianSoldiers: {
          ukrainian: russianSoldiers_ukrainian.length
            ? russianSoldiers_ukrainian[0][1]
            : "No data provided",
          russian: russianSoldiers_russian.length
            ? russianSoldiers_russian[0][1]
            : "No data provided",
        },
        ukrainianSoldiers: {
          ukrainian: ukrainianSoldiers_ukrainian.length
            ? ukrainianSoldiers_ukrainian[0][1]
            : "No data provided",
          russian: ukrainianSoldiers_russian.length
            ? ukrainianSoldiers_russian[0][1]
            : "No data provided",
        },
      })
    );
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
