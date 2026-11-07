import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '..', 'src', 'components', 'reactbits');

function extractFile(mdName, compName) {
  const content = fs.readFileSync(path.join(__dirname, '..', mdName), 'utf8');
  
  // Find ### Full Component Source
  const sourceMarker = '### Full Component Source';
  const cssMarker = '### Component CSS';

  const sourceIdx = content.indexOf(sourceMarker);
  const cssIdx = content.indexOf(cssMarker);

  if (sourceIdx === -1 || cssIdx === -1) {
    console.error('Markers not found in', mdName);
    return;
  }

  // Find ```jsx after sourceMarker
  const codeBlockStart = content.indexOf('```', sourceIdx);
  const codeBlockStartLineEnd = content.indexOf('\n', codeBlockStart);
  
  // Find closing ``` right before ### Component CSS
  const codeBlockEnd = content.lastIndexOf('```', cssIdx);

  const jsCode = content.slice(codeBlockStartLineEnd + 1, codeBlockEnd).trim();

  // Find ```css after cssMarker
  const cssBlockStart = content.indexOf('```css', cssIdx);
  const cssBlockStartLineEnd = content.indexOf('\n', cssBlockStart);
  const cssBlockEnd = content.indexOf('```', cssBlockStartLineEnd);

  const cssCode = content.slice(cssBlockStartLineEnd + 1, cssBlockEnd).trim();

  fs.writeFileSync(path.join(targetDir, compName + '.jsx'), jsCode, 'utf8');
  fs.writeFileSync(path.join(targetDir, compName + '.css'), cssCode, 'utf8');

  console.log(`Extracted ${compName}: JS length = ${jsCode.length}, CSS length = ${cssCode.length}`);
}

extractFile('hero-background.md', 'Galaxy');
extractFile('hero-layoutkiri-judul.md', 'TechText');
extractFile('hero-layoutkanan.md', 'DitherVeil');
extractFile('logo-loop.md', 'LogoLoop');
