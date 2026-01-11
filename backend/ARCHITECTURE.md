# Backend Architecture

## Folder Structure

```
backend/
├── config/           # Configuration files (DB, cache, stripe)
├── constants/        # Application constants & enums
├── controllers/      # Request handlers (thin layer)
├── middlewares/      # Express middlewares (auth, rate-limit, security)
├── models/           # Mongoose schemas & models
├── routes/           # API route definitions
├── services/         # Business logic layer
├── utils/            # Helper functions & utilities
├── validators/       # Input validation schemas
├── index.js          # App entry point
├── cluster.js        # Cluster mode for multi-core
└── socket.js         # Socket.IO handlers
```

## Layer Responsibilities

### Controllers (`/controllers`)
- Handle HTTP requests/responses
- Input validation (using validators)
- Call appropriate services
- Return formatted responses
- **Should NOT contain business logic**

### Services (`/services`)
- Core business logic
- Database operations
- External API calls
- Reusable across controllers
- **Single responsibility per service**

### Validators (`/validators`)
- Input validation schemas
- Request body validation
- Query parameter validation
- **Pure functions, no side effects**

### Constants (`/constants`)
- HTTP status codes
- User roles
- Order statuses
- Error/Success messages
- **Immutable values only**

### Middlewares (`/middlewares`)
- Authentication (isAuth)
- Rate limiting
- Security headers
- Request compression
- File uploads (multer)

### Models (`/models`)
- Mongoose schemas
- Model methods
- Virtual fields
- Indexes

### Utils (`/utils`)
- Token generation
- Email sending
- Cloudinary uploads
- Error handling
- Input sanitization

## API Flow

```
Request → Route → Middleware → Controller → Validator → Service → Model → Response
```

## Best Practices

1. **Keep controllers thin** - Move logic to services
2. **Validate early** - Use validators before processing
3. **Use constants** - No magic strings/numbers
4. **Handle errors** - Use try-catch with proper messages
5. **Log appropriately** - Use console.error for errors only
