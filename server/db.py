from sqlalchemy import create_engine, Column, ForeignKey, Table
from sqlalchemy import Integer, Text
from sqlalchemy.orm import Session, sessionmaker, joinedload, relationship
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.declarative import declarative_base
from werkzeug.security import check_password_hash, generate_password_hash
import json

# The toturial is from https://www.youtube.com/watch?v=AKQ3XEDI9Mw
Base = declarative_base()
engine = create_engine('sqlite:///courses.db', echo=True)
Session = sessionmaker(bind=engine)

# The base setting is from https://docs.sqlalchemy.org/en/20/core/constraints.html
# The class structure is from https://www.freecodecamp.org/news/jwt-authentication-in-flask/
class Courses(Base):
    __tablename__ = "courses"
    _id = Column(Integer, primary_key=True, autoincrement=True)
    course = Column(Text, nullable=False)
    description = Column(Text)
    credits = Column(Integer, nullable=False)
    instructor_id = Column(Integer, ForeignKey("users._id"), nullable=False)
    students = Column(Text, nullable=True)

    def __repr__(self):
        return f"[_id: {self._id}, course: {self.course}, credits: {self.credits}, description: {self.description}, instructor_id: {self.instructor_id}, students: {self.students}]"
    
    def toDict(self):
        return {
            "_id": self._id,
            "course": self.course,
            "credits": self.credits,
            "description": self.description,
            "instructor_id": self.instructor_id,
            "students": json.loads(self.students) 
        }
    
    users = relationship("Users", back_populates="courses")

class Users(Base):
    __tablename__ = "users"
    _id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    role = Column(Text, nullable=False)

    def __repr__(self):
        return f"[_id: {self._id}, username: {self.username}, role: {self.role}, email: {self.email}]"
    
    def toDict(self):
        return {
            "_id": self._id,
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "role": self.role
        }
    
    courses = relationship("Courses", back_populates="users")

Base.metadata.create_all(bind=engine, checkfirst=True)

# Add some initail course
math = Courses(course="Math", description="This is a math class", credits=3, instructor_id=2, students=json.dumps([]))
Science = Courses(course="Science", description="This is a science class", credits=2, instructor_id=2, students=json.dumps([]))
PE = Courses(course="PE", description="This is a PE class", credits=1, instructor_id=2, students=json.dumps([]))
CS = Courses(course="CS", description="This is a cs class", credits=3, instructor_id=2, students=json.dumps([]))
English = Courses(course="English", description="This is a english class", credits=2, instructor_id=2, students=json.dumps([]))

session = Session()
try:
    if session.query(Courses).first() == None:
        session.add_all([math, Science, PE, CS, English])
        session.commit()
    else:
        print("There's data.")
except:
    print("Initailization problem")
finally:
    session.close()


def create_session():
    session = Session()
    return session

def add_course(course, description, credits, instructor_id):
    new_course = Courses(course=course, description=description, credits=credits, instructor_id=instructor_id, students=json.dumps([]))
    
    session = create_session()
    # Error handling from https://ithelp.ithome.com.tw/articles/10282663
    try:
        instructor = session.query(Users).filter(Users._id==instructor_id).first()
        if not instructor:
            return {"status": "error", "message": f"Instructor with id {instructor_id} doesn't exist."}
        session.add(new_course)
        session.commit()
        return {"status": "success", "message": "Course added."}
    except Exception as e:
        message = f"{e}"
        session.rollback()
        print(message)
        return {"status": "error", "message": message}
    finally:
        session.close()

def add_user(username, email, password, role):
    hashed_password = generate_password_hash(password)
    new_user = Users(username=username, email=email, password=hashed_password, role=role) # Avoid the id be assigned
    
    session = create_session()
    # Error handling from https://ithelp.ithome.com.tw/articles/10282663
    try:
        session.add(new_user)
        session.commit()
        return {"status": "success", "message": "User registered success."}
    except IntegrityError:
        session.rollback() # Avoid databse damage
        return {"status": "error", "message": "The user has already register."}
    except Exception as e:
        message = f"{e}"
        session.rollback()  # Roll back session to avoid damage to the database
        print(message)
        return {"status": "error", "message": message}
        
    finally:
        session.close()
    
def user_login(email, password):
    session = create_session()
    try:
        user_data = session.query(Users).filter(Users.email == email).first()
        if not user_data: # Check if the user exist
            return {"status": "error", "message": "User not found."}
            
        user_password = user_data.password
        if not check_password_hash(user_password, password): # Check the password
            return {"status": "error", "message": "Password is incorrect."}
            
        user = user_data.toDict()
        return {"status": "success", "message": "Login success", "_id": user["_id"], "email": user["email"], "role": user["role"],"user": user}
    except Exception as e:
        message = f"{e}"
        session.rollback()
        print(message)
        return {"status": "error", "message": message}
    
    finally:
        session.close()

def get_all_course():

    session = create_session()
    
    try:
        course_data = session.query(Courses).options(joinedload(Courses.users)).all()

        course_list = []
        for course in course_data:
            course_dict = course.toDict()
            course_dict["instructor"] = course.users.username
            course_list.append(course_dict)
        
        return {"status": "success", "message": course_list}
    except Exception as e:
        message = f"{e}"
        session.rollback()
        return {"status": "error", "message": message}
    
    finally:
        session.close()

def get_enrolled_course(_id):
    session = create_session()
    
    try:
        enrolled = []
        courses_data = session.query(Courses).all()
        for course in courses_data:
            students = json.loads(course.students)
            if int(_id) in students:
                enrolled.append(course)
            
        # Inseert the instructor name instead of instructor id
        result = []
        for enrolled_course in enrolled:
            instructor = session.query(Users.username).filter(Users._id == Courses.instructor_id).first()
            course_dict = enrolled_course.toDict()
            course_dict["instructor"] = instructor[0]
            result.append(course_dict)

        return {"status": "success", "message": result}
    except Exception as e:
        message = f"{e}"
        session.rollback()
        print("\nfrom db", message)
        return {"status": "error", "message": message}
    
    finally:
        session.close()

def get_created_course(_id):
    session = create_session()
    
    try:
        course_data = session.query(Courses).options(joinedload(Courses.users)).filter_by(instructor_id=_id).all()
        if not course_data:
            return {"status": "error", "message": "Can't find the created courses."}
        
        course_list = []
        for course in course_data:
            course_dict = course.toDict()
            course_dict["instructor"] = course.users.username
            course_list.append(course_dict)

        return {"status": "success", "message": course_list}
    except Exception as e:
        message = f"{e}"
        session.rollback()
        print("\nfrom db", message)
        return {"status": "error", "message": message}
    
    finally:
        session.close()

def get_course_by_name(name):
    session = create_session()
    
    try:
        course_data = session.query(Courses).options(joinedload(Courses.users)).filter(Courses.course.like(f"%{name}%")).all()
        if not course_data:
            return {"status": "error", "message": "Can't find courses with the name."}
        
        course_list = []
        for course in course_data:
            course_dict = course.toDict()
            course_dict["instructor"] = course.users.username
            course_list.append(course_dict)

        return {"status": "success", "message": course_list}
    except Exception as e:
        message = f"{e}"
        session.rollback()
        print("\nfrom db", message)
        return {"status": "error", "message": message}
    
    finally:
        session.close()

def enroll_course(_id, student):
    session = create_session()
    
    try:
        course_data = session.query(Courses).filter(Courses._id == _id).first()

        if not course_data:
            return {"status": "error", "message": "The course doesn't exist."}
        
        students = json.loads(course_data.students)
        if int(_id) in students:
            return {"status": "success", "message": "The student has enrolled the course."}
        students.append(student)
        course_data.students = json.dumps(students)
        session.commit()

        return {"status": "success", "message": "Success"}
    except Exception as e:
        message = f"{e}"
        session.rollback()
        print("\nfrom db", message)
        return {"status": "error", "message": message}
    
    finally:
        session.close()