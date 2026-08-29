import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const configPath = '.vercel/output/functions/_render.func/.vc-config.json';

if (existsSync(configPath)) {
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  
  if (config.runtime === 'nodejs18.x') {
    config.runtime = 'nodejs20.x';
    writeFileSync(configPath, JSON.stringify(config, null, '\t'));
    console.log('✓ Patched Vercel function runtime to Node.js 20');
  } else {
    console.log('✓ Vercel function runtime is already:', config.runtime);
  }
} else {
  console.log('⚠ Vercel function config not found at', configPath);
}
