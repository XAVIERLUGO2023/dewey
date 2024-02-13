function generateRangeValues(sheetName, columna1, columna2Valor, csvLines) {
    const [desde, hasta] = columna2Valor.split('-').map(value => value.trim());
    let desdeNum = parseFloat(desde);
    let hastaNum = parseFloat(hasta);



    if (isNaN(desdeNum) || isNaN(hastaNum) || desdeNum > hastaNum) {
        logToConsoleAndFile(`! ${columna1}  ${desdeNum } hasta ${hastaNum} rango no válido`);
        console.log(`! ${columna1}  ${desdeNum } hasta ${hastaNum} rango no válido`);
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
        console.log(`> ${columna1} - ${desdeNum} hasta ${hastaNumOrig} (${cantidadValoresOrig}) - truncado a ${cantidadValores} - ${hastaNumF}`);
    }

    for (let i = desdeNum; i <= hastaNum + granularidad / 2; i += granularidad) {
        const valorFormateado = i % 1 === 0 ? i.toFixed(0) : i.toFixed(precision).replace(/\.?0$/, '');
        let csvLine = `"${sheetName}","${columna1}","${valorFormateado}"`;
        csvLines.push(csvLine);
    }

}

module.exports = {
    generateRangeValues,
};
