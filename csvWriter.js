const fs = require('fs');
const stream = require('stream');
const util = require('util');

const pipeline = util.promisify(stream.pipeline);

async function writeCSVToFile(sheetName, csvContent) {
    const outputFileName = `${sheetName}.csv`;
    const writeStream = fs.createWriteStream(outputFileName);
    await pipeline(stream.Readable.from([csvContent]), writeStream);
    console.log(`CSV para la hoja ${sheetName} generado con éxito.`);
}

module.exports = {
    writeCSVToFile,
};
