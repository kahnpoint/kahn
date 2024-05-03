import type { Bytes } from "../types";
import * as bytes from "./conversions";

export class ByteMap<V> {
  private _data: Map<string, V> = new Map<string, V>();

  constructor() {}

  get(key: Bytes): V | undefined {
    return this._data.get(bytes.toString(key));
  }

  set(key: Bytes, value: V) {
    this._data.set(bytes.toString(key), value);
  }

  has(key: Bytes): boolean {
    return this._data.has(bytes.toString(key));
  }

  delete(key: Bytes): boolean {
    return this._data.delete(bytes.toString(key));
  }

  clear() {
    this._data.clear();
  }
}
