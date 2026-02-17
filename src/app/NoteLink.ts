import { assert } from '#src/shared/utils/assert.js';
import type { ChapterFileName, ChapterFilePath } from '#src/app/types.js';
import { type Cheerio } from 'cheerio';
import { type Element } from 'domhandler';

const reNoteTitle = /^\s*[{[(]*\s*(\d+|\*)\s*[}\])]*\s*$/i;

export class NoteLink {
  readonly href: string;
  readonly id?: string;
  readonly text: string;
  readonly number?: number;

  readonly $a: Cheerio<Element>;
  readonly noteLinkFile: ChapterFilePath;

  constructor($a: Cheerio<Element>, noteLinkFile: ChapterFilePath, noteLinkFileName: ChapterFileName) {
    this.$a = $a;
    this.noteLinkFile = noteLinkFile;
    assert(NoteLink.isNoteLink($a));

    const href = $a.attr('href');
    assert(href != null);
    this.href = prependFileName(href, noteLinkFileName);

    this.id = $a.attr('id');
    this.text = $a.text();

    this.number = parseNoteNumber(this.text);
  }

  static isNoteLink($a: Cheerio<Element>) {
    if (!isLooksLikeNote($a.text())) return false;

    const href = $a.attr('href') ?? '';
    if (href.trim().length === 0) return false;
    if (href.includes('backlink')) return false;
    // noinspection RedundantIfStatementJS
    if (isItUrl(href)) return false;

    return true;
  }
}

function prependFileName(href: string, fileName: string): string {
  if (href.startsWith('#')) return `${fileName}${href}`;
  return href;
}

export function isLooksLikeNote(text: string) {
  return reNoteTitle.test(text);
}

export function isItUrl(text: string) {
  return /:\/\//i.test(text);
}

export function parseNoteNumber(text: string) {
  const found = reNoteTitle.exec(text);
  if (found == null) return undefined;
  return parseInt(found[1], 10);
}
