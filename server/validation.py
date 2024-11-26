import re

def email_validation(email):
    # The regex pattern is from Week 8 slides
    EMAIL_REGEX = r"^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    
    if not re.match(EMAIL_REGEX, email):
        return False
    else:
        return True
    
def role_validation(role):
    role = role.lower()
    if role not in ["student", "instructor"]:
        return False
    else:
        return True
    
def register_validation(data):
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    role = data.get("role")
    error = []

    if not username:
        error.append({"message": "Username can not be blank."})
    elif not password:
        error.append({"message": "Password can not be blank." })
    elif not email: 
        error.append({"message": "Email can not be blank." })
    elif not role:
        error.append({"message": "Role can not be blank." })
    
    if not email_validation(email):
        error.append({"message": "Please enter a valid email address." })
    elif not role_validation(role):
        error.append({"message": "Please select 'Student' or 'Instructor'." })
    
    if len(error) > 0:
        return error
    return None

def login_validation(data):
    password = data.get("password")
    email = data.get("email")
    error = []

    # Check if the data exist
    if not email:
        error.append({"message": "Email can not be blank."})
    elif not password:
        error.append({"message": "Password can not be blank." })
    
    # Check if the email format correct
    if not email_validation(email):
        error.append({"message": "Please enter a valid email address." })
    
    if len(error) > 0:
        return error
    return None

def course_validation(data):
    title = data.get("title")
    description = data.get("description")
    credits = data.get("credits")
    error = []

    if not title:
        error.append({"message": "Title can not be blank."})
    elif not description:
        error.append({"message": "Description can not be blank."})
    elif not credits:
        error.append({"message": "Credits can not be blank."})

    if len(title.split()) > 20:
        error.append({"message": "The title is too long. Please limit it to 20 words or fewer."})

    if len(description.split()) < 5:
        error.append({"message": "The description is too short. Please provide at least 5 words to give more detail."})
    elif len(description.split()) > 200:
        error.append({"message": "The description is too long. Please limit it to 200 words or fewer."})
    
    if int(credits) < 0:
        error.append({"message": "Credits should be at least one."})
    elif int(credits) > 4:
        error.append({"message": "Credits should be less than 5."})
    
    if len(error) > 0:
        return error
    return None