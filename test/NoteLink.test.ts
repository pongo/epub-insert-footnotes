import $ from 'cheerio';
import { isLooksLikeNote, NoteLink, parseNoteNumber } from 'src/app/NoteLink.js';
import type { ChapterFileName, ChapterFilePath } from 'src/app/types.js';

describe('NoteLink', () => {
  it('isNoteLink() should check is <a> tag is a note link', () => {
    expect(NoteLink.isNoteLink($(`<a href="ch2.xhtml#id1" class="a">[1]</a>`))).toBeTruthy();

    expect(NoteLink.isNoteLink($(`<a href="ch2.xhtml#id1" class="a">name</a>`))).toBeFalsy();
    expect(NoteLink.isNoteLink($(`<a href="http://yandex.ru#id1" class="a">1</a>`))).toBeFalsy();
    expect(NoteLink.isNoteLink($(`<a href="" class="a">1</a>`))).toBeFalsy();
    expect(NoteLink.isNoteLink($(`<a class="a">1</a>`))).toBeFalsy();
  });

  it('should have attributes', () => {
    const noteLink = new NoteLink(
      $(`<a href="ch2.xhtml#id1" class="a">[1]</a>`),
      '1.xhtml' as ChapterFilePath,
      '1.xhtml' as ChapterFileName,
    );

    expect(noteLink.href).toBe('ch2.xhtml#id1');
    expect(noteLink.id).toBeUndefined();
    expect(noteLink.text).toBe('[1]');
    expect(noteLink.number).toBe(1);
    expect(noteLink.noteLinkFile).toBe('1.xhtml');

    expect(
      new NoteLink($(`<a href="ch2.xhtml#id1" id="aaa">[1]</a>`), '' as ChapterFilePath, '' as ChapterFileName).id,
    ).toBe('aaa');
  });
});

describe('isLooksLikeNote()', () => {
  describe.each([
    ['', false],
    ['lala', false],
    ['1', true],
    [' 2221 ', true],
    ['[1]', true],
    ['{1}', true],
    ['( 1 )', true],
  ])('isLooksLikeNote(%p)', (text, expected) => {
    it('should check if it looks like note', () => {
      expect(isLooksLikeNote(text)).toBe(expected);
    });
  });
});

describe('parseNoteNumber()', () => {
  describe.each([
    ['', undefined],
    ['lala', undefined],
    ['()', undefined],
    ['1', 1],
    [' 2221 ', 2221],
    ['[1]', 1],
    ['{1}', 1],
    ['( 1 )', 1],
  ])('parseNoteNumber(%p)', (text, expected) => {
    it('should parse note number', () => {
      expect(parseNoteNumber(text)).toBe(expected);
    });
  });
});
