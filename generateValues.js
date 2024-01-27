function generateRangeValues(sheetName, columna1, columna2Valor, csvLines) {
    const [desde, hasta] = columna2Valor.split('-').map(value => value.trim());
    const desdeNum = parseFloat(desde);
    const hastaNum = parseFloat(hasta);

    

    if (isNaN(desdeNum) || isNaN(hastaNum) || desdeNum > hastaNum) {
        console.error('Rango no válido!');
        return;
    }

    const precisionDesde = (desde.includes('.') ? (desde.split('.')[1] || '').length : 0);
    const precisionHasta = (hasta.includes('.') ? (hasta.split('.')[1] || '').length : 0);
    const precision = Math.max(precisionDesde, precisionHasta);
    const magnitud = Math.pow(10, -precision);
    const granularidad = Math.round(magnitud * 1e15) / 1e15;
    const diferencia = hastaNum - desdeNum;
    const cantidadValores = Math.ceil(diferencia / granularidad );

    console.log(`${desdeNum} - ${hastaNum} (${cantidadValores})`);

    for (let i = desdeNum; i <= hastaNum + granularidad / 2; i += granularidad) {
        const valorFormateado = i % 1 === 0 ? i.toFixed(0) : i.toFixed(precision).replace(/\.?0$/, '');
        let csvLine = `"${sheetName}","${columna1}","${valorFormateado}"`;
        csvLines.push(csvLine);
    }
}

module.exports = {
    generateRangeValues,
};
