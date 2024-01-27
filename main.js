const excelReader = require('./excelReader');
const csvGenerator = require('./csvGenerator');

async function readExcelAndGenerateCSV(filePath) {
    try {
        const workbook = await excelReader.readExcel(filePath);
        const sheetsCount = workbook.worksheets.length;
        console.log(`Número de pestañas: ${sheetsCount}`);

        for (let sheetIndex = 0; sheetIndex < sheetsCount; sheetIndex++) {
            const sheet = workbook.worksheets[sheetIndex];
            const sheetName = sheet.name;
            console.log(`Leyendo hoja ${sheetName} (${sheetIndex})`);
            await csvGenerator.generateCSV(sheet, sheetName);       
        }
        
    } catch (error) {
        console.error(error);
    }
}

readExcelAndGenerateCSV('0-50.xlsx');
