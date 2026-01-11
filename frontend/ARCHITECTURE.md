# Frontend Architecture

## Folder Structure

```
frontend/src/
├── assets/           # Static assets (images, fonts)
├── components/       # Reusable UI components
├── constants/        # Application constants & config
├── hooks/            # Custom React hooks
├── pages/            # Route-based page components
├── redux/            # Redux store, slices & actions
├── utils/            # Helper functions & utilities
├── __tests__/        # Test files
├── App.jsx           # Main app with routing
├── main.jsx          # React entry point
├── index.css         # Global styles (Tailwind)
└── firebase.js       # Firebase configuration
```

## Layer Responsibilities

### Pages (`/pages`)
- Route-level components
- Page layout & structure
- Data fetching via hooks
- **One page per route**

### Components (`/components`)
- Reusable UI elements
- Presentational components
- Accept props, emit events
- **Should be stateless when possible**

### Hooks (`/hooks`)
- Custom React hooks
- Data fetching logic
- Side effects management
- **Reusable across components**

### Redux (`/redux`)
- Global state management
- Slices for each domain
- Async thunks for API calls
- **Single source of truth**

### Constants (`/constants`)
- API endpoints
- User roles & statuses
- UI configuration
- Storage keys
- **Immutable values**

### Utils (`/utils`)
- Helper functions
- Formatters (date, currency)
- Validators
- Storage helpers
- **Pure functions**

## Component Hierarchy

```
App
├── Pages (route-based)
│   ├── Home
│   ├── Shop
│   ├── Cart
│   └── ...
└── Components (reusable)
    ├── Nav
    ├── Footer
    ├── FoodCard
    └── ...
```

## State Management

```
Redux Store
├── userSlice      # User data, cart, orders
├── ownerSlice     # Shop owner data
└── mapSlice       # Location & address
```

## Data Flow

```
User Action → Component → Redux Action → API Call → Update Store → Re-render
```

## Best Practices

1. **Use constants** - Import from `/constants`
2. **Use utils** - Import helpers from `/utils`
3. **Keep components small** - Single responsibility
4. **Use custom hooks** - Extract reusable logic
5. **Lazy load pages** - Use React.lazy for routes
