import { useState } from "react";

export const Debug = () => {
  const [content, setContent] = useState<any[]>([]);

  const fetchWikipedia = async () => {
    // const url = "https://en.wikipedia.org/w/api.php?action=parse&page=Casualties_of_the_Russo-Ukrainian_War&section=10&prop=wikitext&format=json&origin=*";
    const url = "https://www.wikitable2json.com/api/Casualties_of_the_Russo-Ukrainian_War?lang=en&cleanRef=true";
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        // const wiki = response.parse.wikitext["*"];
        // const parts = wiki.split("\n");
        // console.log(parts);
        // setContent(response.parse.wikitext["*"]);
        setContent(response);
      });
  };

  return (
    <div>
      <button onClick={fetchWikipedia}>Fetch</button>

      <div>
        {content.map((table) => {
          return (
            <table className="space">
              <tbody>
                {table.map((row) => (
                  <tr>
                    {row.map((cell) => (
                      <td>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })}
      </div>
    </div>
  );
};
