{   
     "user_name": "Manav_Patel",
     "email": "manav@gmail.com",
     "password": "1234567890",
     "role": "Admin"
}   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NzAxOTA4MTksImV4cCI6MTc3MDYyMjgxOX0.kU6SX7AFsTeMHqxe7ikvrNvpuiXkr--9CcaIVKzK6A8


need to change sqldbconnect.ts file to this // server.ts or app.ts
import express from 'express';
import { connectDatabase } from './sqlconnect';
import db from './sqlconnect';

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to database and initialize models
    await connectDatabase();
    
    // Get the initialized database with all models
    const database = await db;
    
    // Example route using models
    app.get('/users', async (req, res) => {
      try {
        const users = await database.User.findAll();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
      }
    });
    
    app.get('/posts', async (req, res) => {
      try {
        const posts = await database.Post.findAll({
          include: [database.User, database.Comment]
        });
        res.json(posts);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
      }
    });
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

---

## File Structure:
```
project/
├── models/
│   ├── index.ts           // Dynamic model loader
│   ├── user-model.ts      // User model
│   ├── post-model.ts      // Post model
│   └── comment-model.ts   // Comment model
├── config.json            // Database configuration
├── sqlconnect.ts          // Database connection (simplified)
├── server.ts              // Main app file
└── .env                   // Environment variables