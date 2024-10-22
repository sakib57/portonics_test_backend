
# Portonics Test Backend

This is the backend part, developed with express js. MySQL database connection with Prisma ORM has been implemented. 

## Table of Contents
- [Installation](#installation)
- [Running Migrations](#running-migrations)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Documentation](#documentation)
- [Scripts](#scripts)



## Installation

Clone the repository and install the required dependencies:

```bash
npm install
```



## Running Migrations

1. **Generate a Migration**: Generate a migration using Prisma:

   ```bash
   npx prisma migrate dev --name init
   ```

   This creates a new migration file inside `prisma/migrations` and updates your database schema.

2. **Prisma Studio** (Optional): To view and interact with your database, you can run Prisma Studio:

   ```bash
   npx prisma studio
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be running on `http://localhost:3000`.

## Environment Variables
  
Copy `.env.example` to `.env` file at the root of your project and set appropriate values.

## documentation

A convenient API Documentation is provided with swagger
at `http://localhost:3000/api-docs`

## Scripts

The following scripts are available:

- **`npm run dev`**: Starts the app in development mode with `nodemon`.
- **`npx prisma migrate dev`**: Runs migrations and applies them to the database.
- **`npx prisma studio`**: Opens Prisma Studio to interact with the database.

---

