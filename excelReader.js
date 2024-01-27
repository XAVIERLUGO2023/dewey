const ExcelJS = require('exceljs');

async function readExcel(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    return workbook;
}

module.exports = {
    readExcel,
};
