import { useState } from "react";

const sources = ["UKRAINE", "RUSSIA", "WEST_WORLD"];

const categories = ["CIVILIANS", "RUSSIAN_SOLDIERS", "UKRAIN_SOLDIERS"];

export const Debug = () => {
  const [content, setContent] = useState<string[][][]>([]);

  const [causalities, setCausalities] = useState<string>("");

  const [source, setSource] = useState<string>("UKRAINE");
  const [category, setCategory] = useState<string>("CIVILIANS");

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

  function getCausalities() {
    getData(source, category);
  }

  function getData(source: string, category: string) {
    // Total Table
    const table = content[2];
    let filteredCategoryTable: string[][] = [];
    let filteredCategoryAndSourceTable: string[][] = [];
    // Get the right rows
    if (category == "CIVILIANS") {
      filteredCategoryTable = table.filter((row) => row[0] == "Civilians");
    } else if (category == "RUSSIAN_SOLDIERS") {
      filteredCategoryTable = table.filter((row) => row[0].includes("Russia"));
    } else if (category == "UKRAIN_SOLDIERS") {
      filteredCategoryTable = table.filter((row) => row[0].includes("Ukrain"));
    }

    if (source == "UKRAINE") {
      filteredCategoryAndSourceTable = filteredCategoryTable.filter((row) => row[3].includes("Ukrai") || row[3].includes("PR"));
    } else if (source == "RUSSIA") {
      filteredCategoryAndSourceTable = filteredCategoryTable.filter((row) => row[3].includes("Russ"));
    } else if (source == "WEST_WORLD") {
      filteredCategoryAndSourceTable = filteredCategoryTable.filter((row) => row[3].includes("US est"));
    }
    console.log(table);
    console.log(filteredCategoryTable);
    console.log(filteredCategoryAndSourceTable);

    // setCausalities(table[0][0]);
    if (filteredCategoryAndSourceTable.length > 0) {
      setCausalities(filteredCategoryAndSourceTable[0][1]);
    } else {
      setCausalities("No data found");
    }
  }

  return (
    <div>
      <button onClick={fetchWikipedia}>Fetch</button>
      <div>
        <div style={{ padding: "1em", border: "1em", background: "gray" }}>Causalities: {causalities}</div>
        <label>Source</label>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value={"UKRAINE"}>Ukraine</option>
          <option value={"RUSSIA"}>Russia</option>
          <option value={"WEST_WORLD"}>West World</option>
        </select>
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value={"CIVILIANS"}>Civilians</option>
          <option value={"RUSSIAN_SOLDIERS"}>Russian Soldiers</option>
          <option value={"UKRAIN_SOLDIERS"}>Ukrain Soldiers</option>
        </select>
        <button onClick={getCausalities}>Get</button>
      </div>
      <div>
        {content.map((table, index) => {
          if (index != 2) {
            return null;
          }
          return (
            <table className="space">
              <tbody>
                {table.map((row: string[]) => (
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
