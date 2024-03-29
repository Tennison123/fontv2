import { Component, } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PostPostReq } from '../../model/Posts.post.req.js';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, MatFormFieldModule, MatIconModule,HttpClientModule,CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  users: PostPostReq[] = []; // เก็บข้อมูลผู้ใช้
  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient) {}
  userId: string = ''; // เพิ่มตัวแปร userId

    ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['user_id'];
      console.log('Received userId:', this.userId); // ใช้ console.log() เพื่อตรวจสอบค่า userId
    });
    this.fetchUsers();
  }


  fetchUsers() {
    // เรียก API เพื่อดึงข้อมูลผู้ใช้
    this.httpClient.get<any[]>('https://backpro-4.onrender.com/facemash/admin')

      .subscribe(
        (users: any[]) => {
          this.users = users; // กำหนดข้อมูลผู้ใช้ให้กับตัวแปร users
        },
        (error) => {
          console.error('Error fetching users:', error);
          // จัดการข้อผิดพลาดตามที่ต้องการ เช่น แสดงข้อความผิดพลาดใน UI
        }
      );
  }




  toProfileuser(user_id:string) {
    this.router.navigate(['/adminView-profile'],  { queryParams: { user_id: user_id } });

  }
  // toProfileuser() {
  //   this.router.navigate(['/adminView-profile']);
  // }
  toPicture(user_id: string) {
    this.router.navigate(['/adminView-profile'],  { queryParams: { user_id: user_id } });
  }
  toProfile(userId: string) {
    this.router.navigate(['/profile'], { queryParams: { user_id: userId } });
  } 




  logout() {
    this.router.navigate(['/']);
  }
}