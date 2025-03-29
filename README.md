# E-Commerce Admin Dashboard

A modern, responsive admin dashboard for e-commerce management built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication & Authorization**
  - Secure login with JWT
  - Role-based access control (Admin, Admin Applicant)
  - Remember me functionality

- 👥 **User Management**
  - Admin user CRUD operations
  - Profile management
  - Role-based permissions
  - Admin application system

- 📦 **Product Management**
  - Product CRUD operations
  - Image upload and management
  - Category organization
  - Stock tracking

- 📊 **Order Management**
  - Order tracking and updates
  - Order details view
  - Order status management
  - Customer information

- 🎨 **Modern UI/UX**
  - Responsive design
  - Mobile-friendly navigation
  - Interactive data tables

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios for API calls
- React Context for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Admin-Dashboard-ECommerce.git
cd Admin-Dashboard-ECommerce
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:

Frontend (.env.local), setup at /frontend:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Backend (.env), setup at project root:
```bash
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/
DB_HOST=localhost
DB_NAME=ecommerce_admin_dashboard

# Server configuration
PORT=5000

# JWT Configuration
JWT_SECRET=my-secret-key
JWT_EXPIRES_IN=24h
```

4. Start the development servers:

```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.