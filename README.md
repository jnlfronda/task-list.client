# Task List Application

A full-stack personal task tracker where each user can register, log in, and manage their own tasks (create, edit, delete). Built with:

- **Frontend:** Angular 21 (standalone components, zoneless, signals)
- **Backend:** ASP.NET Core 8 Web API with Entity Framework Core
- **Database:** SQL Server (Express / LocalDB)
- **Auth:** JWT bearer tokens, BCrypt-hashed passwords

The two projects live in sibling folders:

```
task-list.client/   # Angular SPA        <-- this repo
task-list.server/   # ASP.NET Core Web API
```

---

## 1. About this repository

This is the **Angular 21 single-page application** for the Task List system. It:

- Handles registration, login, and logout, storing the JWT returned by the backend.
- Sends `Authorization: Bearer <token>` on every API call via an HTTP interceptor.
- Renders the authenticated user's tasks in a table with inline edit and delete.
- Auto-logs the user out on any `401 Unauthorized` from the backend.

The backend that serves the API lives in `../task-list.server/`.

---

## 2. Setup, build, and run

### Prerequisites

- **Node.js ≥ 20** and **npm ≥ 10**
- The **backend API** must be running on `http://localhost:4201`. See [`../task-list.server/README.md`](https://github.com/jnlfronda/task-list.server/blob/main/README.md) for its setup.

### Steps

1. Install dependencies:
   ```powershell
   npm install
   ```

2. Run the dev server (proxies `/api/*` to the backend via [src/proxy.conf.json](src/proxy.conf.json)):
   ```powershell
   npm start
   ```
   Open **http://localhost:4200/**.

3. Build for production:
   ```powershell
   npm run build
   ```

### Project layout

```
src/app/
  app.config.ts        # HTTP client + interceptor + router providers
  app.routes.ts        # /login, /register, /home (guarded)
  services/            # AuthService, TaskService (both signal-based)
  interceptors/        # JWT bearer interceptor
  guards/              # authGuard, guestGuard
  features/
    login/             # login screen
    register/          # registration screen (with password confirmation)
    home/              # authenticated shell (form + table)
    task-form/         # create/edit form
    task-list/         # container that reads the shared signal
    task-table/        # renders tasks with edit/delete actions
  models/              # Task, Priority, Status, AuthResponse, Credentials
```

---

## 3. Authentication mechanism

**Chosen mechanism: traditional username + password with JWT bearer tokens.**

- On register/login, the server returns a JWT which the client stores in `localStorage` (`auth.token`) alongside the username (`auth.username`). Both are exposed as Angular signals in `AuthService`, so the UI (header, guards) updates reactively.
- The [auth interceptor](src/app/interceptors/auth-interceptor.ts) attaches `Authorization: Bearer <token>` to every outgoing HTTP request when a token is present.
- Any `401 Unauthorized` response triggers `AuthService.logout()`, which clears storage/state and redirects to `/login`.
- Two route guards keep navigation honest:
  - `authGuard` — blocks anonymous users from `/home`.
  - `guestGuard` — bounces already-signed-in users away from `/login` and `/register`.

**Why this over SSO:**
- Self-contained and simple to run locally with no external identity provider needed.
- One interceptor and one guard cover the entire client-side auth story.

**Note:** SSO is not implemented in this build. Only local accounts are supported.

---

## 4. Database schema (backend recap)

Persistence lives in the backend; the client only sees JSON. For completeness:

### `Users`

| Column         | Type              | Notes                                                   |
| -------------- | ----------------- | ------------------------------------------------------- |
| `id`           | int (PK)          |                                                         |
| `Username`     | nvarchar(100)     | Unique                                                  |
| `PasswordHash` | nvarchar(max)     | **Nullable** — BCrypt for local users                   |

### `Tasks`

| Column        | Type          | Notes                                    |
| ------------- | ------------- | ---------------------------------------- |
| `id`          | int (PK)      |                                          |
| `Title`       | nvarchar(100) | Required                                 |
| `Description` | nvarchar(max) | Optional                                 |
| `due_date`    | datetime2     | **Nullable**                             |
| `Priority`    | nvarchar(max) | `Low` / `Medium` / `High`                |
| `Category`    | nvarchar(max) | Nullable                                 |
| `Status`      | nvarchar(max) | `Pending` / `In Progress` / `Completed`  |
| `user_id`     | int (FK)      | Scopes every task to its owner           |

Full schema details, including indexes and migrations, are in [`../task-list.server/README.md`](../task-list.server/README.md#4-database-schema).

---

## 5. Accessing the application

There are **no default credentials** — the database ships empty.

1. Start the backend (see [`../task-list.server/README.md`](../task-list.server/README.md)) and this client (`npm start`).
2. Open **http://localhost:4200/**. Anonymous visits redirect to `/login`.
3. Click **Register**.
4. Enter:
   - **Username** (≥3 characters)
   - **Password** (≥6 characters)
   - **Confirm Password** (must match)
5. On success you are automatically signed in and taken to `/home`.
6. Add a task — only **Title** is required. Description, Due Date, and Category are optional; Priority defaults to `Medium` and Status defaults to `Pending`.
7. Use the **Edit** / **Delete** buttons in the task table to modify tasks, and the **Logout** button in the header to end the session.

To sign in with an existing account, use the **Login** link on the register screen (or navigate to `/login`).

---
