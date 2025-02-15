# BlogifyAuth - Node.js Blog Application with Authentication

BlogifyAuth is a simple blog management application built using Node.js, Express.js, and MongoDB. The application allows users to create, view, update, and delete posts with role-based authentication. Only authenticated users can manage their own posts, while admins have the ability to manage all users and posts.


---
# Features

- User Registration & Login: Secure registration and login system using JWT tokens and cookies for authentication.
- CRUD Operations: Users can create, read, update, and delete their own posts.
- Post Access Control: Each user can only view and manage their own posts.
- Admin Role: Admins have full access to all users and posts, including the ability to delete or modify them.
- JWT Authentication: Secures API routes by using JWT tokens for authorization.
- Cookie Storage: JWT tokens are stored in cookies for maintaining user sessions.


---
# Technologies Used

- Node.js: JavaScript runtime for building the backend.
- Express.js: Web framework for building the REST API and handling routing.
- MongoDB: NoSQL database for storing user and post data.
- JWT (JSON Web Tokens): For secure authentication and authorization.
- Bcrypt.js: For password hashing.
- Cookie-parser: For handling cookies in the application.
