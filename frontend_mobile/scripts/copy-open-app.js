import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFile = path.join(projectDirectory, 'public', 'open-app.html');
const destinationDirectory = path.join(projectDirectory, 'dist', 'open-app');
const destinationFile = path.join(destinationDirectory, 'index.html');

await mkdir(destinationDirectory, { recursive: true });
await copyFile(sourceFile, destinationFile);