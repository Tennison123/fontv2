import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import axios from 'axios';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,MatFormFieldModule
    ,MatInputModule,CommonModule,FormsModule,HttpClientModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {}


  picture: string = '';
  userId: string = '';

  ngOnInit(): void {
    // Get userId from URL parameter
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
  }

  async onUpload() {
    if (!this.picture) {
      console.error('No picture URL or file selected');
      return;
    }

    try {
      // ถ้ารูปภาพเป็น URL
      if (this.isUrl(this.picture)) {
        console.log('URL:', this.picture);
      } else {
        // ถ้ารูปภาพเป็นไฟล์ สามารถอัพโหลดได้โดยใช้ HttpClient
        const formData = new FormData();
        formData.append('file', this.picture);

        // ส่งค่า userId พร้อมกับไฟล์
        formData.append('userId', this.userId);

        const response = await this.httpClient.post<any>('http://localhost:4000/facemash/uploadpicture/upload', formData).toPromise();
        console.log('Uploaded successfully:', response);
      }

      // Redirect or handle response as needed
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }

  check() {
    this.router.navigate(['/']);
  }

  // ฟังก์ชันเพื่อตรวจสอบว่าข้อมูลเป็น URL หรือไม่
  isUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
}