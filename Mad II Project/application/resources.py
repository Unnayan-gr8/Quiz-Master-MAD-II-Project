from flask_restful import Api, Resource, reqparse
from .models import *
from flask_security import auth_required, roles_required, roles_accepted, current_user

api = Api()

def roles_list(roles):
    role_list = []
    for role in roles:
        role_list.append(role.name)
    return role_list    

parser = reqparse.RequestParser()
parser.add_argument('score')
parser.add_argument('quiz_id')
parser.add_argument('time_taken')



class ScoreApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'user')
    def get(self):
        scores = []
        scores_json = []
        if "admin" in roles_list(current_user.roles):
            scores = Score.query.all()
        else:
            scores = current_user.scores
        for score in scores:
            this_score = {}
            this_score['id'] = score.id
            this_score['score'] = score.score
            this_score['user_id'] = score.user_id
            this_score['username'] = score.user.username
            this_score['quiz_id'] = score.quiz_id
            this_score['time_duration'] = score.quiz.time_duration
            this_score['time_taken'] = score.time_taken
            scores_json.append(this_score)
            
        if scores_json:
            return scores_json, 200
        else:
            return {
                "message": "No scores found"
            }, 404
    
    @auth_required('token')
    @roles_required('user')
    def post(self):
        try:
            args = parser.parse_args()
            score = Score(score = args['score'], last_score = args['score'], user_id = current_user.id, quiz_id = args['quiz_id'], time_taken = args['time_taken']) 
            db.session.add(score)
            db.session.commit()
            return {
                "message": "Score added successfully"
            }, 201
        except:
            return {
                "message": "Error in adding score"
            }, 400       
api.add_resource(ScoreApi, '/api/get', '/api/create')
