import * as encoding from "lib0/encoding";
export * from "lib0/encoding";

/**
 * Usage
 * const encoder = new encoding.Encoder()
 * encoding.writeUint8(encoder, 1)
 * encoding.repeated(encoder, encoding.writeUint8, [1,2,3,4,5])
 */
export function repeated(
  encoderFunction: any,
  encoder: encoding.Encoder,
  iterableInput: any,
) {
  const outputEncoder = new encoding.Encoder();
  iterableInput = iterableInput ?? [];
  for (const input of iterableInput) {
    encoderFunction(outputEncoder, input);
  }
  encoding.writeVarUint8Array(encoder, encoding.toUint8Array(outputEncoder));
}

export const create = encoding.createEncoder;
export const writeByte = encoding.writeUint8;
export const writeBytes = encoding.writeVarUint8Array;
export const toBytes = encoding.toUint8Array;
