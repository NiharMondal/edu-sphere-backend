# Minimal LMS Backend

## Overview

The **Minimal LMS Backend** is the server-side implementation of a Learning Management System (LMS). It follows the **MVC architecture** and provides API endpoints for managing courses, modules, lectures, and user progress.

## Tech Stack

-   **Framework**: Express.js (TypeScript)
-   **Database**: MongoDB (Mongoose ODM)
-   **Authentication**: JWT (JSON Web Token)
-   **File Storage**: Cloudinary (for images and PDFs) _(Optional)_
-   **Validation**: Express Validator

---

## Features

### **1. Course Management**

-   **CRUD Operations**: Create, Read, Update, Delete courses.
-   **Course Fields**:
    -   Thumbnail (Image)
    -   Title
    -   Price
    -   Description
-   **Dynamic Routing**: Access course details via dynamic routes.

### **2. Module & Lecture Management**

-   **Module Operations**:
    -   Create modules with Title and Module Number (auto-incremented).
    -   Assign modules to a specific course.
-   **Lecture Operations**:
    -   Add lectures with:
        -   Title
        -   Embedded YouTube video links (for simplicity)
        -   Multiple PDF notes (uploaded)
    -   CRUD operations for modules and lectures.

### **3. User Progress Tracking**

-   Users unlock lectures **sequentially**.
-   Progress is **saved and updated** dynamically.
-   Users can mark lectures as **completed**.

### **4. Authentication & Authorization**

-   **Admin Authentication**:
    -   Login/Signup using JWT tokens.
    -   Protected routes for course management.
-   **User Authentication**:
    -   Secure user login/signup.
    -   Access control for viewing lectures.

---

## Installation & Setup

### **1. Clone the Repository**

```sh
    git clone https://github.com/NiharMondal/lms-backend
    cd lms-backend
```

### **2. Install Dependencies**

```bash
    npm install
```

### **3. Configure Environment Variables**

```bash
    MONGO_URI = "your mongodb uri"
    JWT_SECRET = "jwt_secret"
    JWT_EXPIRE = "1d"
    NODE_ENV = "production"
```

### **4. Run the Server**

```bash
    npm run dev
```

The backend will be running on http://localhost:5000.
