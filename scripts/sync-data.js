const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'data');
const dstDir = path.join(process.cwd(), 'public', 'data');

const files = ['routes.json', 'trips.json', 'stops.json', 'stop_times.json'];

function copySafe(src, dst) {
  fs.copyFileSync(src, dst);
}

function run() {
  if (!fs.existsSync(srcDir)) {
    console.error('Source data directory missing:', srcDir);
    process.exit(1);
  }
  fs.mkdirSync(dstDir, { recursive: true });
  for (const f of files) {
    const from = path.join(srcDir, f);
    const to = path.join(dstDir, f);
    if (!fs.existsSync(from)) {
      console.warn('Missing file:', from);
      continue;
    }
    copySafe(from, to);
    console.log('Copied', from, '→', to);
  }
}

run();
