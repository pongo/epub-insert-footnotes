import fs from 'fs';
import { Zip } from 'src/shared/utils/Zip.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Zip', () => {
  it('should save files in same order', async () => {
    // если файл редактируется, то тест может не проходить из-за разницы в сжатии
    // тогда нужно взять 6.rezipped.epub и переименовать в 6.epub
    // все-таки мы проверяем чтобы Zip оставался идентичным
    const input = `${__dirname}/data/6.epub`;
    const output = `${__dirname}/data/6.rezipped.epub`;
    const zip = new Zip(input);
    // const reFile = /\.x?html?$/i;
    // const files = zip.files.filter(e => reFile.test(e.path));
    //
    // for (const file of files) {
    //   zip.updateFile(file.path, await file.getText());
    // }
    await zip.writeZip(output);

    const expected = await fs.promises.readFile(input);
    const actual = await fs.promises.readFile(output);
    await fs.promises.unlink(output);
    expect(expected.compare(actual)).toBe(0);
  });
});
