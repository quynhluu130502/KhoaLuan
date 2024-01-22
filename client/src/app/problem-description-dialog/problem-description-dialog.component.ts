import { Component, Inject , ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  styleUrl: './problem-description-dialog.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProblemDescriptionDialogComponent {
  problemDescription: FormControl = new FormControl('');
  files: { item: File; url: string }[] = [];
  uploadForm: FormGroup = new FormGroup({});
  msg: string = '';
  progress: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private _sanitizer: DomSanitizer,
    private _ncgService: NcgService,
    private _toastService: ToastrService,
    public dialogRef: MatDialogRef<ProblemDescriptionDialogComponent>,
    public _formBuilder: FormBuilder
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  sanitize(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  upload(e: FileList) {
    Array.from(e).forEach((item: File) => {
      const url = URL.createObjectURL(item);
      this.files.push({ item, url: url });
    });
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  onUploadlClick() {
    const formData = new FormData();
    this.files.forEach((file) => {
      formData.append('file', file.item);
    });
    this._ncgService.addFiles(formData).subscribe((event: HttpEvent<ResponseType>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          // console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          // console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round((event.loaded / (event.total ?? 1)) * 100);
          // console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          // console.log('File uploaded successfully!', event.body);
          setTimeout(() => {
            this.progress = 0;
            this.msg = 'File uploaded successfully!';
          }, 1500);
      }
      this.dialogData.files = this.files;
      this._toastService.success('File uploaded successfully!');
    });
  }
}
