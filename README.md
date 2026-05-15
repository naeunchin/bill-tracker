# Bill Tracker Application 

- Developer Name: Na Eun Chin 
- Last Updated: May 2026 

---

## Technologies

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

## Project Overview  

This project implements a full-stack system for managing Bill records. It replicates the logic and design of Assignment 6 (REST API + REST Client). The backend is a REST API built with Spring Boot and Spring Data JPA, providing endpoints to create, update, and delete bills from an H2 database. The frontend is an application built with React (scaffolded with Vite), which uses the Spring Boot API to provide an interactive user interface for managing data.  
