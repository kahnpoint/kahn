import { Bytes, ByteLength } from "../misc/types";
import * as bytes from "../bytes";

// bytes
export function toBytes(str: string): Bytes {
  return bytes.fromString(str);
}

export function fromBytes(bytes: Bytes): string {
  return bytes.toString(bytes);
}


// base58
export function toBase58(str: string): string {
  return bytes.toBase58(bytes.fromString(str));
}
export function fromBase58(str: string): string {
  return bytes.toString(bytes.fromBase58(str));
}

// base64
export function toBase64(str: string): string {
  return bytes.toBase64(bytes.fromString(str));
}
export function fromBase64(str: string): string {
  return bytes.toString(bytes.fromBase64(str));
}