import createEmbedding from "./model.js";

let embedingVector=[];
let textchunks=[];
async function chunksEmbedded(text,chunkS,overlap){
    const words = text.split(/\s+/);
    for(let i=0;i<words.length;i+=chunkS-overlap){
        const data=words.slice(i,i+chunkS).join(" ");
        textchunks.push(data);
    }

    for(let i=0;i<textchunks.length;i++){
        const data=await createEmbedding(textchunks[i]);
        embedingVector.push(data);
    }
    return embedingVector;
}

export default {chunksEmbedded, embedingVector, textchunks};