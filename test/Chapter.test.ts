import { Chapter } from 'src/app/Chapter';
import { ChapterFilePath } from 'src/app/types';

const c = (html: string) => new Chapter('1.html' as ChapterFilePath, `<!DOCTYPE html><p>${html}</p>`);

describe('Chapter', () => {
  it('should detect <br> tag closing style', () => {
    // noinspection CheckTagEmptyBody,HtmlExtraClosingTag
    expect(c('<br></br>').closeBr).toBe(true);
    expect(c('<br/>').closeBr).toBe(false);
    expect(c('<br>').closeBr).toBe(false);
  });
});
