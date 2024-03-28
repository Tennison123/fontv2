import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { VoteComponent } from './components/vote/vote.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditComponent } from './components/edit/edit.component';
import { UploadComponent } from './components/upload/upload.component';
import { GraphComponent } from './components/graph/graph.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminviewProfileComponent } from './components/adminview-profile/adminview-profile.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: HomeComponent },
    { path: 'vote', component: VoteComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'edit', component: EditComponent },
    { path: 'upload', component: UploadComponent },
    { path: 'graph', component: GraphComponent},
    { path: 'admin-homepage', component: AdminComponent},
    { path: 'adminView-profile', component: AdminviewProfileComponent},

];
