async function calculate() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    
    const result = num1 + num2;
    
    document.getElementById('result').innerHTML = `Result: ${result}`;

    // Send data to server
    await fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ num1, num2, result }),
    });
}

async function printPDF() {
    // Request server to generate PDF
    const response = await fetch('/print', { method: 'GET' });
    const pdfBlob = await response.blob();

    // Create a download link for the PDF
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(pdfBlob);
    link.download = 'result.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
