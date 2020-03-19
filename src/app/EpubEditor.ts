import { NoteLink } from 'src/app/NoteLink';
import { assert } from 'src/shared/utils/assert';
import { Chapters } from 'src/app/Chapters';
import { ChapterFilePath } from 'src/app/types';
import { Zip } from 'src/shared/utils/Zip';
import { NoteLinks } from 'src/app/NoteLinks';
import { insertNoteToNextParagraph } from 'src/app/NextParagraph';

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
    insertNoteToNextParagraph(noteLink, `<strong>${noteLink.text}</strong>. ${note}`);
  }
}
