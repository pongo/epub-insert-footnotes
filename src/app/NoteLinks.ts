import { NoteLink } from 'src/app/NoteLink';
import { Chapters } from 'src/app/Chapters';
import $ from 'cheerio';
import escapeStringRegexp from 'escape-string-regexp';
import escape from 'escape-html';

export class NoteLinks {
  private readonly noteLinksStore: Map<string, NoteLink> = new Map();
  private collected = false;

  constructor(private readonly chapters: Chapters) {}

  values() {
    if (!this.collected) {
      this.collectNoteLinks();
    }

    return this.noteLinksStore.values();
  }

  findNote(href: string): string | undefined {
    if (!this.collected) {
      this.collectNoteLinks();
    }

    const $note = this.findNoteEl(href);
    if ($note == null) return undefined;
    return this.getNoteText(href, $note);
  }

  private collectNoteLinks() {
    this.noteLinksStore.clear();
    this.collected = true;

    for (const chapter of this.chapters.values()) {
      chapter.$('a').each((_i, a) => {
        const $a = $(a);
        const href = $a.attr('href');
        if (href == null || href === '') return;
        if (!NoteLink.isNoteLink($a)) return;
        const noteLink = new NoteLink($a, chapter.filePath, chapter.fileName);
        if (this.isBacklink(noteLink.href)) return;
        this.noteLinksStore.set(noteLink.href, noteLink);
      });
    }
  }

  private getNoteText(href: string, $note: Cheerio) {
    const origText = $note.text().trim();
    const noteLink = this.noteLinksStore.get(href);
    if (noteLink == null) return origText;
    return escape(removeReturns(removeNoteNumber(noteLink)));

    function removeNoteNumber(noteLink_: NoteLink) {
      const reNoteRemove = new RegExp(`^(${noteLink_.number}|${escapeStringRegexp(noteLink_.text)})[\t\r\n. ]\\s*`, 'i');
      return origText.replace(reNoteRemove, '');
    }

    function removeReturns(text: string) {
      return text.replace(/Вернуться\s*$/, '');
    }
  }

  private findNoteEl(href: string): Cheerio | undefined {
    const [file, id] = correctHref().split('#');

    // файл сноски не найден
    const chapter = this.chapters.getByFileName(file);
    if (chapter == null) return undefined;

    // сноска не найдена
    const $note = chapter.$(`#${id}`);
    if ($note.length === 0) return undefined;

    // защита от бэклинков
    if ($note[0].tagName.toLowerCase() === 'a') return $note.parent();

    return $note;

    function correctHref() {
      return href.replace(/^.+\//i, ''); // удаляет путь до файла, если есть
    }
  }

  private isBacklink(href: string) {
    return this.findNoteEl(href) == null;
  }
}
