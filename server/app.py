from flask import Flask, request, jsonify, Response
from flask_cors import CORS # Implemetn CORS in Flask: https://medium.com/@mterrano1/cors-in-a-flask-api-38051388f8cc
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import validation, db
from datetime import timedelta

AUTH_ROUTE = "/api/user"
COURSE_ROUTE = "/api/course"

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'your-very-secure-secret-key'
app.config["JWT_SECRET_KEY"] = "super-secret" # This should be hide
app.config['JWT_TOKEN_LOCATION'] = ['headers'] # Learning config setting form freecodecamp https://www.freecodecamp.org/news/jwt-authentication-in-flask/#:~:text=3.-,Configure%20the%20application%20for%20JWT%20Authentication
app.config["JWT_HEADER_TYPE"] = "Bearer"

# Set the expiration time for the https://stackoverflow.com/questions/46197050/flask-jwt-extend-validity-of-token-on-each-request
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)


@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONs"
    print("Receiveing request")
    return response

@app.route(AUTH_ROUTE + "/login", methods=["POST"])
def login():
    # Leveraging JSON with Flask: https://apidog.com/blog/flask-post-json/
    data = request.get_json()
    error = validation.login_validation(data)
    
    if error and len(error) > 0:
        message = ""
        for i in error:
            message += (i["message"] + " ")
        return jsonify({"message": message}), 400

    email = data.get("email")
    password = data.get("password")

    result = db.user_login(email, password)
    if result["status"] == "error":
        return result["message"], 400
    else:
        # Using HWT with flask from: https://flask-jwt-extended.readthedocs.io/en/stable/basic_usage.html
        token_object = {"_id": result["_id"], "email": result["email"], "role": result["role"]}
        access_token = create_access_token(identity=token_object)
        
        return jsonify({
            "message": "Login success",
            "token": access_token,
            "user": result["user"],
        }), 200

@app.route(AUTH_ROUTE + "/register", methods=["POST"])
def register():
    # Leveraging JSON with Flask: https://apidog.com/blog/flask-post-json/
    data = request.get_json()
    error = validation.register_validation(data)
    if error and len(error) > 0:
        message = ""
        for i in error:
            message += (i["message"] + " ")
        return message, 400
    
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    role = data.get("role")

    result = db.add_user(username, email, password, role)
    if result["status"] == "error":
        return result["message"], 400
    
    return "Success", 200


# Course API
@app.route(COURSE_ROUTE, methods=["POST"])
@jwt_required()
def post_course():
    course_data = request.get_json()
    error = validation.course_validation(course_data)
    if error and len(error) > 0:
        message = ""
        for i in error:
            message += (i["message"] + " ")
        return message, 400
    
    title = course_data.get("title")
    description = course_data.get("description")
    credits = course_data.get("credits")

    # Get jwt user from https://flask-jwt-extended.readthedocs.io/en/3.0.0_release/basic_usage/
    current_user = get_jwt_identity()
    if current_user["role"] != "instructor":
        return "Only instructors are allowed to use this function", 400
    
    result = db.add_course(course=title, description=description, credits=credits, instructor_id=current_user["_id"])
    if result["status"] == "error":
        return result["message"], 400

    return jsonify(result["message"]), 200

@app.route(COURSE_ROUTE + "/findByName/<name>", methods=["GET"])
@jwt_required()
def getCoursesByName(name):
    result = db.get_course_by_name(name)
    
    if result["status"] == "error":
        return result["message"], 400
    
    return jsonify(result["message"]), 200

@app.route(COURSE_ROUTE + "/enroll/<_id>", methods=["POST"])
@jwt_required()
def enroll_course_by_id(_id):
    print(request.headers)

    current_user = get_jwt_identity()
    student = current_user["_id"]
    
    result = db.enroll_course(_id, student)
    if result["status"] == "error":
        return result["message"], 400
    
    print(result["message"])
    return result["message"], 200

@app.route(COURSE_ROUTE + "/allCourse", methods=["GET"])
@jwt_required() # Check the authentiaction before accessing route, 
# from https://www.freecodecamp.org/news/jwt-authentication-in-flask/#:~:text=4.-,Create%20protected%20routes
def get_all_courses():
    result = db.get_all_course()
    
    if result["status"] == "error":
        return result["message"], 400
    
    return jsonify(result["message"]), 200

# Get the parameters from the path, from https://stackoverflow.com/questions/41492721/in-python-flask-how-do-you-get-the-path-parameters-outside-of-the-route-functio
@app.route(COURSE_ROUTE + "/student/<_id>", methods=["GET"])
@jwt_required()
def get_student_course(_id):
    result = db.get_enrolled_course(_id)

    if result["status"] == "error":
        return Response(result["message"]), 400
    
    return jsonify(result["message"]), 200

@app.route(COURSE_ROUTE + "/instructor/<_id>", methods=["GET"])
@jwt_required()
def get_instructor_course(_id):
    result = db.get_created_course(_id)

    if result["status"] == "error":
        return result["message"], 400

    return jsonify(result["message"]), 200

@app.route(COURSE_ROUTE + "/patch/<_id>", methods=["PATCH"])
@jwt_required()
def edit_course(_id):
    result = db.edit_course_by_id(_id)

    if result["status"] == "error":
        return result["message"], 400

    return jsonify(result["message"]), 200