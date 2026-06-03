import express from "express";
import { fetchCharacters } from "./fetcher";

const app = express();
const PORT = process.env.PORT ?? 3000;

let characters: Awaited<ReturnType<typeof fetchCharacters>> = [];

app.get("/healthcheck", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/data", (req, res) => {
    res.json(characters);
});

(async () => {
    characters = await fetchCharacters();
    console.log(`Loaded ${characters.length} characters`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();