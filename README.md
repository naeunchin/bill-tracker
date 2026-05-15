# Bill Tracker Application 

**Developer:** Na Eun Chin  
**Last Updated:** May 2026

---

## Project Overview 
This project is a full-stack web application designed for managing and tracking personal Bill records. The backend is a robust RESTful API built with Java and Spring Boot, utilizing Spring Data JPA for seamless database interactions. The frontend is a modern, responsive Single Page Application (SPA) built with React and scaffolded with Vite, providing an intuitive User Interface for full CRUD (Create, Read, Update, Delete) operations.

### App Demo
<img width="1818" height="1080" alt="bill-tracker-demo-gif" src="https://github.com/user-attachments/assets/f0ffef29-a229-4fd9-bcaa-fc242a955145" />

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
Before running this project, ensure you have the following installed:
* **Java Development Kit (JDK):** Version 17 or higher
* **Node.js & npm:** Version 18 or higher

### 1. Backend Setup (Spring Boot)
The backend utilizes an embedded H2 database, meaning no external database installation is required. The database will initialize automatically upon startup.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the Spring Boot application using the Maven wrapper:
- On Windows (PowerShell): `.\mvnw spring-boot:run`
- On Mac/Linux: `./mvnw spring-boot:run`
3. The API will now be running at http://localhost:8080.

### 2. Frontend Setup (React)
The frontend uses Vite for ultra-fast Hot Module Replacement (HMR) and optimized builds.

1. Open a new terminal window and navigate to the frontend directory: `cd frontend`
2. Install the necessary dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your web browser and navigate to http://localhost:5173 to use the application.

---

## Selected Technologies & Rationale

### Backend Framework
- Framework: Spring Boot (Java)  
- Version: 4.0.5  

**Why I chose this framework:** I selected Spring Boot because it is an industry-standard, enterprise-grade framework that allows for rapid development of REST APIs. By utilizing Spring Data JPA, the framework automatically handles the underlying SQL queries and database table creation, significantly speeding up development time while maintaining robust data integrity. It also pairs perfectly with in-memory databases like H2 for rapid local development and testing.   

### Frontend / Client
- Framework: React  
- Version: 19.2.4

**Why I chose this framework:** React is the leading modern framework for building dynamic Single Page Applications. I chose it because of its component-based architecture, making it incredibly efficient to fetch, render, and manipulate data from a backend REST API. I utilized libraries like react-bootstrap to implement responsive, complex UI features (like interactive modals). Furthermore, I used Vite as the build tool to scaffold the app, as it provides a significantly faster and leaner development experience compared to older tools like Create React App.

---

## Security & Demo Mode Notice

To make this application easily accessible for the audience without requiring them to configure a dedicated authorization or authentication services, the application is currently running in **Demo Mode**. 

* **Authentication Bypassed:** JSON Web Token (JWT) verification has been temporarily disabled. The application currently defaults all actions to a mock user account (`user1` / Demo Client).
* **Authorization (RBAC) Bypassed:** Role-Based Access Control and multi-tenant database filtering are currently disabled. The UI allows the user to view and interact with all seeded mock records in the database, regardless of ownership, to fully demonstrate the CRUD capabilities and UI responsiveness.

**Future Plans:** In the next iteration of this project, I plan to migrate the authentication layer from a local Keycloak instance to a cloud-based Identity Provider (such as Auth0 or Clerk). This will restore the full multi-tenant security and protected routing without requiring a complex local setup.

---

## Image Source

https://www.pexels.com/photo/decorative-illustration-of-money-box-and-arrows-5849585/
