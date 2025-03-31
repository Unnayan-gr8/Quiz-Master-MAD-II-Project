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
                <button class="btn btn-outline-light me-2" @click="back">Back</button>
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

      <!-- Subjects Section -->
      <div v-if="viewMode === 'subjects'">
        <h4 class="text-center mb-3">Subjects</h4>
        
        <!-- Add Subject Button -->
        <div class="d-flex justify-content-center mb-3">
          <button class="btn btn-success" @click="createSubject">+ Add Subject</button>
        </div>
        <div class="row">
          <div v-for="subject in filteredSubjects" :key="subject.id" class="col-md-4">
            <div class="card shadow-lg h-100">
              <div class="card-body text-center">
                <h5 class="card-title fw-bold">{{ subject.name }}</h5>
                <p>Subject ID: {{ subject.id }}</p>
                <p>Description: {{ subject.description }}</p>
                <button class="btn btn-success" @click="toggleChapters(subject.id)">View Chapters</button>
                <button class="btn btn-warning" @click="editSubject(subject)">Update</button>
                <button class="btn btn-danger" @click="deleteSubject(subject.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chapters Section -->
      <div v-if="viewMode === 'chapters'">
        <h4 class="text-center mb-3">Chapters</h4>
        
        <!-- Add Chapters Button -->
        <div v-if="selectedSubject" class="d-flex justify-content-center mb-3">
          <button class="btn btn-success" @click="createChapter()">+ Add Chapter</button>
        </div>
        <div class="row">
          <div v-for="chapter in chapters" :key="chapter.id" class="col-md-4">
            <div class="card shadow-lg h-100">
              <div class="card-body text-center">
                <h5 class="card-title fw-bold">{{ chapter.name }}</h5>
                <p>Chapter ID: {{ chapter.id }}</p>
                <p>Description: {{ chapter.description }}</p>
                <button class="btn btn-success" @click="togglequizzes(chapter.id)">View quizzes</button>
                <button class="btn btn-warning" @click="editChapter(chapter)">Update</button>
                <button class="btn btn-danger" @click="deleteChapter(chapter)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- quizzes Section -->
      <div v-if="viewMode === 'quizzes'">
        <h4 class="text-center mb-3">quizzes</h4>
        
        <!-- Add quizzes Button -->
        <div class="d-flex justify-content-center mb-3">
          <button class="btn btn-danger" @click="createquiz()">+ Add Quiz</button>
        </div>

        <div class="row">
          <div v-for="quiz in quizzes" :key="quiz.id" class="col-md-4">
            <div class="card shadow-lg h-100">
              <div class="card-body text-center">
                <h5 class="card-title fw-bold">{{ quiz.id }}</h5>
                <p>Chapter ID: {{ quiz.chapter_id }}</p>
                <p>Time Duration(secs): {{ quiz.time_duration }}</p>
                <p>Last Update: {{ quiz.date_of_quiz }}</p>
                <p>Remark: {{ quiz.remark }}</p>
                <button class="btn btn-success" @click="toggleQuestions(quiz.id)">View Questions</button>
                <button class="btn btn-warning" @click="editQuiz(quiz)">Update</button>
                <button class="btn btn-danger" @click="deleteQuiz(quiz)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Questions Section -->
      <div v-if="viewMode === 'questions'">
        <h4 class="text-center mb-3">Questions</h4>
        
        <!-- Add Questions Button -->
        <div class="d-flex justify-content-center mb-3">
          <button class="btn btn-danger" @click="createQuestion()">+ Add Question</button>
        </div>

        <div class="row">
          <div v-for="question in questions" :key="question.id" class="col-md-4">
            <div class="card shadow-lg h-100">
              <div class="card-body text-center">
                <h5 class="card-title fw-bold">{{ question.id }}</h5>
                <p>Question: {{ question.question }}</p>
                <p>Option 1: {{ question.option_1 }}</p>
                <p>Option 2: {{ question.option_2 }}</p>
                <p>Option 3: {{ question.option_3 }}</p>
                <p>Option 4: {{ question.option_4 }}</p>
                <p>Correct Option: {{ question.correct_option }}</p>
                <button class="btn btn-warning" @click="editQuestion(question)">Update</button>
                <button class="btn btn-danger" @click="deleteQuestion(question)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 📌 Scores Page -->
      <div v-if="viewMode === 'scores'">
        <h4 class="text-center mb-3">Quiz Scores</h4>
        <button class="btn btn-primary mb-3" @click="downloadCSV">Download CSV</button>
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
      subject: null,
      selectedSubject: null,
      selectedChapter: null,
      selectedQuiz: null,
      chapters: [],
      quizzes: [],
      questions: [],
      selectedChapters: [],
      selectedQuizzes: [],
      quizQuestions: [],
      viewMode: "subjects",
      summary: {},
      scores: null,
      searchQuery: ""
    };
  },

  computed: {
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
    .then(data => {
      this.userData = data;
      this.fetchSubjects();
      this.fetchScore();
      this.fetchSummary();
    });
    

    fetch('/api/summary', {
      headers: { "Authentication-Token": localStorage.getItem('auth_token') }
    })
    .then(response => response.json())
    .then(data => this.summary = data);

    fetch('/api/admin/scores', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authentication-Token": localStorage.getItem('auth_token')
      }
    })
    .then(response => response.json())
    .then(data => this.scores = data.scores)
    .catch(error => console.error("Error fetching scores:", error));
  },
  
  methods: {
    fetchSubjects(){
      fetch('/api/subject/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authentication-Token": localStorage.getItem('auth_token')
        }
      })
      .then(response => response.json())
      .then(data => {
        this.subjects = data;;
      });
    },
    fetchChapters(subjectId){
      fetch(`/api/subject/${subjectId}/chapter/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authentication-Token": localStorage.getItem('auth_token')
        }
      })
      .then(response => response.json())
      .then(data => this.chapters = data);
    },
    fetchquizzes(chapterId){
      fetch(`/api/${chapterId}/quiz/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authentication-Token": localStorage.getItem('auth_token')
        }
      })
      .then(response => response.json())
      .then(data => this.quizzes = data);
    },
    fetchQuestions(quizId){
      fetch(`/api/${quizId}/question/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authentication-Token": localStorage.getItem('auth_token')
        }
      })
      .then(response => response.json())
      .then(data => this.questions = data);
    },
    toggleChapters(subjectId) {
      this.viewMode = "chapters";
      this.selectedSubject = this.subjects.find(subject => subject.id === subjectId); // Store selected subject
      this.fetchChapters(subjectId);
      fetch(`/api/subject/${subjectId}/chapter/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authentication-Token": localStorage.getItem('auth_token')
        }
      })
      .then(response => response.json())
      .then(data => this.chapters = data);
    },
    togglequizzes(chapterId) {
      this.viewMode = "quizzes";
      this.selectedChapter = this.chapters.find(chapter => chapter.id === chapterId);
      this.fetchquizzes(chapterId);
      fetch(`/api/${chapterId}/quiz/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authentication-Token": localStorage.getItem('auth_token')
        }
      })
      .then(response => response.json())
      .then(data => this.quizzes = data);
    },    
    toggleQuestions(quizId) {
      this.viewMode = "questions";
      this.selectedQuiz = this.quizzes.find(quiz => quiz.id === quizId);
      this.fetchQuestions(quizId);
      fetch(`/api/${quizId}/question/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authentication-Token": localStorage.getItem('auth_token')
        }
      })
        .then(response => response.json())
        .then(data => this.questions = data);
    },

    downloadCSV() {
      let csvContent = "ID,User ID,Quiz ID,Score,Last Score,Time Taken\n";
      this.scores.forEach(score => {
        console.log(score)
        csvContent += `${score.id},${score.user_id},${score.quiz_id},${score.score},${score.last_score},${score.time_taken}\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scores_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    
    // CRUD Operations
    createSubject(){
      const newName = prompt("New Subject Name:");
      const newDesc = prompt("New Subject Description")
      if(newName && newDesc) {
        fetch(`/api/subject/create`, {
          method: "POST",
          body: JSON.stringify({ 
            name: newName,
            description: newDesc
           }),
          headers: { 
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
         }
        })
        .then(() => this.fetchSubjects());
      }
    },
    editSubject(subject) {
      const newName = prompt("Update Subject Name:", subject.name);
      const newDesc = prompt("Update Subject Description", subject.description)
      if (newName) {
        fetch(`/api/subject/update/${subject.id}`, {
          method: "PUT",
          body: JSON.stringify({ 
            name: newName,
            description: newDesc
           }),
          headers: { 
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
         }
        })
        .then(() => this.fetchSubjects());
      }
    },
    deleteSubject(subjectId) {
      if (confirm("Are you sure you want to delete this subject?")) {
        fetch(`/api/subject/delete/${subjectId}`, { 
          method: "DELETE", 
          headers: { 
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
         }
       })
        .then(() => this.fetchSubjects());
      }
    },
    createChapter() {
      if (!this.selectedSubject) {
        alert("No subject selected.");
        return;
      }
    
      const newName = prompt("Enter Chapter Name:");
      const newDesc = prompt("Enter Chapter Description:");
      
      if (newName && newDesc) {
        fetch(`/api/subject/${this.selectedSubject.id}/chapter/create`, {
          method: "POST",
          body: JSON.stringify({ 
            name: newName, 
            description: newDesc, 
            subject_id: this.selectedSubject.id 
          }),
          headers: {
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
          }
        })
        .then(() => this.fetchChapters(this.selectedSubject.id));
      }
    },    
    editChapter(chapter) {
      const newName = prompt("Update Chapter Name:", chapter.name);
      const newDesc = prompt("Update Chapter Description", chapter.description)
      if (newName) {
        fetch(`/api/subject/chapter/update/${chapter.id}`, {
          method: "PUT",
          body: JSON.stringify({ 
            name: newName,
            description: newDesc,
            subject_id: chapter.subject_id
           }),
          headers: { 
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
         }
        })
        .then(() => this.fetchChapters(chapter.subject_id));
      }
    },
    deleteChapter(chapter) {
      if (confirm("Are you sure you want to delete this chapter?")) {
        fetch(`/api/subject/chapter/delete/${chapter.id}`, { 
          method: "DELETE", 
          headers: { 
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
         }
       })
        .then(() => this.fetchChapters(chapter.subject_id));
      }
    },
    createquiz() {
      if (!this.selectedChapter) {
        alert("No chapter selected.");
        return;
      }
    
      const timeDuration = prompt("Enter Quiz Duration (in seconds):");
      const remark = prompt("Enter Remark for Quiz:");
      
      if (timeDuration && remark) {
        fetch(`/api/${this.selectedChapter.id}/quiz/create`, {
          method: "POST",
          body: JSON.stringify({ time_duration: timeDuration, remark: remark, chapter_id: this.selectedChapter.id }),
          headers: {
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
          }
        })
        .then(() => this.fetchquizzes(this.selectedChapter.id));
      }
    },    
    editQuiz(quiz) {
      const newName = prompt("Update Quiz Time Duration:", quiz.time_duration);
      const newDesc = prompt("Update Quiz Remark", quiz.remark)
      if (newName) {
        fetch(`/api/quiz/update/${quiz.id}`, {
          method: "PUT",
          body: JSON.stringify({ 
            time_duration: newName,
            remark: newDesc,
            chapter_id: quiz.chapter_id
           }),
          headers: { 
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
         }
        })
        .then(() => this.fetchquizzes(quiz.chapter_id));
      }
    },
    deleteQuiz(quiz) {
      if (confirm("Are you sure you want to delete this Quiz?")) {
        fetch(`/api/quiz/delete/${quiz.id}`, { 
          method: "DELETE", 
          headers: { 
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
         }
       })
        .then(() => this.fetchquizzes(quiz.chapter_id));
      }
    },
    createQuestion() {
      if (!this.selectedQuiz) {
        alert("No quiz selected.");
        return;
      }
    
      const questionText = prompt("Enter Question:");
      const option1 = prompt("Enter Option 1:");
      const option2 = prompt("Enter Option 2:");
      const option3 = prompt("Enter Option 3:");
      const option4 = prompt("Enter Option 4:");
      const correctOption = prompt("Enter Correct Option:");
    
      if (questionText && option1 && option2 && option3 && option4 && correctOption) {
        fetch(`/api/${this.selectedQuiz.id}/question/create`, {
          method: "POST",
          body: JSON.stringify({
            question: questionText,
            option_1: option1,
            option_2: option2,
            option_3: option3,
            option_4: option4,
            correct_option: correctOption,
            quiz_id: this.selectedQuiz.id
          }),
          headers: {
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
          }
        })
        .then(() => this.fetchQuestions(this.selectedQuiz.id));
      }
    },
    editQuestion(question) {
      const questionss = prompt("Update Question:", question.question);
      const option1 = prompt("Update Option 1", question.option_1);
      const option2 = prompt("Update Option 2", question.option_2);
      const option3 = prompt("Update Option 3", question.option_3);
      const option4 = prompt("Update Option 4", question.option_4);
      const correct_option = prompt("Update Correct Option", question.correct_option);
      if(questionss && option1 && option2 && option3 && option4 && correct_option) {
        fetch(`/api/question/update/${question.id}`, {
          method: "PUT",
          body: JSON.stringify({ 
            question: questionss,
            option_1: option1,
            option_2: option2,
            option_3: option3,
            option_4: option4,
            correct_option: correct_option,
            quiz_id: question.quiz_id
           }),
          headers: { 
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
         }
        })
        .then(() => this.fetchQuestions(question.quiz_id));
      }
    },
    deleteQuestion(question) {
      if (confirm("Are you sure you want to delete this Question?")) {
        fetch(`/api/question/delete/${question.id}`, { 
          method: "DELETE", 
          headers: { 
            'Content-Type': 'application/json',
            "Authentication-Token": localStorage.getItem('auth_token')
         }
       })
        .then(() => this.fetchQuestions(question.quiz_id));
      }
    },
    searchSubjects() {
      console.log("Searching for", this.searchQuery);
    },

    back() {
      if (this.viewMode === 'chapters') this.viewMode = 'subjects';
      else if (this.viewMode === 'quizzes') this.viewMode = 'chapters';
      else if (this.viewMode === 'questions') this.viewMode = 'quizzes';
    },

    logout() {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
  }
}
