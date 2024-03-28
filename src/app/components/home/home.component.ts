import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PostPostReq } from '../../model/Posts.post.req.js';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { conn } from "../../../api/dbconnect";
import cors from "cors";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule,HttpClientModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  topPosts: PostPostReq[] = [];
  userId: string = ''; // เพิ่มตัวแปร userId


  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['user_id'];
      console.log('Received userId:', this.userId); // ใช้ console.log() เพื่อตรวจสอบค่า userId
    });
    this.getTopPosts(); // เรียกใช้เมื่อได้รับ user_id เรียบร้อยแล้ว

  }
  
  getTopPosts() {
    this.httpClient.get<any[]>('http://localhost:4000/facemash/top-post')
      .subscribe(
        (response) => {
          this.topPosts = response;
        },
        (error) => {
          console.error('Error fetching top posts:', error);
          // Handle error here
        }
      );
  }


  tovote() {
    this.router.navigate(['/vote']);
  }

  toProfile(userId: string) {
    this.router.navigate(['/profile'], { queryParams: { user_id: userId } });
  } 
  
  logout() {
    this.router.navigate(['/']);
  }
}



