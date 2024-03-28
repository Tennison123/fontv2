import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PostPostReq } from '../../model/Posts.post.req.js';
import axios from 'axios';
import { conn } from "../../../api/dbconnect";
import cors from "cors";
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatToolbarModule,HttpClientModule,MatButtonModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  pictureData: PostPostReq[] = [];
  userId: string = ''; // กำหนดค่าเริ่มต้นสำหรับ userId

  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['user_id'];
      console.log('Received user ID:', this.userId);
      this.getPictureData(this.userId);
    });
  }
  
  
  
  // เมทอดเพื่อดึงข้อมูลภาพจาก API โดยใช้ userId
  getPictureData(id: string) {
    if (!id) {
      console.error('User ID is undefined or empty');
      return; // ออกจากเมทอดถ้า user_id เป็น undefined หรือว่างเปล่า
    }
  
    this.httpClient.get(`http://localhost:4000/facemash/profile/${id}`).subscribe(
      (data: any) => {
        this.pictureData = data;
      },
      (error) => {
        console.error('Error fetching picture data:', error);
      }
    );
  }
  

  // เมทอดตัวอย่างสำหรับการนำทางไปยังหน้าโหวต
  toVote() {
    this.router.navigate(['/vote']);
  }

  // เมทอดตัวอย่างสำหรับการนำทางไปยังหน้าโปรไฟล์
  toProfile() {
    this.router.navigate(['/']);
  }

  // เมทอดตัวอย่างสำหรับการนำทางไปยังหน้าแก้ไขโปรไฟล์
  toEdit(userId: string) {
    this.router.navigate(['/edit'], { queryParams: { user_id: userId } });
  }

  // เมทอดตัวอย่างสำหรับการนำทางไปยังหน้าอัปโหลดภาพ
  toUpload(userId: string) {
    this.router.navigate(['/upload'], { queryParams: { user_id: userId } });
  }
  // เมทอดสำหรับการล็อกเอ้าท์
  logout() {
    this.router.navigate(['/']);
  }

  // เพิ่มเมทอดใหม่
goToGraph(post_id: string) {
  // ส่งค่า URL ของภาพไปยังหน้า graph
  this.router.navigate(['/graph'], { queryParams: { post_id: post_id } });
}
}