// Collects all Uint8Array values from an (async)iterable and returns them as a single Uint8Array.
import toBytes from 'it-to-buffer';
export {toBytes}

// Turns a blob into an async iterator
import fromBlob from 'blob-to-it';
export {fromBlob}


// Async iterable filename pattern matcher - like glob, but for async iterables
import fromGlob from 'it-glob';
export {fromGlob}

// Allows iterating over multipart messages found in a HTTP request
/*
http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.headers['content-type']) {
    for await (const part of multipart(req)) {
      console.log(`part with HTTP headers ${part.headers}`)

      // nb. part.body must be consumed before the next part is emitted
      for await (const chunk of part.body) {
        console.log(`part with content ${part.name} contents:`, chunk.toString())
      }
    }
*/
import fromMultipart from 'it-multipart';
export {fromMultipart}

// Turn (async)iterable values into JSON and back again.
import {parse, stringify} from 'it-ndjson';
export {parse, stringify}

