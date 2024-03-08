import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NcgService } from '../services/ncg.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

interface DialogData {
  description: string;
  files: { item: File; url: string }[];
}

@Component({
  selector: 'app-problem-description-dialog',
  templateUrl: './problem-description-dialog.component.html',
  styleUrl: './problem-description-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProblemDescriptionDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private _sanitizer: DomSanitizer,
    private _ncgService: NcgService,
    private _toastService: ToastrService,
    public dialogRef: MatDialogRef<ProblemDescriptionDialogComponent>
  ) {}

  msg: string = '';
  progress: number = 0;

  onCancelClick(): void {
    this.dialogRef.close();
  }

  sanitize(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  upload(e: FileList) {
    const formData = new FormData();
    Array.from(e).forEach((item: File) => {
      const url = URL.createObjectURL(item);
      this.dialogData.files = this.dialogData.files.concat({ item, url: url });
      formData.append('file', item);
    });
    this._ncgService
      .addFiles(formData)
      .subscribe((event: HttpEvent<ResponseType>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            // console.log('Request has been made!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(
              (event.loaded / (event.total ?? 1)) * 100
            );
            // console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.ResponseHeader:
            // console.log('Response header has been received!');
            break;
          case HttpEventType.DownloadProgress:
            // console.log(`Download in progress! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            // console.log('File uploaded successfully!', event.body);
            setTimeout(() => {
              this.progress = 0;
              this.msg = 'File uploaded successfully!';
            }, 1500);
            break;
          case HttpEventType.User:
            // console.log('User event');
            break;
        }
        if (event.type === HttpEventType.Response) {
          for (let i = 0; i < this.dialogData.files.length; i++) {
            if (event.body && event.body[i]) {
              this.dialogData.files[i].url = event.body[i] as string;
            }
          }
          this._toastService.success('File uploaded successfully!');
        }
      });
  }

  removeFile(index: number) {
    this.dialogData.files.splice(index, 1);
  }

  onSubmitClick() {
    this.dialogRef.close(this.dialogData);
  }
}
