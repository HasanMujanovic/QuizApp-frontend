import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { QuizesComponent } from './components/quizes/quizes.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
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

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'edit-quizes/:id', component: EditQuizComponent },
  { path: 'made-quizes', component: MadeQuizesComponent },
  { path: 'done-quizes', component: DoneQuizesComponent },
  { path: 'quiz-playing/:id', component: QuizPlayingComponent },
  { path: 'quiz-details/:id', component: QuizDetailsComponent },
  { path: 'quizes-page', component: QuizesPageComponent },
  { path: 'quiz-info', component: QuizInfoComponent },
  { path: 'create-quiz', component: CreateQuizComponent },
  { path: 'quizes', component: QuizesComponent },
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
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
