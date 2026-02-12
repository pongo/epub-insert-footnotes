import { NoteLink } from '#src/app/NoteLink.js';
import { assert } from '#src/shared/utils/assert.js';
import { Chapters } from '#src/app/Chapters.js';
import type { ChapterFilePath } from '#src/app/types.js';
import { Zip } from '#src/shared/utils/Zip.js';
import { NoteLinks } from '#src/app/NoteLinks.js';
import { insertNoteToNextParagraph } from '#src/app/NextParagraph.js';
// import { performance } from 'perf_hooks';

export class EpubEditor {
  readonly chapters = new Chapters();
  readonly noteLinks = new NoteLinks(this.chapters);

  private readonly modifiedFiles: Set<ChapterFilePath> = new Set();
  private zip?: Zip;
  private readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

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
    // const t1 = performance.now();
    const note = this.noteLinks.findNote(noteLink.href);
    // console.log(`${perfDiff(t1)} ms | findNote`);
    if (note == null) return;

    this.modifiedFiles.add(noteLink.noteLinkFile);

    // const t2 = performance.now();
    insertNoteToNextParagraph(noteLink, `<strong>${noteLink.text}</strong>. ${note}`);
    // console.log(`${perfDiff(t2)} ms | insertNoteToNextParagraph`);
  }
}

// function perfDiff(start: number): number {
//   const end = performance.now();
//   return Math.round(end - start);
// }
