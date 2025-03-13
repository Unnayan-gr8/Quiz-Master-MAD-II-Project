from flask import Flask
from application.database import db
from application.models import User, Role
from application.resources import api
from application.config import LocalDevelopmentConfig
from flask_security import Security, SQLAlchemySessionUserDatastore, hash_password

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    datastore = SQLAlchemySessionUserDatastore(db.session, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    return app

app = create_app()

with app.app_context():
    db.create_all()
    app.security.datastore.find_or_create_role(name = 'admin', description = 'Administrator')
    app.security.datastore.find_or_create_role(name = "user", description = "User")
    db.session.commit()
     
    if not app.security.datastore.find_user(email = "user0@admin.com"):
        app.security.datastore.create_user(email = "user0@admin.com", password = hash_password("password"), username = "admin01", roles = ["admin"])
    
    if not app.security.datastore.find_user(email = "user1@user.com"):
        app.security.datastore.create_user(email = "user1@user.com", password = hash_password("123456"), username = "user01", roles = ["user"])
    
    db.session.commit()
    
from application.routes import *
if __name__ == "__main__":
    app.run()