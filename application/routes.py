from .database import db
from .models import User, Role
from flask_security import Security, SQLAlchemySessionUserDatastore, hash_password
from flask import current_app as app, jsonify, request
from flask_security import auth_required, roles_required, current_user

@app.route('/', methods = ['GET'])
def home():
    return "<h1>Home Page</h1>"

@app.route('/api/admin')
@auth_required('token')
@roles_required('admin')
def admin_home():
    return jsonify({
        "message": "Hello, Admin!"
    })

@app.route('/api/home')
@auth_required('token')
@roles_required('user')
def user_home():
    user = current_user
    return jsonify({
        "username" : user.username,
        "email" : user.email,
        "password" : user.password
    })

@app.post('/api/register')
def create_user():
    credentials = request.get_json()
    if not app.security.datastore.find_user(email = credentials['email']):
        app.security.datastore.create_user(email = credentials['email'] , password = hash_password(credentials['password']), username = credentials['username'] , roles = ["user"])
        db.session.commit()
        return jsonify({
            "message" : "User created successfully!"
        }), 201
    return jsonify({
        "message" : "User already exists!"
    }), 400