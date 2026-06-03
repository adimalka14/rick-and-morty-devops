import axios from "axios";

const API_URL = "https://rickandmortyapi.com/api/character";

interface Character {
  name: string;
  location: string;
  image: string;
}

interface ApiCharacter {
  name: string;
  origin: { name: string };
  location: { name: string };
  image: string;
}

interface ApiResponse {
  info: { next: string | null };
  results: ApiCharacter[];
}

export async function fetchCharacters(): Promise<Character[]> {
  const characters: Character[] = [];
  let url: string | null = API_URL;
  let params: Record<string, string> | null = {
    status: "alive",
    species: "human",
  };

  while (url) {
    const response = await axios.get<ApiResponse>(url, { params });
    const data: ApiResponse = response.data;

    for (const char of data.results) {
      if (char.origin.name.includes("Earth")) {
        characters.push({
          name: char.name,
          location: char.location.name,
          image: char.image,
        });
      }
    }

    url = data.info.next;
    params = null;
  }

  return characters;
}
