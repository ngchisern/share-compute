import "./App.css";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function App() {
  const engines = useQuery(api.engine.get);
  return (
    <div className="App">
      <h1>Share Compute</h1>
      <button>New Workflow</button>
      {/* {engines?.map(({ _id,  name, status}) => (
        <div key={_id}>{name} {status}</div>
      ))} */}
    </div>
  );
}

export default App;