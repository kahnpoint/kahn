import * as decoding from "lib0/decoding";
export * from "lib0/decoding";

/**
 * Usage
 * const decoder = new decoding.Decoder()
 * decoding.writeUint8(decoder, 1)
 * decoding.repeated(decoder, decoding.writeUint8, [1,2,3,4,5])
 */
type DecoderFunction = (decoder: decoding.Decoder) => any;
export function repeated(
  decoder: decoding.Decoder,
  decoderFunction: DecoderFunction,
): any[] {
  const outputList = [];
  const iterableInput = new decoding.Decoder(
    decoding.readVarUint8Array(decoder),
  );
  while (iterableInput.pos < iterableInput.arr.length) {
    outputList.push(decoderFunction(iterableInput));
  }
  return outputList;
}

export const create = decoding.createDecoder;
export const readByte = decoding.readUint8;
export const readBytes = decoding.readVarUint8Array;
