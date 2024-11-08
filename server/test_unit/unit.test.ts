import { describe, test } from "@jest/globals"
import e from "express";

describe("Test group", () => {
    test("Test 1 description", () => {
        expect(1).toBe(1);
    })
    test("Test 2 description", () => {
        expect(2).toBe(2);
    })
});