# Hub Management System

This project is a web-based **Hub Management System** designed to streamline the management of vehicles, tasks, team members, and reporting processes efficiently.

---

## **Features**
- **Vehicle States Management**: Monitor and update vehicle states such as **RTD (Ready to Deploy)**, **Service**, **Missing**, and **Deployed**.
- **Vehicle Entry Recording**: Record entries for vehicles transitioning to **RTD** and **Service** states.
- **Task Allocation**: Enable manual creation and assignment of tasks to hub team members.
- **Hub Team Profile Management**: Manage team member roles and permissions based on job functions.
- **Reporting**: Generate detailed reports for:
  - **Service TAT**: Track service turnaround times.
  - **Hub TAT**: Analyze hub performance metrics.

---

## **Getting Started**

### **Prerequisites**
- **Node.js** (v16+)
- **MongoDB**
- **Postman** (for API testing)

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/Jash2606/Hub-Management-System.git
   cd Hub-Management-System
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy the provided `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Configure the variables in the `.env` file:
     ```env
     PORT=5000
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=your_jwt_expire_time
     ```

4. Start the server:
   ```bash
   npm start
   ```

---

## **API Endpoints**

Detailed API documentation is available via Postman. Use the following link to access the collection:
- **Postman API Documentation**: https://documenter.getpostman.com/view/33555544/2sAYBYfAGp

---

## **Technologies Used**
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

---

## **Future Enhancements**
- Implement **advanced reporting features** for detailed analytics.
- Add **real-time notifications** for task updates and status changes.
- Integrate a **frontend dashboard** for an intuitive user experience.

---
