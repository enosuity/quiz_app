# PLAN.md - Quiz Management System

## Assumptions & Scope
- **Goal**: Build a production-ready Quiz Management System with an Admin Panel and Public Page.
- **Timeframe**: 2 hours (simulated).
- **Architecture**: Microservices-based (Frontend + Backend + DB) using Docker Compose.
- **Tech Stack**:
    - **Frontend**: React (Vite) + TailwindCSS.
    - **Backend**: Ruby on Rails (API mode).
    - **Database**: PostgreSQL (Dockerized).
- **Deployment**: Local Docker Compose (Primary), Vercel/Render (Secondary/Bonus).

## Approach
1.  **Backend First**: robust API with Rails, Devise for Auth, and flexible JSONB for Question storage to support multiple types (MCQ, True/False, Text).
2.  **Frontend Second**: Clean, "rich aesthetic" UI using TailwindCSS.
    - **Admin Flow**: Login -> Dashboard -> Create Quiz.
    - **Public Flow**: View Quiz -> Take Quiz -> See Results.
3.  **Docker**: Containerization for "production-ready" local simulation.

## Schema Design
- **Users**: `email`, `password_digest`, `jti` (JWT).
- **Quizzes**: `title`, `description`, `time_limit`, `user_id` (creator).
- **Questions**: `quiz_id`, `text`, `question_type` (enum: mcq, true_false, text), `options` (jsonb), `correct_answer`.
- **Attempts**: `user_id` (taker), `quiz_id`, `score`, `answers` (jsonb).

## Scope Changes
- *Initial*: Basic quiz taking.
- *Updated*: 
    - Added Admin Panel for creation and support for multiple question types.
    - Added "Detailed Results" view to show correct answers after submission.
    - Enhanced Signup flow with Password Confirmation and Admin Role selection.

## Reflection
This project successfully implements a microservices-based Quiz Management System. 
- **Trade-offs**: 
    - Used Rails API mode for a lightweight backend but had to manually handle some Devise configuration (sessions).
    - Chose a simple "flat" JSON structure for some responses initially, which required adjustment to standard JSON:API format for consistency.
    - Frontend state management was kept simple with React Context, which is sufficient for this scale but might need Redux/Zustand for larger apps.
- **Future Improvements**:
    - Add real-time leaderboard.
    - Implement pagination for quizzes and questions.
    - Add unit and integration tests (RSpec/Jest).
    - Deploy to a cloud provider.
