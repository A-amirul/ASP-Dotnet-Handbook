import fs from 'fs';

const mainPath = 'src/data/bilingualPatches.ts';
const genPath = 'src/data/_generated_patches.ts.txt';
let main = fs.readFileSync(mainPath, 'utf8');
const gen = fs.readFileSync(genPath, 'utf8');
const startKey = "'1-the-shopping-cart-complex-calculation'";
const endKey = "'42-senior-sliding-window-rate-limit-in-memory-sketch'";
const startIdx = main.indexOf(startKey);
const endMatch = main.indexOf(endKey);
if (startIdx < 0 || endMatch < 0) {
  console.error('markers not found', startIdx, endMatch);
  process.exit(1);
}
const endBlock = main.indexOf('  },', endMatch) + 4;
const genStart = gen.indexOf(startKey);
const genEnd = gen.indexOf('  },', gen.indexOf(endKey)) + 4;
const newBlock = gen.slice(genStart, genEnd);
main = main.slice(0, startIdx) + newBlock + main.slice(endBlock);
fs.writeFileSync(mainPath, main);
console.log('replaced coding tasks block');
