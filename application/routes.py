from .database import db
from .models import User, Role, UsersRoles, Subject, Chapter, Quiz, Question, Score
from flask_security import Security, SQLAlchemySessionUserDatastore
from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required, current_user, roles_accepted
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user
from flask import jsonify
from flask_restful import marshal, fields

@app.route('/', methods = ['GET'])
def home():
    return render_template('index.html')

@app.route('/api/admin')
@auth_required('token')
@roles_required('admin')
def admin_home():
    return jsonify({
        "message": "Hello, Admin!"
    })

@app.route('/api/home')
@auth_required('token')
@roles_accepted('admin', 'user')
def user_home():
    user = current_user
    return jsonify({
        "username": user.username,
        "email": user.email,
        "password": user.password
    })

@app.route('/api/scores')
@auth_required('token')
@roles_accepted('admin', 'user')
def scores():
    user = current_user
    user_scores = Score.query.filter_by(user_id=user.id).all()
    
    return jsonify({
        "user_id": user.id,
        "scores": [
            {
                "id": score.id,
                "score": score.score,
                "last_score": score.last_score,
                "quiz_id": score.quiz_id,
                "time_taken": score.time_taken
            } for score in user_scores
        ]
    })

@app.post('/api/login')
def login():
    credentials = request.get_json()  # Debugging log

    if not credentials or 'email' not in credentials:
        print("Email not provided!")
        return jsonify({"message": "Email not provided!"}), 404
    if 'password' not in credentials:
        print("Password not provided!")
        return jsonify({"message": "Password not provided!"}), 404

    user = app.security.datastore.find_user(email=credentials['email'])
    if user:
        if check_password_hash(user.password, credentials['password']):
            login_user(user)
            print("Login successful!")
            return jsonify({
                "message": "Login successful!",
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "Authentication-Token": user.get_auth_token(),
                "role": user.roles[0].name
            }), 200
        else:
            print("Invalid Password!")
            return jsonify({"message": "Invalid Password!"}), 400
    else:
        print("Invalid Email!")
        return jsonify({"message": "Invalid Email!"}), 400


@app.post('/api/register')
def create_user():
    credentials = request.get_json()
    if not app.security.datastore.find_user(email = credentials['email']):
        app.security.datastore.create_user(email = credentials['email'] , password = generate_password_hash(credentials['password']), username = credentials['username'] , roles = ["user"])
        db.session.commit()
        return jsonify({
            "message" : "User created successfully!"
        }), 201
    return jsonify({
        "message" : "User already exists!"
    }), 400
    
@app.route('/admin_dashboard')
@auth_required('token')
def admin_dashboard():
    return render_template('adminhome.html')

@app.route('/api/summary')
@auth_required('token')
@roles_accepted('admin', 'user')
def summary():
    user = current_user
    if user.roles[0].name == 'admin':
        quiz_Count = Score.query.count()  # Correct usage
        subject_Count = Subject.query.count()  # Correct usage

    else:
        quiz_Count = Score.query.filter_by(user_id = user.id).count()
        subject_Count = Subject.query.filter(Subject.chapters.any(Chapter.quizes.any(Quiz.scores.any(Score.user_id == user.id)))).count()

    return jsonify({
        "subject_attemped": subject_Count,
        "quiz_count": quiz_Count
    })   
    
@app.route('/api/admin/scores')
@auth_required('token')
@roles_accepted('admin')
def adminscores():
    scores = Score.query.all()  # Fetch all scores from the database
    
    return jsonify({
        "scores": [
            {
                "id": score.id,
                "score": score.score,
                "last_score": score.last_score,
                "quiz_id": score.quiz_id,
                "time_taken": score.time_taken,
                "user_id": score.user_id
            } for score in scores  # Use 'scores' instead of 'user_scores'
        ]
    })

@app.route('/api/export')
def export_csv():
    return "Monthly"