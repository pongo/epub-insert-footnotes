import { NoteLink } from 'src/app/NoteLink';
import { assert } from 'src/shared/utils/assert';
import { Chapters } from 'src/app/Chapters';
import { ChapterFilePath } from 'src/app/types';
import { Zip } from 'src/shared/utils/Zip';
import { NoteLinks } from 'src/app/NoteLinks';

export class EpubEditor {
  readonly chapters = new Chapters();
  readonly noteLinks = new NoteLinks(this.chapters);

  private readonly modifiedFiles: Set<ChapterFilePath> = new Set();
  private zip?: Zip;

  constructor(private readonly path: string) {}

  async parse() {
    assert(this.zip == null, 'parse() should be called only once');
    this.zip = new Zip(this.path);
    await this.chapters.parseFromZip(this.zip);
  }

  async save() {
    assert(this.zip != null, 'save() should be called after parse()');
    if (this.modifiedFiles.size === 0) return;

    for (const path of this.modifiedFiles) {
      const chapter = this.chapters.getByFilePath(path);
      assert(chapter != null);
      this.zip.updateFile(path, chapter.html());
    }

    await this.zip.writeZip();
    this.modifiedFiles.clear();
  }

  insertFootNote(noteLink: NoteLink) {
    const note = this.noteLinks.findNote(noteLink.href);
    if (note == null) return;

    this.modifiedFiles.add(noteLink.noteLinkFile);
    insertAside(`<strong>${noteLink.text}</strong>. ${note}`);

    function insertAside(text: string) {
      const [$p, inside, insertMode] = selectNextParagraph(noteLink);
      const tag = inside ? 'span' : undefined;
      const code = aside(text, tag);
      if (insertMode === 'append') $p.append(code);
      else if (insertMode === 'before') $p.before(code);
      else $p.after(code);
    }

    function aside(text: string, tag = 'div') {
      const style = `text-indent: 0; border-top: 0px solid #ccc; border-bottom: 0px solid #ccc; margin: 0.5em 0; padding: 0.5em; background-color: #EFEBE9; color: #000; display: block;`;
      return `<${tag} class="zz07-footnote" style="${style}">${text}</${tag}>`;
    }
  }
}

function selectNextParagraph(noteLink: NoteLink): [Cheerio, boolean, 'append' | 'after' | 'before'] {
  let inside = false;
  let insertMode: 'append' | 'after' | 'before' = 'after';
  const $p = findP();
  const $corrected = checkNextAsides();
  return [$corrected, inside, insertMode];

  function checkNextAsides(): Cheerio {
    const $nextAsides = $p.nextAll('.zz07-footnote');
    if ($nextAsides.length > 0) {
      insertMode = 'after';
      return $nextAsides.last();
    }
    return $p;
  }

  function findP() {
    const $el = noteLink.$a.parents('p, li, h1, h2, h3, h4, h5, h6, h7, h8, table, figure');
    if ($el.length === 0) {
      throw Error(`$a parent not found: [${noteLink.href}](${noteLink.noteLinkFile})`);
    }
    if ($el.find('br').length >= 2) {
      inside = true;
      insertMode = 'before';
      return $el.find('br').first();
    }
    if ($el[0].tagName.toLowerCase() === 'li') {
      insertMode = 'append';
    }
    return $el;
  }
}
