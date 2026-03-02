# Automated Banking System

This repository contains a simple microservices-based banking application built with:

- Java Spring Boot (customer, transaction, security, support services)
- MySQL for persistence
- Maven for build
- React.js frontend

## Setup

1. **Prerequisites**
   - Java JDK 17+ installed and `java` on your PATH.
   - Apache Maven (e.g. 3.9.12) installed and `mvn` on your PATH (used by the backend tasks).
     *If `mvn` is not found, the `start-all.ps1` script will attempt to add a default Maven bin folder (e.g. `C:\Program Files\Apache\maven\bin`) for the current session.*
   - Node.js and npm for the frontend. Ensure the Node installation directory (e.g. `C:\Program Files\nodejs`) is in your Windows `PATH`.
     You can add it permanently via System Settings or temporarily with one of the helper scripts:
     ```powershell
     cd "E:\Java FSD Project\Banking Project"
     .\add-node-path.ps1    # adds Node.js (and will attempt to add Maven too) for current shell session
     .\add-maven-path.ps1   # adds just the Maven `bin` folder if you only need the backend tools
     ```
     *The `start-all.ps1` script also automatically tries to add the default Node.js and Maven paths if the commands aren't already available.*
   - MySQL server installed; make sure the `mysql` command‑line tool is on your PATH so the `start-all.ps1` script can create databases automatically. If it's not available, manually create the `banking_customer` and `banking_transaction` databases before running the services.

   2. **Databases**
   Create two MySQL databases:
   ```sql
   CREATE DATABASE banking_customer;
   CREATE DATABASE banking_transaction;
   ```
   Update credentials in each service's `src/main/resources/application.properties`.

2. **Build and run services**
   When invoking Maven from PowerShell you must quote any path that contains spaces, otherwise
   `cd` will treat the segments as separate parameters ("FSD" in our case!) and the command will
   fail before Maven ever runs.

   The simplest way is to `cd` into a service directory, make sure the prompt shows the correct
   path, and then call the Maven plugin:
   ```powershell
   cd "e:\Java FSD Project\Banking Project\customer-service"
   mvn spring-boot:run
   # open a new terminal for each service
   cd "..\transaction-service"; mvn spring-boot:run
   cd "..\security-service"; mvn spring-boot:run
   cd "..\support-service"; mvn spring-boot:run
   ```

   If you prefer to run from the workspace root you can supply the pom file explicitly, which
   also avoids quoting problems:
   ```powershell
   mvn -f "customer-service\pom.xml" spring-boot:run
   ```

   A helper script is provided to make this even easier; from the project root simply run
   `.
   run-service.ps1 customer-service` (or any of `transaction-service`, `security-service`,
   `support-service`). The script handles quoting and uses `Push-Location`/`Pop-Location` for you.

   Alternatively you can trigger the predefined VS Code tasks (`Run Task` → choose service or
   frontend).
   Services listen on ports 8081, 8082, 8083, 8084 respectively.

   - `customer-service` provides `/api/customers` CRUD. Customers have a `balance` field.
   - `transaction-service` handles `/api/transactions`; posting a transaction automatically updates the corresponding customer's balance.
   - Example deposit request:
     ```json
     {
       "accountId": 1,
       "type": "DEPOSIT",
       "amount": 100.50
     }
     ```
     Withdrawal will fail if funds are insufficient.

## Manual testing

1. **Create a customer**
   ```bash
   curl -X POST http://localhost:8081/api/customers -H "Content-Type: application/json" \
        -d '{"name":"Alice","email":"alice@example.com"}'
   ```
   Response includes `id` and `balance=0`.

2. **Deposit funds**
   ```bash
   curl -X POST http://localhost:8082/api/transactions \
        -H "Content-Type: application/json" \
        -d '{"type":"DEPOSIT","toAccountId":1,"amount":250}'
   ```

3. **Withdraw funds**
   ```bash
   curl -X POST http://localhost:8082/api/transactions \
        -H "Content-Type: application/json" \
        -d '{"type":"WITHDRAWAL","fromAccountId":1,"amount":100}'
   ```

4. **Transfer between accounts** (assumes customer 1 and 2 exist)
   ```bash
   curl -X POST http://localhost:8082/api/transactions \
        -H "Content-Type: application/json" \
        -d '{"type":"TRANSFER","fromAccountId":1,"toAccountId":2,"amount":50}'
   ```

5. **View account history**
   ```bash
   curl http://localhost:8082/api/transactions/account/1
   ```

6. **Frontend UI**
   * Open http://localhost:3000/ and click **Login** (any username/password works).
   * Once logged in you can navigate to **Customers**, **Transactions**, **History**, and **Support**.
   * The **Support** page contains a dummy chat widget.

7. **Automatic database creation**
   When the services start they will auto-create required tables. The databases themselves
   must exist; run the accompanying `start-all.ps1` script which creates them if not present.

8. **Start‑all script**
   A convenience PowerShell script `start-all.ps1` is included at the project root. It will
   create the two databases (using MySQL CLI) and open separate terminals for each service and
   the frontend. To run it:
   ```powershell
   cd "e:\Java FSD Project\Banking Project"
   .\start-all.ps1
   ```
   Adjust the MySQL credentials inside the script before running.

9. **Run frontend manually** (if you prefer not to use the script)
   ```powershell
   cd "e:\Java FSD Project\Banking Project\frontend"
   npm install
   npm start
   ```
   The React app will open at http://localhost:3000 and communicate with the backend APIs.

## Development

- Add entities, repositories and controllers as needed under each service.
- Use Spring Data JPA for database operations and Hibernate for ORM.
- Ensure CORS is enabled or configure an API gateway.

## Notes

Once `start-all.ps1` has been executed and all services are running, open the browser at **http://localhost:3000** to begin using the application. The backend APIs will be available on ports 8081‑8084 and the React frontend proxies requests to them.

This repository provides a complete, runnable demo of the automated banking system described in the requirements. You can further extend or harden it, but no additional setup is required to have it up and running locally.

This is a minimal skeleton to get started. Expand services and UI pages according to requirements.
