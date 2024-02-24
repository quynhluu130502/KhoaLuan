import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NcgService } from '../services/ncg.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrl: './attachment.component.scss',
})
export class AttachmentComponent implements OnInit {
  constructor(
    private _sanitizer: DomSanitizer,
    private _toastService: ToastrService,
    private _ncgService: NcgService
  ) {}
  @Input() attachmentFiles = new BehaviorSubject<any[]>([]);
  private _files: { item: File; url: string }[] = [];

  get files(): { item: File; url: string }[] {
    return this._files;
  }

  set files(value: { item: File; url: string }[]) {
    this._files = value;
  }

  ngOnInit(): void {
    this.attachmentFiles.subscribe((files) => {
      if (files.length > 0) {
        files.forEach((file: { url: string }) => {
          this._ncgService.getFile(file.url).subscribe((blob) => {
            const url = file.url;
            const fileName = url.split('/').pop() || '';
            const fileItem = new File([blob], fileName, { type: blob.type });
            this.files.push({ item: fileItem, url: file.url });
          });
        });
      }
    });
  }

  sanitize(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }
  removeFile(index: number) {
    this.files.splice(index, 1);
  }
  upload(e: FileList) {
    Array.from(e).forEach((item: File) => {
      const url = URL.createObjectURL(item);
      this.files = this.files.concat({ item, url: url });
    });

    // Upload the files to the server
    const formData = new FormData();
    this.files.forEach((file) => {
      formData.append('file', file.item);
    });
    this._ncgService
      .addFiles(formData)
      .subscribe((event: HttpEvent<ResponseType>) => {
        if (event.type === HttpEventType.Response) {
          for (let i = 0; i < this.files.length; i++) {
            if (event.body && event.body[i]) {
              this.files[i].url = event.body[i] as string;
            }
          }
          this._toastService.success('File uploaded successfully!');
        }
      });
  }
}
