import { NoteLink } from 'src/app/NoteLink';

type InsertMode = 'append' | 'after' | 'before';

class NextParagraph {
  private inside = false;
  private insertMode: InsertMode = 'after';
  constructor(private readonly noteLink: NoteLink) {}

  insert(text: string): void {
    const $p = this.selectNextParagraph();
    const tag = this.inside ? 'span' : undefined;
    const code = aside(text, tag);
    // TODO: переделать на switch, добавив default и 'after'
    if (this.insertMode === 'append') $p.append(code);
    else if (this.insertMode === 'before') $p.before(code);
    else $p.after(code);
  }

  private selectNextParagraph(): Cheerio {
    return this.checkNextAsides(this.findP());
  }

  private checkNextAsides($p: Cheerio): Cheerio {
    // .nextAll собирает все элементы, а затем делает фильтр по селектору. это медленно.
    // для ускорения мы сперва делаем .next — и если там что-то есть, то уже делаем полный .nextAll
    if ($p.next('.zz07-footnote').length > 0) {
      const $nextAsides = $p.nextAll('.zz07-footnote');
      if ($nextAsides.length > 0) {
        this.insertMode = 'after';
        return $nextAsides.last();
      }
    }
    return $p;
  }

  private findP() {
    const $el = this.noteLink.$a.parents('p, li, h1, h2, h3, h4, h5, h6, h7, h8, table, figure');
    if ($el.length === 0) {
      throw Error(`$a parent not found: [${this.noteLink.href}](${this.noteLink.noteLinkFile})`);
    }

    if ($el.find('br').length >= 2) {
      this.inside = true;
      this.insertMode = 'before';
      return $el.find('br').first();
    }

    if ($el[0].tagName.toLowerCase() === 'li') {
      this.insertMode = 'append';
    }

    return $el;
  }
}

function aside(text: string, tag = 'div') {
  const style = `text-indent: 0; border-top: 0px solid #ccc; border-bottom: 0px solid #ccc; margin: 0.5em 0; padding: 0.5em; background-color: #EFEBE9; color: #000; display: block;`;
  return `<${tag} class="zz07-footnote" style="${style}">${text}</${tag}>`;
}

export function insertNoteToNextParagraph(noteLink: NoteLink, text: string): void {
  new NextParagraph(noteLink).insert(text);
  // noteLink.$a.removeAttr('href');
}
