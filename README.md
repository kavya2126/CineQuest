# CineQuist – Movie Discovery and Streaming Platform

## About the Project

CineQuist is a full-stack movie discovery and streaming platform developed using the MERN stack. It allows users to explore movies, search and filter movies by genre and language, view movie details, watch trailers, and manage their personal watchlists and watch history.

The platform also includes an admin panel that allows administrators to add, update, and delete movie information.

## Technologies Used

**Frontend**
- React.js
- HTML
- CSS
- JavaScript
- Vite

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Authentication**
- JSON Web Token (JWT)

## Main Features

- User registration and login
- Secure user authentication
- Movie browsing and discovery
- Search movies by title
- Filter movies by genre and language
- View detailed movie information
- Watch movie trailers
- Play available movie videos
- Add and remove movies from My List
- Maintain watch history
- Admin dashboard
- Admin CRUD operations for movies

## Project Structure

```text
CineQuist/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kavya2126/CineQuist.git
cd CineQuist
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/CineQuist
JWT_SECRET=your_own_random_secret
```

Use your own secure JWT secret. Never upload the actual `.env` file.

### 4. Start the Backend

```bash
npm run dev
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Open the local frontend URL displayed in your terminal, usually:

`http://localhost:5173`

## Database

CineQuist uses MongoDB to store user information, movie details, watchlists, and watch history.

## Future Enhancements

- User profile management
- Improved responsive design
- Enhanced video player experience
- Advanced movie recommendations
- Additional search and filtering options

## GitHub Repository

https://github.com/kavya2126/CineQuist

## Developed By

CineQuist Project Team