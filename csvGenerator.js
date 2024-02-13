//const { generateRangeValues } = require('./generateValues');
const { writeCSVToFile } = require('./csvWriter');
const path = require('path');
const fs = require('fs');

const logFileName = `${new Date().toISOString().replace(/:/g, '-')}.log`;
const logFilePath = path.join("logs", logFileName);

function writeToLog(text) {
    fs.appendFileSync(logFilePath, `${text}\n`);
}

function logToConsoleAndFile(...args) {
    const logText = args.join(' '); 
    //console.log(logText); 
    writeToLog(logText);
}


async function generateCSV(worksheet, sheetInfo) {
    const csvLines = [];
    //console.log(`# leyendo HOJA ${sheetInfo.sheetName} - Num. ${sheetInfo.sheetIndex}`);
    logToConsoleAndFile(`# leyendo HOJA ${sheetInfo.sheetName} - Num. ${sheetInfo.sheetIndex}`);
    worksheet.eachRow({ includeEmpty: false }, (row) => {
        const columna1 = row.getCell(1).value;
        const columna2 = row.getCell(2).value;

        if (isValidColumn(columna2)) {
            const columna2Valores = columna2.split(',').map(value => value.trim());

            if (columna2Valores.some(isValidValue)) {
                columna2Valores.forEach((columna2Valor) => {
                    if (isValidValue(columna2Valor)) {
                        if (columna2Valor.includes('-')) {
                            generateRangeValues(sheetInfo.sheetName, columna1, columna2Valor, csvLines);
                        } else {
                            const csvLine = `"${sheetInfo.sheetName}","${columna1}","${columna2Valor}"`;
                            csvLines.push(csvLine);
                        }
                    }else{
                        if (columna2Valor.trim() !== "")
                        logToConsoleAndFile(`X ${columna1}  valor no válido  ${columna2Valor}`);
                    //    console.log(`X ${columna1 }  valor no válido  ${columna2Valor}`);
                    }                          
                });
            }
        }
    });

    const csvContent = csvLines.join('\n');
    await writeCSVToFile(sheetInfo.sheetName, csvContent);
}

function isValidColumn(column) {
    return column !== null && column !== undefined && typeof column === 'string' && column.trim() !== '';
}

function isValidValue(value) {
    return /^\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?|$)(?![a-zA-Z])$/.test(value);
}

module.exports = {
    generateCSV,
};


function generateRangeValues(sheetName, columna1, columna2Valor, csvLines) {
    const [desde, hasta] = columna2Valor.split('-').map(value => value.trim());
    let desdeNum = parseFloat(desde);
    let hastaNum = parseFloat(hasta);



    if (isNaN(desdeNum) || isNaN(hastaNum) || desdeNum > hastaNum) {
        logToConsoleAndFile(`! ${columna1}  ${desdeNum } hasta ${hastaNum} rango no válido`);
        //console.log(`! ${columna1}  ${desdeNum } hasta ${hastaNum} rango no válido`);
    }

    const precisionDesde = (desde.includes('.') ? (desde.split('.')[1] || '').length : 0);
    const precisionHasta = (hasta.includes('.') ? (hasta.split('.')[1] || '').length : 0);
    const precision = Math.max(precisionDesde, precisionHasta);
    const magnitud = Math.pow(10, -precision);
    const granularidad = Math.round(magnitud * 1e15) / 1e15;
    const diferencia = hastaNum - desdeNum;
    let cantidadValores = Math.ceil(diferencia / granularidad) + 1;
    const maxVal = 500;

    if (cantidadValores > maxVal) {
        let cantidadValoresOrig = cantidadValores;
        cantidadValores = maxVal;        
        let hastaNumOrig = hastaNum
        hastaNum = desdeNum + granularidad * (cantidadValores - 1);
        const hastaNumF = hastaNum % 1 === 0 ? hastaNum.toFixed(0) : hastaNum.toFixed(precision).replace(/\.?0$/, '');
        logToConsoleAndFile(`> ${columna1} - ${desdeNum} hasta ${hastaNumOrig} (${cantidadValoresOrig}) - truncado a ${cantidadValores} - ${hastaNumF}`);
        //console.log(`> ${columna1} - ${desdeNum} hasta ${hastaNumOrig} (${cantidadValoresOrig}) - truncado a ${cantidadValores} - ${hastaNumF}`);
    }

    for (let i = desdeNum; i <= hastaNum + granularidad / 2; i += granularidad) {
        const valorFormateado = i % 1 === 0 ? i.toFixed(0) : i.toFixed(precision).replace(/\.?0$/, '');
        let csvLine = `"${sheetName}","${columna1}","${valorFormateado}"`;
        csvLines.push(csvLine);
    }

}

