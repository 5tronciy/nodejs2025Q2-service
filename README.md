# Home Library Service

A NestJS-based REST API for managing a home library with PostgreSQL database, fully containerized with Docker.

## Getting Started

### Environment Setup

Copy file `.env.example` to a new `.env` file in the root directory.

## Running with Docker (Recommended)

### First Time Setup

```bash
# Build the Docker image
npm run docker:build

# Start all services
npm run docker:run

# Wait for services to be healthy, then run initial migrations
npm run migration:run
```

### Production Mode

```bash
# Build and start all services
npm run docker:run
```

### Development Mode (with hot reload)

```bash
# Start with development profile for hot reload
npm run docker:dev
```

### Docker Management Commands

```bash
# Build Docker image
npm run docker:build

# View logs
npm run docker:logs

# Stop all services
npm run docker:stop

# Clean up (stop and remove volumes)
npm run docker:clean

# Security scan
npm run docker:scan
```

## Local Development (without Docker)

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Ensure PostgreSQL is running locally and create a database with the credentials specified in your `.env` file.

### 3. Run Database Migrations

```bash
npm run migration:run
```

### 4. Start the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## Database Operations

### Migration

```bash
# Run migrations in Docker container
npm run migration:run

# Generate new migration
npm run migration:generate -- src/migrations/YourMigrationName

# Revert last migration
npm run migration:revert
```

## Testing

### Running Tests

```bash
# Run all tests without authorization
npm run test

# Run specific test suite
npm run test -- <path to suite>

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

## Architecture

This application uses:

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Relational database
- **Docker** - Containerization

## Docker Services

- **app**: Main NestJS application (Port: 4000)
- **postgres**: PostgreSQL database (Port: 5432)
- **app-dev**: Development version with hot reload (Profile: dev)

## Volumes

- `postgres_data`: PostgreSQL data persistence
- `postgres_logs`: PostgreSQL logs
- `app_logs`: Application logs

## Networks

- `home_library_network`: Custom bridge network for service communication

## Health Checks

Both services include health checks:
- **Database**: `pg_isready` command
- **Application**: HTTP request to localhost:4000

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 4000 and 5432 are available
2. **Permission issues**: Check Docker permissions on your system
3. **Database connection**: Verify environment variables are correct

### Reset Everything

```bash
# Complete cleanup and restart
npm run docker:clean
npm run docker:run

# Don't forget to run migrations after reset
npm run migration:run
```

## License

This project is licensed under UNLICENSED.

## Author

Roman Golchuk <golchukroman@gmail.com>  
Website: https://www.roman-golchuk.site/