from flask_restful import Api, Resource, reqparse
from .models import *
from flask_security import auth_required, roles_required, roles_accepted, current_user
from flask import request, jsonify
import datetime
from .tasks import *
api = Api()

def roles_list(roles):
    role_list = []
    for role in roles:
        role_list.append(role.name)
    return role_list    

parser = reqparse.RequestParser()
parser.add_argument('score', type=int, required=True)
parser.add_argument('time_taken', type=int, required=False)
parser.add_argument('quiz_id', type=int, required=False)


class ScoreApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'user')
    def get(self, user_id):
        scores = Score.query.filter_by(user_id=user_id).all()
        print(f"Scores found for user {user_id}: {scores}")  # Debugging

        if not scores:
            return jsonify({'message': 'No scores found', 'scores': [], 'user_id': user_id})

        scores_json = []
        for score in scores:
            quiz = Quiz.query.get(score.quiz_id)
            scores_json.append({
                'id': score.id,
                'quiz_id': quiz.id if quiz else "Unknown",
                'score': score.score,
                'last_score': score.last_score,
                'time_taken': score.time_taken,
            })
        
        return jsonify({'scores': scores_json, 'user_id': user_id})


    @auth_required('token')
    @roles_accepted('admin', 'user')
    def post(self):
        args = parser.parse_args()
        new_score = Score(
            user_id=current_user.id,
            quiz_id=args['quiz_id'],
            score=args['score'],
            time_taken=args['time_taken']
        )
        try:
            db.session.add(new_score)
            db.session.commit()
            return {'message': 'Score submitted successfully', 'score_id': new_score.id}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': f"Error submitting score: {str(e)}"}, 500
                
    @auth_required('token')
    def put(self, score_id):
        args = parser.parse_args()

        if not isinstance(args.get('score'), int) or args['score'] < 0:
            return {"message": "Invalid score value"}, 400
        
        score = Score.query.filter_by(id=score_id).first()

        if not score:
            return {"message": "Score record not found"}, 404

        try:
            score.last_score = args['score']
            score.score += args['score']
            db.session.commit()

            return {
                "message": "Score updated successfully",
                "score": score.score,
                "last_score": score.last_score
            }, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error updating score: {str(e)}"}, 500

    @auth_required('token')
    @roles_accepted('user')
    def delete(self, score_id):
        score = Score.query.filter_by(id=score_id, user_id=current_user.id).first()

        if not score:
            return {"message": "No Score record found"}, 404

        try:
            db.session.delete(score)
            db.session.commit()
            return {"message": "Score deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error deleting score: {str(e)}"}, 500
                
ques_parser = reqparse.RequestParser()
ques_parser.add_argument('question')
ques_parser.add_argument('option_1')
ques_parser.add_argument('option_2')
ques_parser.add_argument('option_3')
ques_parser.add_argument('option_4')
ques_parser.add_argument('correct_option')
ques_parser.add_argument('quiz_id')

class QuestionApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'user')
    def get(self, quiz_id):
        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        questions_json = []
        for question in questions:
            this_question = {}
            this_question['id'] = question.id
            this_question['question'] = question.question
            this_question['option_1'] = question.option_1
            this_question['option_2'] = question.option_2
            this_question['option_3'] = question.option_3
            this_question['option_4'] = question.option_4
            this_question['correct_option'] = question.correct_option
            this_question['quiz_id'] = question.quiz_id
            questions_json.append(this_question)
            
        if questions_json:
            return questions_json, 200
        else:
            return {
                "message": "No questions found"
            }, 404
    
    @auth_required('token')
    @roles_accepted('admin')
    def post(self, quiz_id):
        try:
            args = ques_parser.parse_args()
            if args['question'] is None:
                return {"message": "Question not provided"}, 400
            if args['option_1'] is None:
                return {"message": "Option 1 not provided"}, 400
            if args['option_2'] is None:
                return {"message": "Option 2 not provided"}, 400
            if args['option_3'] is None:
                return {"message": "Option 3 not provided"}, 400
            if args['option_4'] is None:
                return {"message": "Option 4 not provided"}, 400
            if args['correct_option'] is None:
                return {"message": "Correct option not provided"}, 400
            if args['quiz_id'] is None:
                return {"message": "Quiz ID not provided"}, 400
            
            question = Question(question=args['question'], option_1=args['option_1'], option_2=args['option_2'], option_3=args['option_3'], option_4=args['option_4'], correct_option=args['correct_option'], quiz_id=args['quiz_id']) 
            db.session.add(question)
            db.session.commit()
            return {"message": "Question added successfully"},201
        except:
            return {"message": "Error in adding question"}, 400
    
    @auth_required('token')
    @roles_accepted('admin')
    def put(self, question_id):
        try:
            args = ques_parser.parse_args()
            if args['question'] is None:
                return {"message": "Question not provided"}, 400
            if args['option_1'] is None:
                return {"message": "Option 1 not provided"}, 400
            if args['option_2'] is None:
                return {"message": "Option 2 not provided"}, 400
            if args['option_3'] is None:
                return {"message": "Option 3 not provided"}, 400
            if args['option_4'] is None:
                return {"message": "Option 4 not provided"}, 400
            if args['correct_option'] is None:
                return {"message": "Correct option not provided"}, 400
            if args['quiz_id'] is None:
                return {"message": "Quiz ID not provided"}, 400
            
            question = Question.query.filter_by(id=question_id).first()
            if not question:
                return {"message": "Question record not found"}, 404
            
            question.question = args['question']
            question.option_1 = args['option_1']
            question.option_2 = args['option_2']
            question.option_3 = args['option_3']
            question.option_4 = args['option_4']
            question.correct_option = args['correct_option']
            question.quiz_id = args['quiz_id']
            db.session.commit()
            return {"message": "Question updated successfully"}, 200
        except:
            return {"message": "Error in updating question"}, 400
    
    @auth_required('token')
    @roles_accepted('admin')
    def delete(self, question_id):
        try:
            question = Question.query.filter_by(id=question_id).first()
            if question:
                db.session.delete(question)
                db.session.commit()
                return {"message": "Question deleted successfully"}, 200
            else:
                return {"message": "No Question record found"}, 404
        except:
            return {"message": "Error in deleting question"}, 400
        
        
quiz_parser = reqparse.RequestParser()
quiz_parser.add_argument('time_duration')
quiz_parser.add_argument('remark')
quiz_parser.add_argument('chapter_id')
        
class QuizApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'user')
    def get(self, chapter_id):
        quizes = Quiz.query.filter_by(chapter_id=chapter_id).all()
        quizes_json = []
        for quiz in quizes:
            this_quiz = {}
            this_quiz['id'] = quiz.id
            this_quiz['time_duration'] = quiz.time_duration
            this_quiz['date_of_quiz'] = quiz.date_of_quiz
            this_quiz['remark'] = quiz.remark
            this_quiz['chapter_id'] = quiz.chapter_id
            this_quiz['chapter_name'] = quiz.chapter.name
            quizes_json.append(this_quiz)
            
        if quizes_json:
            return quizes_json, 200
        else:
            return {
                "message": "No quizes found"
            }, 404
    
    @auth_required('token')
    @roles_accepted('admin')
    def post(self, chapter_id):
        try:
            args = quiz_parser.parse_args()
            if args['time_duration'] is None:
                return {"message": "Time duration not provided"}, 400
            if args['remark'] is None:
                return {"message": "Remark not provided"}, 400
            if args['chapter_id'] is None:
                return {"message": "Chapter ID not provided"}, 400
            
            quiz = Quiz(time_duration=int(args['time_duration']), date_of_quiz=datetime.datetime.utcnow(), remark=args['remark'], chapter_id=args['chapter_id']) 
            db.session.add(quiz)
            db.session.commit()
            result = quiz_update.delay()
            return {"message": "Quiz added successfully"}, 201
        except:
            print(("e", args))
            return {"message": "Error in adding quiz"}, 400      
            
    @auth_required('token')
    @roles_accepted('admin')
    def put(self, quiz_id):
        try:
            args = quiz_parser.parse_args()
            if args['time_duration'] is None:
                return {"message": "Time duration not provided"}, 400
            if args['remark'] is None:
                return {"message": "Remark not provided"}, 400
            if args['chapter_id'] is None:
                return {"message": "Chapter ID not provided"}, 400
            
            quiz = Quiz.query.filter_by(id=quiz_id).first()
            if not quiz:
                return {"message": "Quiz record not found"}, 404
            
            quiz.time_duration = args['time_duration']
            quiz.date_of_quiz = datetime.datetime.utcnow()
            quiz.remark = args['remark']
            quiz.chapter_id = args['chapter_id']
            db.session.commit()
            return {"message": "Quiz updated successfully"}, 200
        except:
            print(args)
            return {"message": "Error in updating quiz"}, 400
        
    @auth_required('token')
    @roles_accepted('admin')
    def delete(self, quiz_id):
        try:
            quiz = Quiz.query.filter_by(id=quiz_id).first()
            if quiz:
                db.session.delete(quiz)
                db.session.commit()
                return {"message": "Quiz deleted successfully"}, 200
            else:
                return {"message": "No Quiz record found"}, 404
        except:
            return {"message": "Error in deleting quiz"}, 400
        
chapter_parser = reqparse.RequestParser()
chapter_parser.add_argument('name')
chapter_parser.add_argument('description')
chapter_parser.add_argument('subject_id')

class ChapterApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'user')
    def get(self, subject_id):
        chapters = []
        chapters_json = []
        chapters = Chapter.query.filter_by(subject_id=subject_id).all()
        for chapter in chapters:
            this_chapter = {}
            this_chapter['id'] = chapter.id
            this_chapter['name'] = chapter.name
            this_chapter['description'] = chapter.description
            this_chapter['subject_id'] = chapter.subject_id
            this_chapter['subject_name'] = chapter.subject.name
            chapters_json.append(this_chapter)
            
        if chapters_json:
            return chapters_json, 200
        else:
            return {
                "message": "No chapters found"
            }, 404
    
    @auth_required('token')
    @roles_accepted('admin')
    def post(self, subject_id):
        try:
            args = chapter_parser.parse_args()
            if args['name'] is None:
                return {"message": "Name not provided"}, 400
            if args['description'] is None:
                return {"message": "Description not provided"}, 400
            if args['subject_id'] is None:
                return {"message": "Subject ID not provided"}, 400
            
            chapter = Chapter(name=args['name'], description=args['description'], subject_id=args['subject_id']) 
            db.session.add(chapter)
            db.session.commit()
            return {"message": "Chapter added successfully"}, 201
        except:
            return {"message": "Error in adding chapter"}, 400
        
    @auth_required('token')
    @roles_accepted('admin')
    def put(self, chapter_id):
        try:
            args = chapter_parser.parse_args()
            if args['name'] is None:
                return {"message": "Name not provided"}, 400
            if args['description'] is None:
                return {"message": "Description not provided"}, 400
            if args['subject_id'] is None:
                return {"message": "Subject ID not provided"}, 400
            
            chapter = Chapter.query.filter_by(id=chapter_id).first()
            if not chapter:
                return {"message": "Chapter record not found"}, 404
            
            chapter.name = args['name']
            chapter.description = args['description']
            chapter.subject_id = args['subject_id']
            db.session.commit()
            return {"message": "Chapter updated successfully"}, 200
        except:
            return {"message": "Error in updating chapter"}, 400
        
    @auth_required('token')
    @roles_accepted('admin')
    def delete(self, chapter_id):
        try:
            chapter = Chapter.query.filter_by(id=chapter_id).first()
            if chapter:
                db.session.delete(chapter)
                db.session.commit()
                return {"message": "Chapter deleted successfully"}, 200
            else:
                return {"message": "No Chapter record found"}, 404
        except:
            return {"message": "Error in deleting chapter"}, 400
        

subj_parser = reqparse.RequestParser()
subj_parser.add_argument('name')
subj_parser.add_argument('description')

class SubjectApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'user')
    def get(self):
        subjects = Subject.query.all()
        subjects_json = []
        for subject in subjects:
            this_subject = {}
            this_subject['id'] = subject.id
            this_subject['name'] = subject.name
            this_subject['description'] = subject.description
            subjects_json.append(this_subject)
            
        if subjects_json:
            return subjects_json, 200
        else: 
            return {
                "message": "No subjects found"
            }, 404
            
    @auth_required('token')
    @roles_accepted('admin')
    def post(self):
        try:
            args = subj_parser.parse_args()
            if args['name'] is None:
                return {"message": "Name not provided"}, 400
            if args['description'] is None:
                return {"message": "Description not provided"}, 400
            
            subject = Subject(name=args['name'], description=args['description']) 
            db.session.add(subject)
            db.session.commit()
            return {"message": "Subject added successfully"}, 201
        except:
            return {"message": "Error in adding subject"}, 400
    
    @auth_required('token')
    @roles_accepted('admin')
    def put(self, subject_id):
        try:
            args = subj_parser.parse_args()
            if args['name'] is None:
                return {"message": "Name not provided"}, 400
            if args['description'] is None:
                return {"message": "Description not provided"}, 400
            
            subject = Subject.query.filter_by(id=subject_id).first()
            if not subject:
                return {"message": "Subject record not found"}, 404
            
            subject.name = args['name']
            subject.description = args['description']
            db.session.commit()
            return {"message": "Subject updated successfully"}, 200
        except:
            return {"message": "Error in updating subject"}, 400
    
    @auth_required('token')
    @roles_accepted('admin')
    def delete(self, subject_id):
        try:
            subject = Subject.query.filter_by(id=subject_id).first()
            if subject:
                db.session.delete(subject)
                db.session.commit()
                return {"message": "Subject deleted successfully"}, 200
            else:
                return {"message": "No Subject record found"}, 404
        except:
            return {"message": "Error in deleting subject"}, 400
        
api.add_resource(ScoreApi, '/api/<int:user_id>/score/get', '/api/<int:user_id>/<int:quiz_id>/score/create', '/api/score/update/<int:score_id>', '/api/score/delete/<int:score_id>')
api.add_resource(QuestionApi, '/api/<int:quiz_id>/question/get', '/api/<int:quiz_id>/question/create', '/api/question/update/<int:question_id>', '/api/question/delete/<int:question_id>')
api.add_resource(QuizApi, '/api/<int:chapter_id>/quiz/get', '/api/<int:chapter_id>/quiz/create', '/api/quiz/update/<int:quiz_id>', '/api/quiz/delete/<int:quiz_id>')
api.add_resource(ChapterApi, '/api/subject/<int:subject_id>/chapter/get', '/api/subject/<int:subject_id>/chapter/create', '/api/subject/chapter/update/<int:chapter_id>', '/api/subject/chapter/delete/<int:chapter_id>')
api.add_resource(SubjectApi, '/api/subject/get', '/api/subject/create', '/api/subject/update/<int:subject_id>', '/api/subject/delete/<int:subject_id>')
