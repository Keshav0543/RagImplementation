import chunkutils from "../utils/chunking.js";
import cosineCalculation from "./cosine.js";

async function searchSimilarchunks(queryEmbedded){
   const cosineResult = [];
   
       for (let i = 0; i < chunkutils.embedingVector.length; i++) {
         const score = cosineCalculation(
           queryEmbedded,
           chunkutils.embedingVector[i],
         );
   
         cosineResult.push({
           chunkIndex: i,
           score: score,
           chunk: chunkutils.textchunks[i],
         });
       }
   
       // Highest similarity first
       cosineResult.sort((a, b) => b.score - a.score);
   
       // Get top 3 relevant chunks
       const top3 = cosineResult.slice(0, 3); 
       return top3;
};

export default searchSimilarchunks;