import axios from "axios";
import { fetchCharacters } from "../fetcher";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockPage1 = {
    data: {
        info: { next: "https://rickandmortyapi.com/api/character?page=2" },
        results: [
            {
                name: "Rick Sanchez",
                origin: { name: "Earth (C-137)" },
                location: { name: "Citadel of Ricks" },
                image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
            },
            {
                name: "Alien Bob",
                origin: { name: "Mars" }, // צריך להיות מסונן
                location: { name: "Mars" },
                image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
            },
        ],
    },
};

const mockPage2 = {
    data: {
        info: { next: null },
        results: [
            {
                name: "Morty Smith",
                origin: { name: "Earth (C-137)" },
                location: { name: "Earth (C-137)" },
                image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
            },
        ],
    },
};

describe("fetchCharacters", () => {
    beforeEach(() => {
        mockedAxios.get.mockReset();
    });

    it("מחזיר רק דמויות מכדור הארץ", async () => {
        mockedAxios.get
            .mockResolvedValueOnce(mockPage1)
            .mockResolvedValueOnce(mockPage2);

        const result = await fetchCharacters();

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe("Rick Sanchez");
        expect(result[1].name).toBe("Morty Smith");
    });

    it("מסנן דמויות שלא מכדור הארץ", async () => {
        mockedAxios.get
            .mockResolvedValueOnce(mockPage1)
            .mockResolvedValueOnce(mockPage2);

        const result = await fetchCharacters();

        const alienBob = result.find((c) => c.name === "Alien Bob");
        expect(alienBob).toBeUndefined();
    });

    it("עובר בין דפים עד ש-next הוא null", async () => {
        mockedAxios.get
            .mockResolvedValueOnce(mockPage1)
            .mockResolvedValueOnce(mockPage2);

        await fetchCharacters();

        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
});