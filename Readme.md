# Course Management system

#### Video Demo: https://youtu.be/UB_pIYT1nqE

### Description:

This is a Course Management System built with TypeScript + React for the frontend and Python + Flask for the backend. The application provides different functionalities based on user roles (Student or Instructor), offering an intuitive interface for course creation, enrollment, and management.
<br />

## Features

#### For Students:

- View available courses.
- Enroll in courses.
- View the courses they are enrolled in.
- Search the courses that in the database.

#### For Instructors:

- Create new courses with detailed descriptions and credit information.
- View and manage the courses they have created.
- Access a list of students enrolled in their courses.

## Tech Stack

### Frontend

- Framework: React
- Language: TypeScript
- Styling: CSS/SCSS

### Backend

- Framework: Flask
- Language: Python
- Database: SQLite with SQLAlchemy ORM
- Authentication: JWT (JSON Web Tokens)
- CORS Handling: Flask-CORS

<br>
Because HTTP is a stateless protocol, which means the system would not remain the session state in the system. As a result, the system needs a solution to send the request with information securely.

<br>
With JWT (JSON Web Token), the application can use it as an authentication method to authorize the user’s actions and transmit the system’s state. A JWT consists of three parts: the header, payload, and signature. The header specifies the encryption method, the payload stores the user information, and the signature secures the token, ensuring its integrity and preventing attacks.

<br>

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (for frontend)
- Python 3.10+ (for backend)
- SQLite (or any supported database)

<br />

## Future Improvements

- Add **real-time** notifications for new courses or enrollment status.
- Implement an **admin dashboard** for managing users and courses.
- Support for uploading course materials and resources.
- Add internationalization (i18n) for multilingual support.
  <br />

## Contribution

We welcome contributions to enhance this project. Feel free to open issues or submit pull requests.

### Contact

For any inquiries or support, please contact:

- Name: Lawrence
- Email: lawrence891106@gmail.com

## License

This project is licensed under the MIT License.\
**Copyright © 2024-present Lawrence Wu**
