import * as esbuild from 'esbuild';
import { promises as fs } from 'fs';
import path from 'path';
import fse from 'fs-extra';

async function buildForVercel() {
  console.log('Building server for Vercel deployment...');

  // Build server with esbuild
  await esbuild.build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile: 'dist/index.js',
    external: ['express', 'axios', 'nanoid', 'fs', 'path', 'http', 'zod'],
  });

  // Create api directory for Vercel serverless functions
  await fse.ensureDir('dist/api');
  
  // Create a serverless function entry point
  const apiHandler = `
import app from '../index.js';
import { createServer } from 'http';

const server = createServer(app);
export default server;
`;

  await fs.writeFile('dist/api/index.js', apiHandler);

  // Copy static files
  try {
    await fse.copy('dist/public', 'dist', { overwrite: true });
    console.log('Static files copied successfully.');
  } catch (err) {
    console.error('Error copying static files:', err);
  }

  console.log('Build completed for Vercel deployment.');
}

buildForVercel().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});