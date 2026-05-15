# Bill Tracker Application 

## Developer Information
- Name: Na Eun Chin 
Last updated: May 2026 

---

## Selected Technologies

### Backend Framework
- Framework: Spring Boot (Java)  
- Version: 4.0.5  

**Why I chose this framework:** I selected Spring Boot because it is an industry-standard, enterprise-grade framework that allows for rapid development of REST APIs. I noticed that Spring Boot was a very popular and common framework used by Java developers. By utilizing Spring Data JPA, the framework automatically handles the underlying SQL queries and database table creation, which speeds up development time. Additionally, it works well with in-memory databases like H2.  In order to set up this project, I used the Spring Boot Initializer (https://start.spring.io/).  

Sources:  
1. https://spring.io/projects/spring-boot
2. https://azure.microsoft.com/en-ca/resources/cloud-computing-dictionary/what-is-java-spring-boot
3. https://www.geeksforgeeks.org/springboot/spring-boot-with-h2-database/

### Frontend / Client
- Framework: React  
- Version: 19.2.4

**Why I chose this framework:** React is the leading modern framework for building dynamic Single Page Applications (SPAs). I chose it because I was already exposed to it in front-end app development projects in other courses, and found it easy to fetch, render, and manipulate data from a REST API. React has a massive ecosystem, allowing me to use libraries like `react-bootstrap` to quickly replicate the complex UI features and modals from Assignment 6's PrimeFaces implementation. I am using Vite to build my React app because it is easier to build and maintain single-page React apps than older tools like Create React App (CRA). Vite also provides me with a fast server.  

Sources:  
1. https://developer.okta.com/blog/2022/06/17/simple-crud-react-and-spring-boot
2. https://medium.com/@bhargavkanjarla01/how-to-combine-a-java-spring-boot-back-end-with-a-reactjs-front-end-app-ed8d8ca65285
---

# Part 1 – Open REST API + Client
## Project Overview  

This project implements a full-stack system for managing Bill records. It replicates the logic and design of Assignment 6 (REST API + REST Client). The backend is a REST API built with Spring Boot and Spring Data JPA, providing endpoints to create, update, and delete bills from an H2 database. The frontend is an application built with React (scaffolded with Vite), which uses the Spring Boot API to provide an interactive user interface for managing data.  

## Backend Setup (Part 1)

1. Navigate to backend project (cd backend-api)
2. Install dependencies
3. Run application: run the commands below or navigate to the DemoApplication.java file in the backend-api/src/main/java/com/example/demo/ and click the green play button beside the main() function. 

```bash
./mvnw spring-boot:run
````
Or  
```bash
mvn spring-boot:run
````

API Base URL:

```
http://localhost:8080/bills
```

---

## Frontend Setup (Part 1)

1. Navigate to frontend project (cd frontend-client)
2. Install dependencies (npm install)
3. Run application

```bash
npm run dev
```
4. Open http://localhost:5173/
---

## API Usage Examples (Part 1)

### How to configure the base URL for the API

In the React frontend, the base URL is configured using Vite's environment variables. I followed these steps:
1. Created a `.env` file in the root of the `frontend-client` directory.
2. Defined the variable: `VITE_API_BASE_URL=http://localhost:8080/bills`
3. Accessed it in the React code using: `import.meta.env.VITE_API_BASE_URL`

### GET Request

In the React application, we use the native `fetch` API inside a `useEffect` hook to retrieve the list of bills when the application loads.

**JavaScript (React) Example:**
```javascript
fetch(import.meta.env.VITE_API_BASE_URL)
    .then(response => response.json())
    .then(data => {
        console.log("Data from backend:", data);
        setBills(data); // Save the data to React state
    })
    .catch(error => console.error("Error fetching data:", error));
```

### cURL Example in the terminal: 

```bash
curl -X GET http://localhost:8080/bills -H "Accept: application/json"
```

### POST Request

To create a new bill, we send a POST request containing a JSON stringified version of our form data. We explicitly set the Content-Type header so Spring Boot knows how to parse the incoming JSON payload.

**JavaScript (React) Example:**

```javascript
const newBill = {
    payeeName: "NAIT",
    dueDate: "2026-05-15",
    paymentDue: 85.50,
    paid: false
};

fetch(import.meta.env.VITE_API_BASE_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBill),
})
    .then(response => response.json())
    .then(savedBill => {
        console.log("Successfully saved to database:", savedBill);
    })
    .catch(error => console.error("Error saving bill:", error));
```

### cURL Example in the terminal:

```bash
 curl -X POST http://localhost:8080/bills \
  -H "Content-Type: application/json" \
  -d '{"payeeName": "NAIT", "paymentDue": 85.50, "dueDate": "2026-05-15", "paid": false}'
```

---

# Part 2 – Secured REST API

## Security Overview

This project uses JSON Web Tokens (JWT) and OpenID Connect (OIDC) via Keycloak to secure the application. Keycloak is connected to a Windows Server LDAP directory. When a user logs in, Keycloak validates their credentials against LDAP and issues a JWT. The React frontend stores this token and passes it to the Spring Boot backend, which enforces Role-Based Access Control (RBAC).  

Source: 
1. https://medium.com/@mohamedkamaludeen48/keycloak-js-library-explanation-0101134e936a

---

## Instructions for Instructor testing 
Configuration:  

1. Backend: Ensure spring.security.oauth2.resourceserver.jwt.issuer-uri in secure-backend/src/main/resources/application.properties matches your Keycloak IP/Port.
2. Frontend Keycloak: Update the url in secure-frontend/src/keycloak.js to match your Keycloak IP/Port. 
3. Frontend API: The API URL is hardcoded as http://localhost:8080/bills in Bills.jsx. Ensure the backend is running on port 8080.

Run Steps:  

1. Start the Keycloak and LDAP servers. 
2. Backend: Open a terminal in secure-backend and run ./mvnw spring-boot:run. 
3. Frontend: Open a terminal in secure-frontend, run npm install, then run npm run dev. 
4. Open a browser and navigate to http://localhost:5173/. 

---
## Authentication Steps

### Secure Backend (REST services)

1. Restricting Access by Role (RBAC)

I used the @RolesAllowed annotation on my controller endpoints to restrict access. I configured a JwtAuthenticationConverter in my SecurityConfig.java to map Keycloak's realm_access.roles into Spring Security authorities (e.g., ROLE_ActiveStudent).  

Example: 
```java
@GetMapping
@RolesAllowed({"ActiveStudent", "Accounting"})
public ResponseEntity<List<Bill>> getAllBills(JwtAuthenticationToken auth, @AuthenticationPrincipal Jwt jwt) {
    boolean isAccounting = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_Accounting"));

    if (isAccounting) {
        return ResponseEntity.ok(billRepository.findAll());
    } else {
        String username = jwt.getClaimAsString("preferred_username");
        return ResponseEntity.ok(billRepository.findByUsername(username));
    }
}
```
2. Extracting the user principal name (UPN)

I extract the preferred_username claim directly from the injected Jwt object in the controller methods to enforce multi-tenant ownership.  

Example:
```java
@PostMapping
@RolesAllowed("ActiveStudent")
public ResponseEntity<Bill> createBill(@Valid @RequestBody Bill newBill, @AuthenticationPrincipal Jwt jwt) {
    // Extract the username from the JWT token
    String username = jwt.getClaimAsString("preferred_username");
    newBill.setUsername(username);

    Bill savedBill = billRepository.save(newBill);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedBill);
}
```

3. Authentication and JWT issuing

Username and password authentication is handled entirely by Keycloak, which is federated with an external LDAP directory. Spring Boot does not handle passwords. Instead, Spring Boot verifies the signature of the incoming JWT against the Keycloak Issuer URI defined in application.properties (spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8180/realms/dmit2015-realm).

4. Logout and token revocation

Because the Spring Boot backend is a stateless OAuth2 Resource Server, it does not maintain active sessions. Logout is handled entirely by the React frontend discarding the token and calling the Keycloak logout endpoint to destroy the SSO session.

---
### Secure Frontend (REST client)

1. Obtaining and securing the JWT

I use the keycloak-js library. It initializes on app startup and silently checks for an SSO session or redirects the user to the Keycloak login screen. Once authenticated, the token is stored in the keycloak instance memory.

Example: main.jsx
```javascript
keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256', checkLoginIframe: false })
    .then((authenticated) => {
        createRoot(document.getElementById('root')).render(
            <App />
        )
    });
```

2. Checking authentication and redirecting

I created a RequireAuth wrapper component in App.jsx. If a user tries to access a protected route without a token, they are immediately redirected to Keycloak.

Example:
```javascript
function RequireAuth({ children }) {
    useEffect(() => {
        if (!keycloak.authenticated) {
            keycloak.login(); // Redirects to Keycloak login page
        }
    }, []);

    if (!keycloak.authenticated) {
        return <div><h3>Redirecting to Secure Login...</h3></div>;
    }
    return children;
}
```

3. Retrieving the token and calling secured endpoints (GET/POST)

The token is retrieved dynamically via keycloak.token and added to the Authorization: Bearer header. Before saving, keycloak.updateToken() is called to ensure the token hasn't expired.

Example: GET
```javascript
fetch('http://localhost:8080/restapi/bills', {
    headers: {
        'Authorization': `Bearer ${keycloak.token}`
    }
})
```

Example: POST
```javascript
keycloak.updateToken(30).then(() => {
    fetch('http://localhost:8080/restapi/bills', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${keycloak.token}`
        },
        body: JSON.stringify(formData),
    })
});
```

4. Logout implementation  

Logout is triggered by calling Keycloak's logout method, which destroys the token and redirects the user back to the public home page.

Example:
```javascript
const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
};
```