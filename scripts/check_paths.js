import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unitapPath = path.join(__dirname, '../informations/unitap_final/data.json');
const commonAppPath = path.join(__dirname, '../informations/commonapp_data/commonapp_complete.json');

console.log('__dirname:', __dirname);
console.log('Unitap Path:', unitapPath);
console.log('Exists:', fs.existsSync(unitapPath));

console.log('CommonApp Path:', commonAppPath);
console.log('Exists:', fs.existsSync(commonAppPath));

if (fs.existsSync(unitapPath)) {
    try {
        const stats = fs.statSync(unitapPath);
        console.log('Unitap Size:', stats.size);
        // Try reading first 100 chars
        const content = fs.readFileSync(unitapPath, 'utf8');
        console.log('Unitap Start:', content.substring(0, 100));
    } catch (e) {
        console.error('Error reading Unitap:', e);
    }
}
