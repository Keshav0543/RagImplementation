import { PDFParse } from "pdf-parse";
import fs from "fs";
import chunkutils from "./chunking.js";

async function getRun(pdfPath){
    const data=fs.readFileSync(pdfPath);
    const parser=new PDFParse({
        data:data
    });

    const response=await parser.getText();
    const embeddedVector=await chunkutils.chunksEmbedded(response.text,300,100);
    return embeddedVector;
}

export default getRun;