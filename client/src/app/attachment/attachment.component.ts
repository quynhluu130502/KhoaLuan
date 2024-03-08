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
  @Input() attachmentFiles = new BehaviorSubject<{ item: File; url: string }[]>(
    []
  );

  get files(): { item: File; url: string }[] {
    return this.attachmentFiles.value;
  }

  set files(value: { item: File; url: string }[]) {
    this.attachmentFiles.next(value);
  }

  ngOnInit(): void {
    this.attachmentFiles.subscribe((items) => {
      if (items.length > 0) {
        const tempArray: { item: File; url: string }[] = [];
        for (let i = 0; i < items.length; i++) {
          this._ncgService.getFile(items[i].url).subscribe({
            next: (blob) => {
              const url = items[i].url;
              const fileName = url.split('/').pop() || '';
              const fileItem = new File([blob], fileName, { type: blob.type });
              tempArray.push({ item: fileItem, url: items[i].url });
            },
            error: (err) => {
              this._toastService.error(
                `${err} while fetching file from server`
              );
            },
          });
        }
        this.files = tempArray;
      }
    });
  }

  sanitize(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }
  removeFile(index: number) {
    const tempArray = this.files;
    tempArray.splice(index, 1);
    this.files = tempArray;
  }
  upload(e: FileList) {
    const formData = new FormData();
    Array.from(e).forEach((item: File) => {
      if (item.size > 10485760) {
        this._toastService.error('File size should not exceed 10MB');
        return;
      }
      const url = URL.createObjectURL(item);
      const tempArray = this.files;
      this.files = tempArray.concat({ item, url });
      formData.append('file', item);
    });

    // Upload the files to the server
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
