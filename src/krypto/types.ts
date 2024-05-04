//crypto
import { Bytes } from "../bytes/types";
export type Hash = string;
export type Signature = string;
export type Checksum = number;
export type AnyKey = string;
export type PublicKey = AnyKey;
export type PrivateKey = AnyKey;
export type SharedKey = AnyKey;
export type PublicKeyBytes = Bytes;
export type PrivateKeyBytes = Bytes;
export type SharedKeyBytes = Bytes;
export type KeyPair = {
  publicKey: PublicKey;
  privateKey: PrivateKey;
};
export type JoinedKeyPair = `${PublicKey}:${PrivateKey}`;
