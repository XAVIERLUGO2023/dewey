const excelReader = require('./excelReader');
const csvGenerator = require('./csvGenerator');
const fs = require('fs');

async function readExcelAndGenerateCSV(filePath) {
    try {
        const workbook = await excelReader.readExcel(filePath);
        const sheetsCount = workbook.worksheets.length;  


        console.log(`Número de pestañas: ${sheetsCount}`);

        for (let sheetIndex = 0; sheetIndex < sheetsCount; sheetIndex++) {
            const sheet = workbook.worksheets[sheetIndex];
            const sheetName = sheet.name;
            const sheetInfo = {
                sheetsCount:sheetsCount,
                sheetName:sheetName,
                sheetIndex:sheetIndex
            }
            
            
            //await csvGenerator.generateCSV(sheet, sheetName, sheetIndex);       
            await csvGenerator.generateCSV(sheet, sheetInfo);
        }
        
    } catch (error) {
        console.error(error);
    }
}

async function main() {
    console.log("Ejecutando...");
    await readExcelAndGenerateCSV('Rangos de Clasificación.xlsx');
    console.log("Finalizado.");
}

main();


