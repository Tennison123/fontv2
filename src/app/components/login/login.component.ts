import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UsersPostReq } from '../../model/users.post.req';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { conn } from "../../../api/dbconnect";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router: Router, private httpClient: HttpClient) {}

  async checklogin(email: string, password: string) {
    const HOST: string = "http://localhost:4000";
    const url = `${HOST}/facemash/signin/`; // Fixing string template

    const data = {
      email: email,
      password: password
    };

    try {
      const response = await axios.post(url, data);
      const user_signin_success: UsersPostReq[] = response.data;

      console.log("Response from API:", user_signin_success);

      if (user_signin_success.length > 0) {
        console.log("Valid response from API");

        const user_id = user_signin_success[0].user_id;
        const user_type = user_signin_success[0].user_type;

        if (user_id) {
          if (user_type === 'user') {
            this.router.navigate(['/home'], { queryParams: { user_id: user_id } });
          } else if (user_type === 'admin') {
            this.router.navigate(['/admin-homepage'], { queryParams: { user_id: user_id } });
          } else {
            console.log("Invalid user type");
          }
        } else {
          console.log("Invalid user_id");
        }
      } else {
        console.log("Invalid email or password");
      }

      return response;
    } catch (error) {
      console.error("Error during sign-in:", error);
      throw error;
    }
  }

  check() {
    this.router.navigate(['/signup']);
  }
}
