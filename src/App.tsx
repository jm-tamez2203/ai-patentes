import { useState, type FormEvent } from "react";
import { Loader } from "@aws-amplify/ui-react";
//import "./App.css";

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import amplifyOutputs from "./amplify_outputs.json";

//import "@aws-amplify/ui-react/styles.css";

// Configura Amplify
Amplify.configure(amplifyOutputs);



//const client = generateClient<Schema>();
// Crea cliente Amplify Data
const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});



function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data, errors } = await amplifyClient.queries.askBedrock({
        prompt: query,
      });

      if (errors) {
        console.error(errors);
        return;
      }

      // Bedrock devuelve texto -> parsear si responde JSON
      const raw = data?.body ?? "";
      const parsed = safeJson(raw);

      setResults(parsed ? parsed : [{ summary: raw }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const safeJson = (text: string) => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">InnoPatent AI 🚀</h1>
        <p className="text-gray-600">
          Buscador de patentes farmacéuticas próximas a expirar
        </p>
      </header>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Ej. atorvastatina"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-1/2 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* resultados como ya tenías */}
      ...
    </div>
  );
}

export default App;
