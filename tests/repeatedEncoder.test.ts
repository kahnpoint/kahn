import { d, e } from "../src";
import { test, expect } from "vitest";

test("repeatedEncoder", () => {
  const encoder = new e.Encoder();
  e.writeUint8(encoder, 1);
  e.repeated(encoder, e.writeUint8, [1, 2, 3, 4, 5]);
  expect(e.toUint8Array(encoder)).toEqual(
    Uint8Array.from([1, 5, 1, 2, 3, 4, 5]),
  );

  const decoder = new d.Decoder(e.toUint8Array(encoder));
  expect(d.readUint8(decoder)).toBe(1);
  expect(d.repeated(decoder, d.readUint8)).toEqual([1, 2, 3, 4, 5]);
});

test("empty repeatedEncoder", () => {
  const encoder = new e.Encoder();
  e.writeUint8(encoder, 1);
  e.repeated(encoder, e.writeUint8, []);
  expect(e.toUint8Array(encoder)).toEqual(Uint8Array.from([1, 0]));

  const decoder = new d.Decoder(e.toUint8Array(encoder));
  expect(d.readUint8(decoder)).toBe(1);
  expect(d.repeated(decoder, d.readUint8)).toEqual([]);
});

test("null repeatedEncoder", () => {
  const encoder = new e.Encoder();
  e.writeUint8(encoder, 1);
  e.repeated(encoder, e.writeUint8, null);
  expect(e.toUint8Array(encoder)).toEqual(Uint8Array.from([1, 0]));

  const decoder = new d.Decoder(e.toUint8Array(encoder));
  expect(d.readUint8(decoder)).toBe(1);
  expect(d.repeated(decoder, d.readUint8)).toEqual([]);
});
