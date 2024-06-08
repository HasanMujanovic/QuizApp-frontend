import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizPlayingService } from '../../services/quiz-playing.service';
import { Quiz } from '../../common/quiz';
import { QuizService } from '../../services/quiz.service';
import { QuizQuestion } from '../../common/quiz-question';
import { QuizResponse } from '../../common/quiz-response';
import { DoneQuizService } from '../../services/done-quiz.service';
import { User } from '../../common/user';
import { AuthenticateService } from '../../services/authenticate.service';
import { SaveDoneQuiz } from '../../common/save-done-quiz';
import { DoneQuiz } from '../../common/done-quiz';
import { SaveQuizProgress } from '../../common/save-quiz-progress';
import { QuizProgress } from '../../common/quiz-progress';
import { SaveQuizService } from '../../services/save-quiz.service';

@Component({
  selector: 'app-quiz-playing',
  templateUrl: './quiz-playing.component.html',
  styleUrl: './quiz-playing.component.css',
})
export class QuizPlayingComponent implements OnInit, OnDestroy {
  quiz: Quiz;
  questions: QuizQuestion[] = [];
  activeQuestion: QuizQuestion;
  activeResponse: QuizResponse[] = [];
  flag: number = 0;
  points: number = 0;
  endOfQuiz: boolean = false;

  timeLeft: number;
  timerInterval: any;

  storage: Storage = sessionStorage;
  email: string = JSON.parse(this.storage.getItem('user'));
  user: User = new User();

  constructor(
    private route: ActivatedRoute,
    private quizPlayingService: QuizPlayingService,
    private quizService: QuizService,
    private doneQuizService: DoneQuizService,
    private authService: AuthenticateService,
    private saveQuizService: SaveQuizService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const kvizId: number = +params.get('id');
      this.getQuiz(kvizId);
      this.getPitanja(kvizId);
    });
    this.timer();
    this.getUser();
  }

  getQuiz(id: number) {
    this.quizService.getOneQuiz(id).subscribe((data) => {
      this.quiz = data;
      this.timeLeft = data.time * 60;
      console.log(this.timeLeft);
    });
  }
  getPitanja(id: number) {
    this.quizPlayingService.getQuestions(id).subscribe((data) => {
      this.questions = data;
      this.activeQuestion = this.questions[0];
      this.startingQuestion(+this.activeQuestion.id);
    });
  }
  getUser() {
    this.authService
      .getUser(this.email)
      .subscribe((data) => (this.user = data));
  }

  startingQuestion(questionId: number) {
    this.quizPlayingService
      .getResponses(questionId)
      .subscribe((data) => (this.activeResponse = data));
  }

  onNextQuestion() {
    if (this.flag < this.questions.length - 1) {
      this.flag++;
      this.activeQuestion = this.questions[this.flag];
      this.startingQuestion(+this.activeQuestion.id);
    } else {
      this.endOfQuiz = true;
      console.log('Kviz je završen');
    }
  }

  checkAnswer(res: QuizResponse) {
    if (res.correctAnswer) {
      this.points += this.quiz.points;
    }
    this.onNextQuestion();
  }

  fiftyFifty() {
    console.log('click');

    const correctAnswers = this.activeResponse.filter(
      (odgovor) => odgovor.correctAnswer
    );
    if (correctAnswers.length > 2) {
      return;
    }

    const correctAnswer = this.activeResponse.find((res) => res.correctAnswer);

    const wrongAnswers = this.activeResponse
      .filter((res) => !res.correctAnswer)
      .slice(0, Math.ceil((this.activeResponse.length - 1) / 2));

    this.activeResponse = [correctAnswer, ...wrongAnswers];
  }
  isFiftyFiftyDisabled(): boolean {
    const correctAnswers = this.activeResponse.filter(
      (odgovor) => odgovor.correctAnswer
    );
    if (correctAnswers.length > 2 || this.activeResponse.length <= 2) {
      return true;
    }
    return false;
  }

  timer() {
    const interval = 1000;

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0 && !this.endOfQuiz) {
        this.timeLeft--;
        console.log(this.timeLeft);
      } else {
        clearInterval(this.timerInterval);
        this.endOfQuiz = true;
        console.log('Vreme je isteklo!');
      }
    }, interval);
  }

  formatirajVreme(sekunde: number): string {
    const minutes = Math.floor(sekunde / 60);
    const seconds = sekunde % 60;
    const formattedMin = minutes < 10 ? '0' + minutes : minutes;
    const formatedSec = seconds < 10 ? '0' + seconds : seconds;
    return `${formattedMin}:${formatedSec}`;
  }

  saveQuiz() {
    let saveDoneQuiz = new SaveDoneQuiz();
    let doneQuiz = new DoneQuiz();

    saveDoneQuiz.user = this.user;
    saveDoneQuiz.quiz = this.quiz;

    doneQuiz.pointsWon = this.points;
    doneQuiz.timeLeft = this.timeLeft;

    saveDoneQuiz.doneQuiz = doneQuiz;

    this.doneQuizService
      .saveQuiz(saveDoneQuiz)
      .subscribe(() => console.log('sacuvalo se'));
  }

  saveProgress() {
    let saveQuizProgress = new SaveQuizProgress();
    let quizProgress = new QuizProgress();

    saveQuizProgress.user = this.user;
    saveQuizProgress.quiz = this.quiz;

    quizProgress.time = this.timeLeft;
    quizProgress.points = this.points;
    quizProgress.questionsAnswered = this.flag;

    saveQuizProgress.quizProgress = quizProgress;

    this.saveQuizService
      .saveProgress(saveQuizProgress)
      .subscribe(() => console.log('Progres sacuvan'));
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
}
