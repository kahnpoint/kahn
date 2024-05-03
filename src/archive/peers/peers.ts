// @ts-ignore
import Peer from "simple-peer-light";
import type { Bytes } from "@mootline/types";
export { Peer };

type initPeerOptions = {
  initiator?: boolean;
  trickle?: boolean;
  config?: RTCConfiguration;
};

// from https://github.com/dmotz/trystero/blob/main/src/utils.js
export const initPeer = (
  options: initPeerOptions = {
    initiator: false,
    trickle: true,
    config: {
      //iceServers: [
      //	{ urls: 'stun:stun.l.google.com:19302' },
      //	{ urls: 'stun:stun1.l.google.com:19302' },
      //	{ urls: 'stun:stun2.l.google.com:19302' },
      //	{ urls: 'stun:stun3.l.google.com:19302' },
      //	{ urls: 'stun:stun4.l.google.com:19302' },
      //]
    },
  },
) => {
  const peer = new Peer({
    initiator: options.initiator,
    trickle: options.trickle,
    config: options.config,
  });
  const onEarlyData = (data: Bytes) => peer.__earlyDataBuffer.push(data);

  peer.on(PeerEvents.Data, onEarlyData);
  peer.__earlyDataBuffer = [];
  peer.__drainEarlyData = (f: Bytes) => {
    peer.off(PeerEvents.Data, onEarlyData);
    peer.__earlyDataBuffer.forEach(f);
    delete peer.__earlyDataBuffer;
    delete peer.__drainEarlyData;
  };
  peer.on(PeerEvents.Connect, () =>
    peer.__drainEarlyData((data: Bytes) => {
      peer.off(PeerEvents.Data, onEarlyData);
      peer.emit(PeerEvents.Data, data);
    }),
  );

  return peer;
};

export enum PeerEvents {
  Close = "close",
  Connect = "connect",
  Data = "data",
  Error = "error",
  Signal = "signal",
  Stream = "stream",
  Track = "track",
}
