# Dashboard Client

This is the frontend dashboard for the Monsta-New Client application, built with React, Vite, and Tailwind CSS.

## Features
- **Modern UI**: Built with Tailwind CSS for responsive and modern design.
- **Component-Based**: Modular structure with reusable components.
- **Routing**: React Router v7 for navigation.
- **State Management**: React Context API for global state.
- **Icons**: Lucide React and React Icons.
- **HTTP Client**: Axios for API integration.
- **Consistent API Pattern**: Standardized handling of `ApiResponse` objects (success checking, error parsing).

## 🧩 API Integration Pattern
The dashboard follows a strict pattern for handling API responses:
```javascript
// Example Pattern
axios.post(url, data)
  .then(res => res.data) // Extract body
  .then(apiResponse => {
     if (apiResponse.success) {
        // Handle Success
     } else {
        // Handle Logic Failure (e.g. valid HTTP 200 but failed operation)
     }
  })
```

## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

## Installation

1. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Configuration:
   Create a `.env` file in the **root** of the `dashboard` directory (same level as `package.json`).
   
   *Note: Vite loads environment variables from the project root by default. Moving `.env` from `src/` to `dashboard/` is recommended if it's currently inside `src/`.*
   
   **Required Variables:**
   ```env
   VITE_APIBASE=http://localhost:8006/admin
   ```

## Running the App

- **Development Server**:
  ```bash
  npm run dev
  ```
  Runs on `http://localhost:5173` by default.

- **Build for Production**:
  ```bash
  npm run build
  ```

- **Preview Production Build**:
  ```bash
  npm run preview
  ```

## Project Structure

```
src/
├── common/         # Layouts and shared UI wrappers
├── components/     # Feature-specific components
│   ├── Dashboard/
│   ├── Faqs/
│   ├── UserManagement/
│   └── ...
├── context/        # Global context providers
├── App.jsx         # internal setup (if applicable)
└── main.jsx        # Application entry point and routing config
```

## Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **HTTP**: Axios
