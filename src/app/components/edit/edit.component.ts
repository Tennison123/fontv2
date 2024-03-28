import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
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
  constructor(private router: Router, private httpClient: HttpClient) {}

  
  
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = ''; // เพิ่มฟิลด์รหัสผ่านยืนยัน

  edit() {
    if (this.password !== this.confirmPassword) {
      console.error('รหัสผ่านและรหัสผ่านยืนยันไม่ตรงกัน');
      return;
    }

    const userData = {
      first_name: this.firstName,
      last_name: this.lastName,
      password: this.password
    };

    // ใช้ HttpClient ใน Angular
    this.httpClient.put('http://localhost:4000/facemash/edit/', userData)
      .subscribe((response: any) => {
        console.log('ผู้ใช้ได้รับการอัพเดตเรียบร้อยแล้ว:', response);
        // ทำสิ่งที่คุณต้องการหลังจากการแก้ไขข้อมูลผู้ใช้เสร็จสมบูรณ์
      }, (error: any) => {
        console.error('เกิดข้อผิดพลาดในการอัพเดตผู้ใช้:', error);
      });

    // หรือใช้ axios
    axios.put('http://localhost:4000/facemash/profile/', userData)
      .then((response: any) => {
        console.log('ผู้ใช้ได้รับการอัพเดตเรียบร้อยแล้ว:', response.data);
        // ทำสิ่งที่คุณต้องการหลังจากการแก้ไขข้อมูลผู้ใช้เสร็จสมบูรณ์
      })
      .catch((error: any) => {
        console.error('เกิดข้อผิดพลาดในการอัพเดตผู้ใช้:', error);
      });
  }

  check() {
    this.router.navigate(['/']);
  }
}
