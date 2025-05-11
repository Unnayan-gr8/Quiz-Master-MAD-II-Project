# Quiz-Master-MAD-II-Project

Author
   Name: UNNAYAN SRIVASTAVA
	 Roll No.: 23F3003811
	 Email ID: 23f3003811@ds.study.iitm.ac.in
Description:
 I am a dedicated and skilled professional with expertise in Python development, Flask, SQLAlchemy, and web technologies. Currently pursuing a BS in Data Science & Applications from IIT Madras, I have completed internships at Indian Railways and Orinson Technologies, gaining hands-on experience in full-stack development and automation. With a strong background in chemical engineering and programming, I have worked on projects involving distillation calculations, API development, and user authentication systems. Additionally, I hold multiple certifications from IIT Madras and have been actively involved in leadership roles, including serving as the Student Secretary of the Hobby Sub Council. My passion for technology and problem-solving makes me a valuable asset in any technical or research-driven environment.

Project: Quiz Master Web Application
Description
The Quiz Master web application is designed with Role-Based Access Control (RBAC) for admins and users. It allows users to take quizzes and track their progress, while admins have full control over quiz content and user performance monitoring.
Admin Features:
Create, update, and delete subjects, chapters, and quizzes.
Add, modify, and remove quiz questions.
View all users’ scores and generate downloadable reports in CSV format.
Manage user roles and control the entire application.
User Features:
Attempt quizzes and receive immediate feedback.
View scores and track progress over time.
Receive notifications when a new quiz is available.
Monthly progress emails summarizing quizzes attempted and performance.

Technologies Used
Backend: Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Security-Too, Celery
Database: SQLAlchemy (PostgreSQL / MySQL)
Frontend: HTML, CSS, Bootstrap, Jinja2
Authentication & Security: Flask-Security, Flask-Login, bcrypt
Task Scheduling: Celery with Redis
Email Notifications: Flask-Mail, Celery
Dependencies


Database Schema Design
Tables:
Users (User authentication & role management)
Subjects (Quiz categories)
Chapters (Subsections under subjects)
Quizzes (Collections of questions)
Questions (Individual questions for quizzes)
Scores (User performance tracking)

API Design


Architecture and Features
The Quiz Master Web Application follows a RESTful architecture, ensuring efficient communication between the frontend and backend. The application consists of the following key components:
Frontend:
Built using HTML, CSS, Bootstrap, and Jinja2 templates.
Provides a user-friendly interface for both admins and users.
Backend:
Powered by Flask and Flask-RESTful for API development.
Implements SQLAlchemy ORM for database interactions.
Uses Celery for background task scheduling, such as sending monthly reports.
Authentication & Authorization:
Flask-Security-Too manages role-based access control (RBAC).
Flask-Login & bcrypt ensure secure user authentication.
Database Management:
PostgreSQL / MySQL is used for efficient data storage and retrieval.
Implements proper indexing and foreign key relationships.
Task Scheduling & Notifications:
Celery & Redis handle periodic tasks like sending quiz notifications and monthly progress reports.
Users receive email notifications using Flask-Mail.
Performance & Scalability:
The application follows a modular design for scalability.
Supports caching and optimization for better performance.

Presentation
 	Video Link: https://drive.google.com/file/d/1gwLj37agU6udokGI_-G6M9YtfVL4IJ1N/view?usp=sharing

Conclusion
The Quiz Master Web Application is a robust and scalable system designed to enhance online learning and self-assessment. With its RBAC system, automated email notifications, real-time score tracking, and comprehensive API design, it provides an efficient and user-friendly experience for both administrators and quiz takers. The integration of Flask, SQLAlchemy, Celery, and Redis ensures high performance and reliability, making it a valuable tool for online education platforms and competitive quiz applications.

 

