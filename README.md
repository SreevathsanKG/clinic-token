# 🩺 Clinic Pulse – Token Management System

A mini full-stack application built to simulate a clinic's patient flow using a sequential token system.

## 🚀 How to Run

### Prerequisites

* Node.js (v18+)
* PostgreSQL Database (Neon DB connection string is in the `.env` file)

### 1. Backend Setup (Node.js/Express/Sequelize)

1.  Navigate to the `backend/` directory.
2.  Install dependencies: `npm install`
3.  Create a `.env` file in `backend/` and paste your PostgreSQL connection string:
    ```
    DATABASE_URL='postgresql://neondb_owner:npg_7C0NeiQcSpqa@ep-solitary-recipe-adrwqp8h-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    PORT=3001
    ```
4.  Start the server: `npm start` 
    (The server will automatically connect to the database and synchronize tables.)

### 2. Frontend Setup (React/Vite)

1.  Navigate to the `frontend/` directory.
2.  Install dependencies: `npm install`
3.  Start the client application: `npm run dev`
4.  Open your browser to the URL displayed (usually `http://localhost:5173`).

---

## 💾 Database Table Structure

The primary table is `patients`, managed by Sequelize. The database handles table creation and schema updates automatically on server start.

| Column Name | Data Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | NO | Primary Key, Auto-Increment (Sequelize internal ID) |
| `token_number` | INTEGER | NO | Sequential token number, unique per day. |
| `name` | STRING(100) | NO | Patient's name. |
| `age` | INTEGER | YES | Patient's age (optional). |
| `purpose` | STRING(255) | YES | Reason for the visit. |
| `status` | STRING(50) | NO | Waiting / In Consultation / Done (Default: Waiting). |
| `createdAt` | TIMESTAMP | NO | Timestamp of token generation. |
| `updatedAt` | TIMESTAMP | NO | Last update time. |

---

## 📝 One Short Note on What Could Be Improved Next

The most critical improvement would be integrating **live updates** using **Socket.io**. Currently, both views rely on a **manual "Refresh" button** or set intervals. Implementing Socket.io would allow the **Front Desk View** to instantly display a new token when the doctor marks a patient as 'Done', and the **Doctor View** to update immediately when a new patient is added by the Front Desk, creating a seamless, real-time experience.