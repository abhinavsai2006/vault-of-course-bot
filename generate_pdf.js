const puppeteer = require('puppeteer');
const fs = require('fs');

// Simple script to convert the markdown to HTML, then to PDF using puppeteer
(async () => {
  const markdown = fs.readFileSync('Submission_Document.md', 'utf-8');
  
  // Minimal HTML wrapper since we just need something to print
  // To make it look decent, we can use a basic markdown css
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Submission Document</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; line-height: 1.6; }
        h1, h2, h3 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; padding: 5px; margin-bottom: 20px;}
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px;}
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    </head>
    <body>
      <div id="content"></div>
      <script>
        document.getElementById('content').innerHTML = marked.parse(\`${markdown.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
      </script>
    </body>
    </html>
  `;

  fs.writeFileSync('temp.html', htmlContent);

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Go to local file
  const path = require('path');
  const fileUrl = 'file://' + path.resolve('temp.html');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  // Wait a bit for images to load
  await new Promise(r => setTimeout(r, 2000));
  
  await page.pdf({ path: 'Submission_Document.pdf', format: 'A4', margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' } });
  
  await browser.close();
  fs.unlinkSync('temp.html');
  console.log("PDF generated successfully!");
})();
