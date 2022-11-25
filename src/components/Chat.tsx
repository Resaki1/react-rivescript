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
    const url = "https://www.wikitable2json.com/api/Casualties_of_the_Russo-Ukrainian_War?lang=en&cleanRef=true";
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setContent(response);
        console.log("Wiki loaded");
      });
  };

  useEffect(() => {
    fetchWikipedia();
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

  function getData(source: string, category: string) {
    // Total Table
    const table = content[2];
    let filteredCategoryTable: string[][] = [];
    let filteredCategoryAndSourceTable: string[][] = [];
    // Get the right rows
    if (category == "civilians") {
      filteredCategoryTable = table.filter((row) => row[0] == "Civilians");
    } else if (category == "russian_soldiers") {
      filteredCategoryTable = table.filter((row) => row[0].includes("Russian"));
    } else if (category == "ukrainian_soldiers") {
      filteredCategoryTable = table.filter((row) => row[0].includes("Ukrain") || row[0].includes("Donetsk"));
    }

    if (source == "ukrainian") {
      filteredCategoryAndSourceTable = filteredCategoryTable.filter((row) => row[3].includes("Ukrai") || row[3].includes("PR"));
    } else if (source == "russian") {
      filteredCategoryAndSourceTable = filteredCategoryTable.filter((row) => row[3].includes("Russ"));
    } else if (source == "US") {
      filteredCategoryAndSourceTable = filteredCategoryTable.filter((row) => row[3].includes("US est"));
    } else if (source == "UN") {
      filteredCategoryAndSourceTable = filteredCategoryTable.filter((row) => row[3].includes("United Nations"));
    }
    console.log(table);
    console.log(filteredCategoryTable);
    console.log(filteredCategoryAndSourceTable);

    // setCausalities(table[0][0]);
    if (filteredCategoryAndSourceTable.length > 0) {
      return filteredCategoryAndSourceTable[0][1];
    } else {
      return "No data found";
    }
  }

  return (
    <>
      <Messages messages={messages} replies={replies} dummy={dummy} />
      <div className="input__wrapper">
        <input onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && getReply(message)} value={message} />
        <button onClick={() => getReply(message)}>send</button>
      </div>
    </>
  );
};

export default Chat;
