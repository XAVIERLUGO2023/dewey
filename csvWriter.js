const fs = require('fs');
const stream = require('stream');
const util = require('util');
const path = require('path');

const pipeline = util.promisify(stream.pipeline);

/*
escribir todo al log y no en pantalla
const logFileName = `${new Date().toISOString().replace(/:/g, '-')}.log`;
const logFilePath = path.join("logs", logFileName);
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
const logger = new console.Console(logStream, logStream);

console.log = logger.log.bind(logger);*/

async function writeCSVToFile(sheetName, csvContent) {
    const outputFileName = `${sheetName}.csv`;
    const outputFilePath = path.join("csv", outputFileName);
    const writeStream = fs.createWriteStream(outputFilePath);
    await pipeline(stream.Readable.from([csvContent]), writeStream);
    console.log(`# CSV ${sheetName} escrito`);
}

module.exports = {
    writeCSVToFile,
};
