
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const generateDocx = (text: string, fileName: string): void => {
  const paragraphs = text.split('\n').map(line => 
    new Paragraph({
        children: [new TextRun(line)],
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs,
    }],
  });

  Packer.toBlob(doc).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }).catch(error => {
    console.error("Lỗi khi tạo tệp DOCX:", error);
  });
};
