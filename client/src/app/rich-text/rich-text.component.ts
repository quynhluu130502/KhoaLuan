import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrl: './rich-text.component.css',
})
export class RichTextComponent {
  constructor(private sanitizer: DomSanitizer) {}
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  QuillConfiguration = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };
  @Input() detail: FormControl = new FormControl('', Validators.required);

}
