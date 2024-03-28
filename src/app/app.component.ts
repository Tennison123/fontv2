import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from './components/home/home.component';
import { VoteComponent } from './components/vote/vote.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditComponent } from './components/edit/edit.component';
import { UploadComponent } from './components/upload/upload.component';
import { AdminComponent } from './components/admin/admin.component';
import { GraphComponent } from './components/graph/graph.component';
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, SignupComponent, LoginComponent,
    HomeComponent,VoteComponent,ProfileComponent,EditComponent,
  UploadComponent,AdminComponent,GraphComponent]
})
export class AppComponent {
  title = 'projectFinal';
}
