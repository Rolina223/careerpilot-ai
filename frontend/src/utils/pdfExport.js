import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportResumeToPdf(element, fileName) {
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
  });

  const imageData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = canvas.width / pageWidth;
  const pdfHeight = canvas.height / ratio;

  let position = 0;
  pdf.addImage(imageData, 'PNG', 0, position, pageWidth, pdfHeight);

  while (pdfHeight - position > pageHeight) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imageData, 'PNG', 0, position, pageWidth, pdfHeight);
  }

  pdf.save(`${fileName}.pdf`);
}
