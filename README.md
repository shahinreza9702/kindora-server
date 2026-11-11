# Kindora — Backend API

Kindora is a community-driven social development platform that allows people to create, discover, and participate in local social service events.

This repository contains the backend API responsible for authentication, event management, participant management, and database operations.

## ✨ Features

- **Authentication:** User authentication powered by Better Auth.
- **Social Login:** Google and GitHub authentication support.
- **JWT Verification:** Secure API access using JSON Web Tokens.
- **Event Management:** Create, retrieve, update, and delete community events.
- **Ownership Protection:** Only authorized event creators can update or delete their own events.
- **Event Participation:** Join and leave events with participant information stored in MongoDB.
- **Duplicate Join Prevention:** Prevents users from joining the same event more than once.
- **Input Validation:** Validate incoming data before processing requests.
- **Security:** Security headers and environment variable validation.
- **MongoDB Integration:** Persistent storage using MongoDB.

## 🛠️ Technology Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Better Auth
- JWT
- jose
- Helmet
- Zod

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- MongoDB Atlas account or a MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/shahinreza9702/kindora-server.git
```

### 2. Navigate to the project directory

```bash
cd kindora-server
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000

CLIENT_URL=http://localhost:3001
BETTER_AUTH_URL=http://localhost:3001

MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=your_database_name

BETTER_AUTH_SECRET=your_unique_secret_at_least_32_characters

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

**Important:**
- Replace all placeholder values with your own configuration.
- `CLIENT_URL` and `BETTER_AUTH_URL` should match your frontend's local origin.
- If your frontend runs on a different port, update both URLs accordingly.
- Configure the Google and GitHub OAuth applications with the appropriate callback URLs.
- Never commit your `.env` file or expose authentication secrets.

### 5. Start the development server

```bash
npm run dev
```

The backend will run on the configured port, which defaults to `5000`.

### 6. Build for production

```bash
npm run build
```

### 7. Start the production server

```bash
npm run start
```

## 🔐 Authentication & Security

Kindora uses Better Auth for email/password and social authentication.

Protected API requests are verified using JWTs. The backend uses public keys from the Better Auth JWKS endpoint to verify tokens.

Additional security measures include:

- Environment variable validation
- Security headers
- Protected API endpoints
- Event ownership verification
- Participant duplication prevention

## 🌍 Deployment

The backend is deployed on Render.

**Backend URL:** https://kindora-server-0wij.onrender.com

## 🔗 Related Repository

**Frontend:** [kindora-client](https://github.com/shahinreza9702/kindora-client)

**Live Website:** https://kindora-client-one.vercel.app

## 👨‍💻 Developer

**Shahin Reza**

- GitHub: [@shahinreza9702](https://github.com/shahinreza9702)
- Portfolio: [shahinreza.vercel.app](https://shahinreza.vercel.app)

---

Built to bring communities together through meaningful social initiatives. ❤️