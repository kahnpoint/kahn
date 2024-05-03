import { Bytes, ByteLength } from "../misc/types";
import * as bytes from "../bytes";

// bytes
export function toBytes(str: string): Bytes {
  return bytes.fromString(str);
}

export function fromBytes(bytes: Bytes): string {
  return bytes.toString(bytes);
}
