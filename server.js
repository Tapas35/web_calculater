const express = require('express');
const bodyParser = require('body-parser');
const exceljs = require('exceljs');
const pdf = require('html-pdf');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/calculate', (req, res) => {
    const { num1, num2, result } = req.body;

    // Write to Excel
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.addRow(['Number 1', 'Number 2', 'Result']);
    worksheet.addRow([num1, num2, result]);

    workbook.xlsx.writeFile('result.xlsx')
        .then(() => {
            console.log('Excel file written successfully');
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('Error writing Excel file:', err);
            res.sendStatus(500);
        });
});

app.get('/print', (req, res) => {
    // Read Excel file and generate PDF
    const workbook = new exceljs.Workbook();
    workbook.xlsx.readFile('result.xlsx')
        .then(() => {
            const htmlContent = workbook.xlsx.writeBuffer()
                .then((buffer) => buffer.toString('base64'));

            const pdfOptions = { format: 'Letter' };
            pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
                if (err) {
                    console.log('Error generating PDF:', err);
                    res.sendStatus(500);
                } else {
                    console.log('PDF generated successfully');
                    res.contentType('application/pdf');
                    res.send(buffer);
                }
            });
        })
        .catch((err) => {
            console.log('Error reading Excel file:', err);
            res.sendStatus(500);
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
