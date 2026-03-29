# Frontend Architecture

## 📁 Folder Structure

```
frontend/src/
├── components/       # Reusable UI components
│   └── common/       # Shared components
│       ├── Button.jsx
│       ├── Button.css
│       └── PrivateRoute.jsx
├── features/         # Feature-based modules
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Login.css
│   └── dashboard/
│       ├── Dashboard.jsx
│       ├── Dashboard.css
│       ├── VideoList.jsx
│       ├── VideoList.css
│       ├── VideoUpload.jsx
│       ├── VideoUpload.css
│       ├── VideoPlayer.jsx
│       └── VideoPlayer.css
├── hooks/            # Custom React hooks
│   └── useSocket.js
├── services/         # API communication
│   ├── api.js        # Axios instance
│   ├── authService.js
│   └── videoService.js
├── store/            # Redux Toolkit
│   ├── index.js      # Store configuration
│   └── slices/
│       ├── authSlice.js
│       └── videoSlice.js
├── styles/           # Global styles
│   └── theme.css     # CSS variables
├── utils/            # Helper functions
│   └── formatters.js
├── constants/        # App constants
│   └── index.js
├── App.jsx           # Root component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## 🏗️ Architecture Patterns

### 1. Feature-Based Structure

- Group related components by feature
- Colocate styles with components
- Easy to scale and maintain

### 2. Redux Toolkit

- Centralized state management
- Async thunks for API calls
- Immutable state updates

### 3. Service Layer

- API calls abstracted
- Axios interceptors for auth
- Reusable across components

### 4. Custom Hooks

- Socket.io integration
- Reusable logic extraction
- Clean component code

### 5. Constants

- All magic strings centralized
- Type-safe references
- Easy configuration

## 🎨 Design System

### Black & White Theme

- Primary: #000000
- Secondary: #FFFFFF
- Backgrounds: #FFFFFF, #F5F5F5, #E8E8E8
- Text: #000000, #666666, #999999
- Borders: #E0E0E0, #CCCCCC

### Component Principles

- Minimal and clean
- Consistent spacing
- Smooth transitions
- Responsive design
