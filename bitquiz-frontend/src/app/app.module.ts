import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { QuizesComponent } from './components/quizes/quizes.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { QuizInfoComponent } from './components/quiz-info/quiz-info.component';
import { HeaderComponent } from './components/header/header.component';
import { QuizesPageComponent } from './components/quizes-page/quizes-page.component';
import { QuizDetailsComponent } from './components/quiz-details/quiz-details.component';
import { QuizPlayingComponent } from './components/quiz-playing/quiz-playing.component';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { DoneQuizesComponent } from './components/done-quizes/done-quizes.component';
import { EditQuizComponent } from './components/edit-quiz/edit-quiz.component';
import { MadeQuizesComponent } from './components/made-quizes/made-quizes.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { OtherUserDetailsComponent } from './components/other-user-details/other-user-details.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'other-user-details/:id',
    component: OtherUserDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user-details/:id',
    component: UserDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit-quizes/:id',
    component: EditQuizComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'made-quizes',
    component: MadeQuizesComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'done-quizes',
    component: DoneQuizesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'quiz-playing/:id',
    component: QuizPlayingComponent,
    canActivate: [authGuard],
  },
  {
    path: 'quiz-details/:id',
    component: QuizDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'quizes-page',
    component: QuizesPageComponent,
    canActivate: [authGuard],
  },
  { path: 'quiz-info', component: QuizInfoComponent, canActivate: [authGuard] },
  {
    path: 'create-quiz',
    component: CreateQuizComponent,
    canActivate: [adminGuard],
  },
  { path: 'quizes', component: QuizesComponent, canActivate: [authGuard] },
  { path: '', component: LandingPageComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    QuizesComponent,
    LandingPageComponent,
    CreateQuizComponent,
    QuizInfoComponent,
    HeaderComponent,
    QuizesPageComponent,
    QuizDetailsComponent,
    QuizPlayingComponent,
    TimeFormatPipe,
    DoneQuizesComponent,
    EditQuizComponent,
    MadeQuizesComponent,
    UserDetailsComponent,
    OtherUserDetailsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
