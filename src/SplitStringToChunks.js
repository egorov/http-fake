const SplitStringToChunks = (str, length) => {
    'use strict';

    const size = Math.ceil(str.length/length),
        chunks  = new Array(size);
    let offset = 0;

    for (let i = 0; i < size; i++) {
        offset = i * length;
        chunks[i] = str.substring(offset, offset + length);
    }

    return chunks;
};

module.exports = SplitStringToChunks;