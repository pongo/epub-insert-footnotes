import { EpubEditor } from 'src/app/EpubEditor.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('NoteLinks', () => {
  describe('/2/', () => {
    let epub: EpubEditor;

    beforeAll(async () => {
      epub = new EpubEditor(`${__dirname}/data/2.epub`);
      await epub.parse();
    });

    it('values()', () => {
      expect([...epub.noteLinks.values()].length).toBe(1);
    });

    it('findNote() by url', () => {
      expect(epub.noteLinks.findNote('ch-1.xhtml#id1')).toBeUndefined();
      expect(epub.noteLinks.findNote('ch2.xhtml#id1')).toBe(
        '«ааааа» (billy goats) — ааааааааааааааааааа  аааааааааа, аааа ааа, ааааа аааа. ааааааааа ааа, аааа: «а аааа, аааааааа. аа  ааааааа». аааааааааааааа аа  а. аааа  ааааааааааааа аааа.',
      );
    });
  });

  describe('/1/', () => {
    let epub: EpubEditor;

    beforeAll(async () => {
      epub = new EpubEditor(`${__dirname}/data/1.epub`);
      await epub.parse();
    });

    it('values()', () => {
      expect([...epub.noteLinks.values()].length).toBe(536);
    });

    it('findNote() by url', () => {
      expect(epub.noteLinks.findNote('ch2.xhtml#id1')).toBe('ааааа (аа.)');
    });
  });

  describe('/3/', () => {
    let epub: EpubEditor;

    beforeAll(async () => {
      epub = new EpubEditor(`${__dirname}/data/3.epub`);
      await epub.parse();
    });

    it('values()', () => {
      expect([...epub.noteLinks.values()].length).toBe(314);
    });

    it('findNote() by url', () => {
      expect(epub.noteLinks.findNote('../Text/notes.xhtml#n1-14')).toBe(
        'ааааа а. аааааааа ааа аааааааа а. аааа, “аааааааа а. а. ааааа аа аа., “аааааааааааа аааа-ааааааааа аааааа аааа аааааааааааа ааааааааа ааа ааааааааа ааааааааааа аа аааааааааааа аааааааааа ааааааааааааааааа,” аааааааааааа 226 (аааааааа 13, 2012): 40–50, ааа:',
      );
    });
  });

  describe('/4/', () => {
    let epub: EpubEditor;

    beforeAll(async () => {
      epub = new EpubEditor(`${__dirname}/data/4.epub`);
      await epub.parse();
    });

    it('values()', () => {
      expect([...epub.noteLinks.values()].length).toBe(23);
    });

    it('findNote() by url', () => {
      expect(epub.noteLinks.findNote('contentnotes0.html#n_1')).toBe('ааааааа ааааа аааааааа-аааааааааааааа.');
    });
  });

  describe('/5/', () => {
    let epub: EpubEditor;

    beforeAll(async () => {
      epub = new EpubEditor(`${__dirname}/data/5.epub`);
      await epub.parse();
    });

    it('values()', () => {
      expect([...epub.noteLinks.values()].length).toBe(76);
    });

    it('findNote() by url', () => {
      expect(epub.noteLinks.findNote('978544611021-2.xhtml#footnote-49522-1')).toBe(
        'аааааааа, аа аа  ааааааааа, аа аааааааа  аа  аааааа, ааа  аааа — аааааааааааааааааа «аааа» аааааааа. аааааааааааа аааааааа, ааа «ааааааа», «ааааааааа  ааааааа», «ааааааааааааааа», «ааааааааа»  а.а.',
      );
    });
  });
});
