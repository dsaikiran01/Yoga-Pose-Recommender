const API_URL = "https://yoga-api-xyz123.a.run.app";
export const searchYogaPoses = async (query: string) => {
    const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
    });
    return response.json();
};
