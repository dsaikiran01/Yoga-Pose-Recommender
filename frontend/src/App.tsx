import { useState } from "react";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);
    try {
      const response = await fetch("/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results || []);
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred during the search.");
    }
  };

  const generateAndPlayAudio = async (description: string) => {
    try {
      const response = await fetch("/generate_audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!response.ok) throw new Error("Audio generation failed");
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      new Audio(audioUrl).play();
    } catch (err) {
      alert("Error generating audio. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Yoga Pose Search</h1>
      <form onSubmit={handleSearch} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Enter your search prompt:
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
            placeholder="e.g., exercises for back pain"
          />
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div className="mt-4 flex flex-wrap justify-center">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="max-w-sm rounded shadow-lg m-2 bg-white p-4">
              {result.metadata.metadata.photo_url && (
                <img
                  className="w-full h-48 object-cover mb-4"
                  src={result.metadata.metadata.photo_url}
                  alt={result.metadata.name || "Yoga Pose"}
                />
              )}
              <h2 className="font-bold text-xl mb-2">
                {result.metadata.metadata.name || "N/A"}
              </h2>
              <p className="text-gray-700">{result.metadata.metadata.description || "N/A"}</p>
              <div className="mt-2 flex flex-wrap">
                {result.metadata.metadata.pose_type?.map((type: string, i: number) => (
                  <span
                    key={i}
                    className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {type}
                  </span>
                ))}
              </div>
              <button
                className="mt-4 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                onClick={() => generateAndPlayAudio(result.metadata.metadata.description)}
              >
                Play Audio
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">{loading ? "Loading..." : "No results found."}</p>
        )}
      </div>
    </div>
  );
};

export default App;