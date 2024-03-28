import { Component } from '@angular/core';
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
  selector: 'app-edit',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,MatFormFieldModule
    ,MatInputModule,CommonModule,FormsModule,HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {

  userId: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  profile: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['user_id'];
      console.log('Received user ID:', this.userId);
      this.edit(this.userId);
    });
  }

  edit(userId: string) {
    if (this.password !== this.confirmPassword) {
      console.error('รหัสผ่านและรหัสผ่านยืนยันไม่ตรงกัน');
      return;
    }

    const userData = {
      first_name: this.firstName,
      last_name: this.lastName,
      password: this.password,
      profile: this.profile
    };

    // ใช้ HttpClient ใน Angular
    this.httpClient.put(`http://localhost:4000/facemash/edit/${userId}`, userData)
      .subscribe((response: any) => {
        console.log('ผู้ใช้ได้รับการอัพเดตเรียบร้อยแล้ว:', response);
        // ทำสิ่งที่คุณต้องการหลังจากการแก้ไขข้อมูลผู้ใช้เสร็จสมบูรณ์
      }, (error: any) => {
        console.error('เกิดข้อผิดพลาดในการอัพเดตผู้ใช้:', error);
      });

    // หรือใช้ axios
    axios.put(`http://localhost:4000/facemash/profile/${userId}`, userData)
      .then((response: any) => {
        console.log('ผู้ใช้ได้รับการอัพเดตเรียบร้อยแล้ว:', response.data);
        // ทำสิ่งที่คุณต้องการหลังจากการแก้ไขข้อมูลผู้ใช้เสร็จสมบูรณ์
      })
      .catch((error: any) => {
        console.error('เกิดข้อผิดพลาดในการอัพเดตผู้ใช้:', error);
      });
  }

  check(userId: string) {
    this.router.navigate(['/profile'] ,{ queryParams: { user_id: userId } });
  }
}