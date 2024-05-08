export * from './peers'

/*
How to use simple-peer

=== Peer 1 ===
step 1. peer1 creates the initiator
var peer1 = new Peer({ initiator: true })

step 2. peer1 sends the offer to peer2
peer1.on('signal', data1 => {
~> magically send data1 to peer2
})

=== Peer 2 ===
step 3. peer2 receives the offer
~> magically receive data1 from peer1

step 4. peer2 creates a receiver
var peer2 = new Peer()

step 5. peer2 creates its own signal data based on the offer from peer1
peer2.signal(data1)

step 6. peer2 sends the answer to peer1 (this callback is technically defined before step 5)
peer2.on('signal', data2 => {
~> magically send data2 to peer1
})

=== Peer 1 ===
step 7. peer1 receives the answer
~> magically receive data2 from peer2
peer1.signal(data2)

step 8. peer1 and peer2 are connected!


*/
