import { describe, it, expect, beforeAll } from 'vitest';
import { Zip } from 'src/shared/utils/Zip.js';
import { Chapters } from 'src/app/Chapters.js';
import { assert } from 'src/shared/utils/assert.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Chapters', () => {
  let chapters: Chapters;

  beforeAll(async () => {
    const zip = new Zip(`${__dirname}/data/2.epub`);
    chapters = new Chapters();
    await chapters.parseFromZip(zip);
  });

  it('should get all chapters', () => {
    expect([...chapters.values()].length).toBe(3);
  });

  it('should get chapter by name', () => {
    const chapter = chapters.getByFileName('ch1.xhtml');
    assert(chapter != null);
    expect(chapter.filePath).toBe('OPS/ch1.xhtml');
  });

  it('should get chapter by path', () => {
    const chapter = chapters.getByFilePath('OPS/ch1.xhtml');
    assert(chapter != null);
    expect(chapter.fileName).toBe('ch1.xhtml');
  });
});
