import { describe, it, expect, beforeEach } from 'vitest';
import { EpubEditor } from '#src/app/EpubEditor.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('EpubEditor', () => {
  describe('insertFootNote()', () => {
    describe('/2/', () => {
      let epub: EpubEditor;
      let orig: string;

      beforeEach(async () => {
        epub = new EpubEditor(`${__dirname}/data/2.epub`);
        await epub.parse();
        orig = epub.chapters.getByFileName('ch1.xhtml')!.html();
      });

      it('should do nothing if link not found', () => {
        const noFoundLink = { ...[...epub.noteLinks.values()][0] };
        // @ts-ignore
        // noinspection JSConstantReassignment
        noFoundLink.href = 'notfound';

        epub.insertFootNote(noFoundLink); // tslint:disable-line
        const actual = epub.chapters.getByFileName('ch1.xhtml')!.html();

        expect(actual).toBe(orig);
        // @ts-ignore
        expect(epub.modifiedFiles.size).toBe(0);
      });

      it('should insert footnote inside file', () => {
        const noteLink = [...epub.noteLinks.values()][0];

        epub.insertFootNote(noteLink);
        const actual = epub.chapters.getByFileName('ch1.xhtml')!.html();

        expect(actual).not.toBe(orig);
        expect(actual).toMatch(
          /ааааааааааааа\.<\/p><div class="zz07-footnote" style=.+?><strong>\[1]<\/strong>\. «ааааа»/i,
        );
        // @ts-ignore
        expect([...epub.modifiedFiles]).toStrictEqual(['OPS/ch1.xhtml']);
      });
    });

    it('should insert footnote before series of <br> tags', async () => {
      const epub = new EpubEditor(`${__dirname}/data/6.epub`);
      await epub.parse();
      const orig = epub.chapters.getByFileName('content2.html')!.html();
      const noteLink = [...epub.noteLinks.values()][0];

      epub.insertFootNote(noteLink);
      const actual = epub.chapters.getByFileName('content2.html')!.html();
      expect(actual).not.toBe(orig);
      expect(actual).toMatch(/<span class="zz07-footnote" style=.+?<\/span><br><\/br><br><\/br>/i);
    });
  });

  describe('For all epub test files', () => {
    describe.each([[1], [2], [3], [4], [5], [6]])(`/(%p)/`, (testFileNum) => {
      it(`should insert notes without errors for ${testFileNum}.epub`, async () => {
        const epub = new EpubEditor(`${__dirname}/data/${testFileNum}.epub`);
        await epub.parse();
        for (const noteLink of epub.noteLinks.values()) {
          expect(() => epub.insertFootNote(noteLink)).not.toThrow();
        }
        for (const chapter of epub.chapters.values()) {
          expect(chapter.html()).toMatchSnapshot();
        }
      });
    });
  });
});
