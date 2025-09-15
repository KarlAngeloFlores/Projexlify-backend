# Projexlify - Project Management Web App
> Backend

#### This repository contains the Backend of the Projexlify - Project Management App, developed with Node.js + Express + MySQL.
It provides REST APIs for projects, tasks, and authentication.
The frontend consumes these APIs to manage projects and tasks effectively.

## Tech Stack
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MySQL** – Relational database
- **JWT** – Authentication & authorization
- **bcrypt** – Password hashing
- **dotenv** – Environment variables
- **cookie-parser** – HTTP-only cookies
- **nodemailer** – Email notifications

## Features
- **User authentication** (register, login, JWT-based auth)
- **Project management** (create, view, update, delete projects)
- **Task management** (add, update, delete tasks)
- **Route protection** with JWT & cookies
- **Secure password** storage with bcrypt
- **MySQL integration** using mysql2

## Installation & Setup
> **Important:** For the backend to be fully functional, you must **run the frontend after running this.** 

>Frontend repository: **link**

>Default frontend URL: `http://localhost:5173`

### 1. Clone this repository 
> git clone **https://github.com/KarlAngeloFlores/Projexlify-backend.git**

### 2. Install dependencies

```
npm install
```

### 3. Open MySQL Client
### MySQL TABLES
## Execute all of this on your MySQL Platform
```
-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE, -- optional public identifier
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- =====================
-- PROJECTS TABLE
-- =====================
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('planned','active','completed','deleted') NOT NULL DEFAULT 'planned',
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- =====================
-- TASKS TABLE
-- =====================
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    status ENUM('todo','in_progress','done','deleted') NOT NULL DEFAULT 'todo',
    position INT NOT NULL DEFAULT 0, 
    contents TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
-- =====================
-- TASK LOGS TABLE
-- =====================

CREATE TABLE task_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    project_id INT NULL,
    old_status ENUM('todo','in_progress','done','deleted'),
    new_status ENUM('todo','in_progress','done','deleted'),
    remark TEXT,
    updated_by INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- =====================
-- PROJECT LOGS TABLE
-- =====================
CREATE TABLE project_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    old_status ENUM('planned','active','completed','deleted'),
    new_status ENUM('planned','active','completed','deleted'),
    remark TEXT,
    updated_by INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================
-- PROJECTS ACCESS TABLE
-- =====================
CREATE TABLE projects_access (
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'read',  -- flexible role storage
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- =====================
-- VERIFICATION CODE TABLE
-- =====================
CREATE TABLE verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    email VARCHAR(255) NULL,
    code_hash VARCHAR(255) NOT NULL,
    purpose ENUM('account_verification', 'password_reset') NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

```

### 4. Configure a .file in the project root
#### Create a **.env** file in the project root:
```
PORT=5000
DB_PORT=your_db_port
DB_USER=your_user_port
DB_PASS=your_db_pass
DB_NAME=your_db_name

EMAIL=your_email
EMAIL_PASS=your_smtp_password_or_app_password

JWT_SECRET=your_jwt_secret
```

### 5. Run development server
#### Type this on terminal on frontend directory  
```
npm run dev
```


## 📌 API Endpoints  
### 🔐 Authentication
### Example 
> http://localhost:5000/auth/login

| Method | Endpoint         | Description                | Authentication Required | Params/Body/Query | 
|--------|------------------|----------------------------|---------------|-------------|
| POST   | `/api/auth/login`    | Login & get JWT token    | ❌ | **Body:** `{ email, password }` |
| POST   | `/api/auth/register` | Pre-register new user        | ❌ | **Body:** `{ username, email, password }` |
| POST    | `/api/auth/verify`       | verify and register new user | ❌ | **Body:** `{ token, password, code }` | 
| POST   | `/api/auth/logout` | Clear accessToken on Http Cookie         | ✅ | None |
| PATCH   | `/api/auth/change_password`    | Login & get JWT token    | ✅ | **Body:** `{ oldPassword, newPassword }` |
| POST    | `/api/auth/forgot_password`       | Sends verification code for changing passsword | ❌ | **Body:** `{ email }` |
| POST   | `/api/auth/verify_reset_password` | Verify sent code from email        | ❌ | **Body:** `{ email, code }` |
| PATCH   | `/api/auth/confirm_password`    | Update the user's password to new password    | ❌ | **Body:** `{ email, newPassword, confirmPassword }` |
| POST    | `/api/auth/resend_code`       | Reusable for sending verification code for registration and forgot password | ❌ | **Body:** `{ email, purpose }` |

### 📂 Projects
### Example 
> http://localhost:5000/project/get_all_project

| Method | Endpoint                      | Description               | Authentication Required | Authorization (Project Access) | Params/Body/Query |
|--------|-------------------------------|---------------------------|----------------|--------------------------------|-------------------|
| GET    | `/api/project/get_all_project` | Get all projects by user  | ✅  | Any logged-in user | None |
| GET    | `/api/project/get_project` | Get one project  | ✅  | Owner (only their own projects) | **Query:** `{ projectId }` |
| POST   | `/api/project/create_project`                 | Create new project        | ✅ | Any logged-in user | **Body:** `{ name, description }` |
| PATCH    | `/api/project/patch_project`             | Update Project with remark or none       | ✅  | Owner | **Body:** `{ projectId, name, description, newStatus, remark }` | 
| DELETE | `/api/project/delete_project`             | Soft Delete project            | ✅             | Owner | **Body** `{ projectId, remark }` |


### ✅ Tasks
### Example 
> http://localhost:5000/project/get_all_task

| Method | Endpoint                   | Description               | Auth Required | Authorization (project access) | Params/Body/Query |
|--------|----------------------------|---------------------------|---------------|--------------------------------| ------------------|
| GET    | `/api/project/get_all_task`  | Get all tasks within a project   | ✅ | owner | **Query:** `{ projectId }` |
| GET   | `/api/project/get_task`  | Get one task from a project           | ✅ | owner | **Query:** `{ taskId }`
| POST    | `/api/project/create_task`           |  Create new task within a project              | ✅ | owner | **Body:** `{ projectId, name, status, contents }` |
| PATCH | `/api/project/patch_task`           | Update task within a project               | ✅ | owner | **Body** `{ projectId, taskId, name, contents, newStatus, remark }` |
| PATCH | `/api/project/update_reorder`           | Update task status only reorder position for drag-and-drop feature               | ✅ | owner | **Body:** `{ tasks, taskId, newStatus, projectId }` |
DELETE | `/api/project/delete_task`           | Soft delete task               | ✅ | owner | **Body:** `{ taskId, projectId, remark }` |

### 📖 History Logs
### Example 
> http://localhost:5000/log/get_projects_log

| Method | Endpoint                   | Description               | Auth Required | Authorization (project access) | Params/Body/Query |
|--------|----------------------------|---------------------------|---------------|--------------------------------| ------------------|
| GET    | `/api/log/get_projects_log`| Get all the logs of a project itself (not task) | ✅ | Owner  | **Body:** `{ projectId }` |
| GET    | `/api/log/get_tasks_log`| Get all the logs of a project itself (not task) | ✅ | Owner  | **Body:** `{ projectId }` |

### 🔑 Access Emoji (Incomplete scalable functionality)
### Example 
> http://localhost:5000/access/get_shared

| Method | Endpoint                   | Description               | Auth Required | Authorization (project access) | Params/Body/Query |
|--------|----------------------------|---------------------------|---------------|--------------------------------| ------------------|
| GET    | `/api/access/get_shared`| Get all shared projects from others | ✅ | Any logged-in user  | None |
| POST    | `/api/access/give_access`| Give project access to chosen users **(write, read)** | ✅ | None  | **Body:** `{ email, projectId, role }` |
| PATCH    | `/api/access/patch_access`| Change project access of the chosen user **(write, read)** | ✅ | None | **Body:** `{ userId, projectId, role }` |
| DELETE    | `/api/access/delete_access`| Remove all access of the chosen user | ✅ | None  | **Body:** `{ userId, projectId }` |




## Incomplete functionalities (other scalable features that can be added with the project)
### Real-time collaboration within a project
Requirements
- Socket.IO – Real-time updates for tasks/projects
- Broadcasting events – Changes made by one user reflected instantly for others

### Advanced Project Sharing & Roles
Requirements
- Invitation notification via Email.
- Define roles: (Owner, Write, Read)

### Refresh Token (Better Security)
Requirements
- Add refresh tokens for extended sessions of accessToken
- Handle token expiry gracefully
