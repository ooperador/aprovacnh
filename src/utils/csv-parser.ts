export function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let col = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        col += '"';
        i++; // Skip next quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      row.push(col.trim());
      col = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (col.length > 0 || row.length > 0) {
        row.push(col.trim());
        result.push(row);
      }
      row = [];
      col = '';
      if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
    } else {
      col += char;
    }
  }
  
  if (col.length > 0 || row.length > 0) {
    row.push(col.trim());
    result.push(row);
  }

  return result;
}

export function generateCSV(rows: string[][]): string {
  return rows.map(row => 
    row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')
  ).join('\n');
}
