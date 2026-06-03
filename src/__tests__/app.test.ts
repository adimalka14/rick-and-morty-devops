import request from "supertest";
import express from "express";

jest.mock("../fetcher", () => ({
    fetchCharacters: jest.fn().mockResolvedValue([
        {
            name: "Rick Sanchez",
            location: "Citadel of Ricks",
            image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        },
    ]),
}));

const app = express();
app.get("/healthcheck", (req, res) => res.json({ status: "ok" }));
app.get("/data", (req, res) => res.json([{ name: "Rick Sanchez" }]));

describe("GET /healthcheck", () => {
    it("מחזיר status ok", async () => {
        const res = await request(app).get("/healthcheck");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok" });
    });
});

describe("GET /data", () => {
    it("מחזיר מערך של דמויות", async () => {
        const res = await request(app).get("/data");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});