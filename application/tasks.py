from celery import shared_task
from .models import *
from .utils import format_report
from .mail import send_email
import requests


@shared_task(ignore_result = False, name = "monthly_report")
def monthly_report():
    users = User.query.all()
    
    for user in users[1:]:  # Assuming index [0] is skipped intentionally
        user_data = {
            "username": user.username,
            "email": user.email,
            "score": []  # Store user scores here
        }

        # ✅ Fetch scores for the user (assuming User has a relationship with Score)
        for s in user.scores:  
            user_data["score"].append({
                "id": s.id,
                "quiz_id": s.quiz_id,
                "score": s.score,
                "last_score": s.last_score,
                "time_taken": s.time_taken
            })

        # ✅ Render the HTML email with the correct template
        message = format_report('templates/mail_details.html', user_data)
        
        # ✅ Send email with the generated message
        send_email(user.email, subject="Monthly Scores Report", message=message)

    return "monthly report submitted"

@shared_task(ignore_result = False, name = "quiz_update")
def quiz_update():
    text = "New Quiz is added!! Please check the app at http://127.0.0.1:5000"
    response = requests.post('https://chat.googleapis.com/v1/spaces/AAAARUU6Uc0/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=SP2U_TLwOwRWIHJJSYnzC40yFBDMAP8tMCCokIIQ1Bs',headers = {'Content-type': 'application/json'}, json ={"text": text})
    print(response.status_code)
    return "daily report submitted"