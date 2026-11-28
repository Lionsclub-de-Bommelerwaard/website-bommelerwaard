const fs = require('node:fs/promises');
const path = require('node:path');
const { minify } = require('terser');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'site');
const outputDir = path.join(root, 'dist');

async function minifyJavaScript(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await minifyJavaScript(filePath);
    } else if (entry.isFile() && path.extname(entry.name) === '.js') {
      const source = await fs.readFile(filePath, 'utf8');
      const result = await minify(source, {
        compress: true,
        mangle: true,
        format: { comments: false }
      });
      if (result.code === undefined) {
        throw new Error(`Terser did not produce output for ${filePath}`);
      }
      await fs.writeFile(filePath, `${result.code}\n`);
    }
  }
}

async function build() {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.cp(sourceDir, outputDir, { recursive: true });
  await minifyJavaScript(path.join(outputDir, 'js'));
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
