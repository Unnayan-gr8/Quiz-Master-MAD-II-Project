export default {
  template: `
    <div id="app" class="container py-4">
      <!-- 📌 Navigation Bar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow">
        <div class="container-fluid">
          <span class="navbar-brand">Welcome, {{ userData.username }}</span>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <button class="btn btn-outline-light me-2" @click="viewMode = 'subjects'">Home</button>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-light me-2" @click="viewMode = 'scores'">Scores</button>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-light me-2" @click="viewMode = 'summary'">Summary</button>
              </li>
              <li class="nav-item">
                <input v-model="searchQuery" class="form-control d-inline w-auto" placeholder="Search Subject..." @input="searchSubjects">
              </li>
              <li class="nav-item">
                <button class="btn btn-danger ms-2" @click="logout">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- 📌 Chapters Page -->
      <div v-if="viewMode === 'chapters'" class="mt-4">
        <button class="btn btn-secondary mb-3" @click="viewMode = 'subjects'">← Back</button>
        <h4 class="text-center mb-3">Chapters</h4>
        <div class="row">
          <div v-for="chapter in selectedChapters" :key="chapter.id" class="col-md-6">
            <div class="card shadow-sm" @click="toggleQuizzes(chapter.id)">
              <div class="card-body">
                <h6 class="fw-bold">{{ chapter.name }}</h6>
                <p>{{ chapter.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 📌 Quizzes Page -->
      <div v-if="viewMode === 'quizzes'" class="mt-4">
        <button class="btn btn-secondary mb-3" @click="viewMode = 'chapters'">← Back</button>
        <h4 class="text-center mb-3">Quizzes</h4>
        <div class="row">
          <div v-for="quiz in selectedQuizzes" :key="quiz.id" class="col-md-6">
            <div class="card border-primary shadow-sm">
              <div class="card-body">
                <span>{{ quiz.remark }}</span>
                <button class="btn btn-primary w-100 mt-2" @click="startQuiz(quiz.id, quiz.time_duration)">Start Quiz</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="viewMode === 'quizPage'" class="quiz-container p-4 mt-4 shadow-lg bg-light rounded">
        <button class="btn btn-secondary mb-3" @click="viewMode = 'quizzes'">← Back</button>
        <h4 class="text-center">Quiz Questions</h4>

        <!-- Timer -->
        <div class="text-center mb-3">
          <span class="badge bg-danger fs-5">⏳ {{ formattedTime }}</span>
        </div>

        <div v-if="quizQuestions.length > 0">
          <div v-for="question in quizQuestions" :key="question.id" class="mb-3">
            <p class="fw-bold">{{ question.question }}</p>
            <div class="form-check" v-for="option in ['option_1', 'option_2', 'option_3', 'option_4']" :key="option">
              <input type="radio" class="form-check-input" :name="'q' + question.id" :value="question[option]">
              <label class="form-check-label">{{ question[option] }}</label>
            </div>
          </div>

          <button class="btn btn-success w-100 mt-3" @click="submitQuiz">Submit Quiz</button>
        </div>
        
        <p v-else class="text-center text-danger">Loading quiz questions...</p>
      </div>

      <!-- 📌 Main Content -->
      <div v-if="viewMode === 'subjects'" class="row">
        <div v-for="subject in filteredSubjects" :key="subject.id" class="col-md-4">
          <div class="card shadow-lg h-100" @click="toggleChapters(subject.id)">
            <div class="card-body text-center">
              <h5 class="card-title fw-bold">{{ subject.name }}</h5>
              <p class="text-muted">{{ subject.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 📌 Scores Page -->
      <div v-if="viewMode === 'scores'">
        <h4 class="text-center mb-3">Quiz Scores</h4>
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Score</th>
              <th>Last Score</th>
              <th>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="score in scores" :key="score.id">
              <td>{{ score.id }}</td>  <!-- Show quiz name instead of ID -->
              <td>{{ score.score }}</td>
              <td>{{ score.last_score }}</td>
              <td>{{ score.time_taken }} seconds</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 📌 Summary Page -->
      <div v-if="viewMode === 'summary'" class="text-center">
        <h4 class="mb-3">Summary</h4>
        <p>Total Quizzes Attempted: {{ summary.quiz_count }}</p>
        <p>Subjects Attempted: {{ summary.subject_attemped }}</p>
      </div>
    </div>
      `,

  data() {
    return {
      userData: "",
      subjects: [],
      selectedChapters: [],
      selectedQuizzes: [],
      viewMode: "subjects",
      currentQuiz: null,
      quizQuestions: [],
      timer: 0, // Timer in seconds
      timerInterval: null,
      scores: [],
      summary: {},
      searchQuery: ""
    };
  },

  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
    filteredSubjects() {
      return this.subjects.filter(subject =>
        subject.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },

  mounted() {
    const user_id = localStorage.getItem("id");

    fetch('/api/home', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authentication-Token": localStorage.getItem('auth_token')
      }
    })
    .then(response => response.json())
    .then(data => this.userData = data);

    fetch('/api/subject/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authentication-Token": localStorage.getItem('auth_token')
      }
    })
    .then(response => response.json())
    .then(data => this.subjects = data);

    fetch(`/api/${user_id}/score/get`, { 
      method: "GET",
      headers: { 
        "Authentication-Token": localStorage.getItem("auth_token"),
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Scores fetched:", data);
      this.scores = data.scores;
    })
    .catch(error => console.error("Fetch error:", error));
    

    fetch('/api/summary', {
      headers: { "Authentication-Token": localStorage.getItem('auth_token') }
    })
    .then(response => response.json())
    .then(data => this.summary = data);
  },

  methods: {
    toggleChapters(subjectId) {
      this.viewMode = "chapters";
      fetch(`/api/subject/${subjectId}/chapter/get`, {  // Updated API endpoint
        headers: { "Authentication-Token": localStorage.getItem('auth_token') }
      })
      .then(response => response.json())
      .then(data => this.selectedChapters = data)
      .catch(error => console.error("Error fetching chapters:", error));
    },
  
    toggleQuizzes(chapterId) {
      this.viewMode = "quizzes";
      fetch(`/api/${chapterId}/quiz/get`, {  // Updated API endpoint
        headers: { "Authentication-Token": localStorage.getItem('auth_token') }
      })
      .then(response => response.json())
      .then(data => this.selectedQuizzes = data)
      .catch(error => console.error("Error fetching quizzes:", error));
    },
  
    startQuiz(quizId, time_duration) {
      this.currentQuiz = quizId;
      this.viewMode = "quizPage";
      this.timer = time_duration;
      this.startTimer();
    
      fetch(`/api/${quizId}/question/get`, {
        headers: { "Authentication-Token": localStorage.getItem('auth_token') }
      })
      .then(response => response.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          console.error("No quiz questions received", data);
          alert("No questions available for this quiz.");
        } else {
          this.quizQuestions = data;
        }
      })
      .catch(error => {
        console.error("Error fetching quiz questions:", error);
        alert("Failed to load quiz questions. Please try again.");
      });
    },

    startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval); // Clear any previous timer
    
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.timerInterval);
          alert("Time's up! Submitting your quiz automatically.");
          this.submitQuiz();
        }
      }, 1000);
    },
    
    
  
    submitQuiz() {
      clearInterval(this.timerInterval);
    
      // Prepare responses in { question_id: selected_option } format
      let responses = {};
      this.quizQuestions.forEach(question => {
        const selectedOption = document.querySelector(`input[name="q${question.id}"]:checked`);
        if (selectedOption) {
          responses[question.id] = selectedOption.value;
        }
      });

      // Calculate the score based on correct answers
      const score = this.calculateScore();
    
      const quizData = { 
        score: score,
        quiz_id: this.currentQuiz
      }; 
    
      fetch(`/api/score/update/${this.currentQuiz}`, { // Updated API endpoint
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authentication-Token": localStorage.getItem('auth_token')
        },
        body: JSON.stringify(quizData)
      })
      .then(response => response.json())
      .then(data => {
        alert(`Quiz submitted! You scored ${data.score} points.`);
        this.viewMode = "quizzes";
        this.currentQuiz = null;
      })
      .catch(error => console.error("Error submitting quiz:", error));
    },
    
    calculateScore() {
      let score = 0;
  
      this.quizQuestions.forEach(question => {
  
          const correctOptionKey = Object.keys(question).find(key => key.toLowerCase().includes("correct"));

          const selectedOption = document.querySelector(`input[name="q${question.id}"]:checked`);
  
          if (selectedOption && selectedOption.value === String(question[correctOptionKey])) {
              score += 10;
          }
      });
  
      return score;
  },
  

    searchSubjects() {
      console.log("Searching for", this.searchQuery);
    },

    logout() {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
  }
}