import "./App.css";
import Chat from "./components/Chat";
import { Debug } from "./components/Debug";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Eliza</h1>
      </header>
      <Chat />
      {/* <Debug /> */}
    </div>
  );
}

export default App;
