from .database import db
from flask_security import UserMixin, RoleMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    roles = db.relationship('Role', backref = 'bearer', secondary = 'users_roles')

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)

class UsersRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))