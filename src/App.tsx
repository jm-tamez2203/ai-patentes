import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    // TODO: Aquí se conectará con la API /search (Amplify Lambda)
    // Por ahora: mock de resultados
    const mock = [
      {
        molecule: "Atorvastatina",
        patent_number: "US1234567",
        assignee: "Pfizer",
        country: "US",
        expiration_date: "2026-05-11",
        summary:
          "Patente de atorvastatina, estatina para colesterol, expira en 2026. Oportunidad alta para genéricos.",
      },
    ];
    setResults(mock);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Encabezado */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          InnoPatent AI 🚀
        </h1>
        <p className="text-gray-600">
          Buscador de patentes farmacéuticas próximas a expirar
        </p>
      </header>

      {/* Barra de búsqueda */}
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
          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Molécula</th>
              <th className="p-3">Patente</th>
              <th className="p-3">Titular</th>
              <th className="p-3">País</th>
              <th className="p-3">Expira</th>
              <th className="p-3">Resumen</th>
            </tr>
          </thead>
          <tbody>
            {results.map((patent, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{patent.molecule}</td>
                <td className="p-3">{patent.patent_number}</td>
                <td className="p-3">{patent.assignee}</td>
                <td className="p-3">{patent.country}</td>
                <td className="p-3">{patent.expiration_date}</td>
                <td className="p-3 text-sm">{patent.summary}</td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No hay resultados aún. Realiza una búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Botón exportar */}
      <div className="mt-4 text-right">
        <button
          onClick={() => alert("Exportar a CSV pronto disponible")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Exportar CSV
        </button>
      </div>
    </div>
  );
}

export default App;
