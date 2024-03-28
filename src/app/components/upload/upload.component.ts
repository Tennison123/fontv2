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
import { PostPostReq } from '../../model/Posts.post.req.js';
@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,MatFormFieldModule
    ,MatInputModule,CommonModule,FormsModule,HttpClientModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  userId: string = '';
  picture: string = '';
  pictureData: PostPostReq[] = []; // ประกาศ property 'pictureData'
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    // Get userId from URL parameter
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
  }

  uploadProfilePicture() {
    // ตรวจสอบว่ามีรูปภาพเกิน 5 รูปหรือไม่
    if (this.pictureData.length >= 5) {
      console.error('ไม่สามารถอัปโหลดรูปภาพเกิน 5 รูปได้');
      return;
    }
  
    if (!this.picture) {
      console.error('ไม่มีรูปภาพที่จะอัปโหลด');
      return;
    }
  
    const userData = {
      picture: this.picture
    };
  
    this.httpClient.post<any>(`http://localhost:4000/facemash/upload/${this.userId}`, userData)
      .subscribe((response: any) => {
        console.log('ภาพโปรไฟล์ได้รับการเพิ่มเรียบร้อยแล้ว:', response);
        // ทำสิ่งที่คุณต้องการหลังจากการเพิ่มภาพโปรไฟล์เสร็จสมบูรณ์
      }, (error: any) => {
        console.error('เกิดข้อผิดพลาดในการเพิ่มภาพโปรไฟล์:', error);
      });
  }
  

  check(userId: string) {
    this.router.navigate(['/profile'], { queryParams: { user_id: userId } });
  }
}
  

  // fetchUserPictures(userId: string) {
  //   try {
  //     // เรียกใช้ API เพื่อดึงข้อมูลภาพ
  //     this.httpClient.get<PostPostReq[]>(`http://localhost:4000/facemash/user/${userId}`)
  //       .toPromise()
  //       .then(response => {
  //         if (response && response.length > 0) {
  //           if (response.length > 4) {
  //             console.log('มีรูปภาพมากเกินไปที่จะแทรก');
  //           } else {
  //             this.pictureData = response.map(item => ({
  //               post_id: item.post_id,
  //               user_id: item.user_id,
  //               score: item.score,
  //               time: item.time,
  //               picture: item.picture,
  //               first_name: item.first_name,
  //               last_name: item.last_name,
  //               icon: item.icon,
  //               email: item.email,
  //               password: item.password,
  //               user_type: item.user_type,
  //               profile: item.profile
  //             }));
              
  //             console.log('แทรกรูปภาพเรียบร้อยแล้ว:', this.pictureData);
  //           }
  //         } else {
  //           console.log('ไม่พบรูปภาพสำหรับผู้ใช้นี้');
  //         }
  //       })
  //       .catch(error => {
  //         console.error('ไม่สามารถดึงรูปภาพของผู้ใช้ได้:', error);
  //       });
  //   } catch (error) {
  //     console.error('ไม่สามารถดึงรูปภาพของผู้ใช้ได้:', error);
  //   }
  // }

  

  // async onUpload() {
  //   try {
  //     // ส่งข้อมูลไปยัง API โดยใช้เอพีไอเส้นที่ให้มา
  //     const response = await this.httpClient.post<any>('http://localhost:4000/facemash/upload', {
  //       id: this.userId,
  //       picture: this.picture, // เลือกรูปภาพตามที่คุณต้องการ
  //       time: new Date().toISOString() // เพิ่มเวลาปัจจุบัน
  //     }).toPromise();
  //     console.log('Uploaded successfully:', response);
  //     // หลังจากอัปโหลดเสร็จสิ้น ทำสิ่งที่คุณต้องการได้ต่อไป
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //   }
  // }

  // check() {
  //   this.router.navigate(['/']);
  // }