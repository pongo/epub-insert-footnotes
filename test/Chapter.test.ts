import { describe, it, expect } from 'vitest';
import { Chapter } from '#src/app/Chapter.js';
import type { ChapterFilePath } from '#src/app/types.js';

const c = (html: string) => new Chapter('1.html' as ChapterFilePath, `<!DOCTYPE html><p>${html}</p>`);

describe('Chapter', () => {
  it('should detect <br> tag closing style', () => {
    // noinspection CheckTagEmptyBody,HtmlExtraClosingTag
    expect(c('<br></br>').closeBr).toBe(true);
    expect(c('<br/>').closeBr).toBe(false);
    expect(c('<br>').closeBr).toBe(false);
  });
});
