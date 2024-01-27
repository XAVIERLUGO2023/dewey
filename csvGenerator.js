const { generateRangeValues } = require('./generateValues');
const { writeCSVToFile } = require('./csvWriter');

async function generateCSV(worksheet, sheetName) {
    const csvLines = [];

    worksheet.eachRow({ includeEmpty: false }, (row) => {
        const columna1 = row.getCell(1).value;
        const columna2 = row.getCell(2).value;

        if (isValidColumn(columna2)) {
            const columna2Valores = columna2.split(',').map(value => value.trim());

            if (columna2Valores.some(isValidValue)) {
                columna2Valores.forEach((columna2Valor) => {
                    if (columna2Valor.includes('-')) {
                        generateRangeValues(sheetName, columna1, columna2Valor, csvLines);
                    } else {
                        const csvLine = `"${sheetName}","${columna1}","${columna2Valor}"`;
                        csvLines.push(csvLine);
                    }
                });
            }
        }
    });

    const csvContent = csvLines.join('\n');
    await writeCSVToFile(sheetName, csvContent);
}

function isValidColumn(column) {
    return column !== null && column !== undefined && typeof column === 'string' && column.trim() !== '';
}

function isValidValue(value) {
    return /^\d+(\.\d+)?(-\d+(\.\d+)?)?$/.test(value);
}

module.exports = {
    generateCSV,
};
