from .database import db
from flask_security import UserMixin, RoleMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String, unique = True, nullable = False)
    username = db.Column(db.String, unique = True, nullable = False)
    password = db.Column(db.String, nullable = False) 
    qualification = db.Column(db.String, nullable = True)
    DOB = db.Column(db.String, nullable = True)
    fs_uniquifier = db.Column(db.String, unique = True, nullable = False)
    active = db.Column(db.Boolean, default=True, nullable=False)
    roles = db.relationship('Role', backref = 'bearer', secondary = 'users_roles')
    scores = db.relationship('Score', backref = 'user')

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable = False)
    description = db.Column(db.String, nullable = False)
    users = db.relationship('User', backref = 'role', secondary = 'users_roles')

class UsersRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    
class Subject(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable = False)
    description = db.Column(db.String, nullable = False)
    chapters = db.relationship('Chapter', backref = 'subject')

class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable = False)
    description = db.Column(db.String, nullable = False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'))
    quizes = db.relationship('Quiz', backref = 'chapter')
    
class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    time_duration = db.Column(db.Integer, nullable = False)
    date_of_quiz = db.Column(db.String, nullable = False)
    remark = db.Column(db.String, nullable = False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'))
    questions = db.relationship('Question', backref = 'quiz')
    scores = db.relationship('Score', backref = 'quiz')
    
class Question(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    question = db.Column(db.String, nullable = False)
    option_1 = db.Column(db.String, nullable = False)
    option_2 = db.Column(db.String, nullable = False)
    option_3 = db.Column(db.String, nullable = False)
    option_4 = db.Column(db.String, nullable = False)
    correct_option = db.Column(db.String, nullable = False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'))

class Score(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    score = db.Column(db.Integer, nullable = False)
    last_score = db.Column(db.Integer, nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'))
    time_taken = db.Column(db.Integer, nullable = False)