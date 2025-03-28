# FZScripts

FZScripts is a script sharing platform where users can publish and browse scripts with account functionality and verified status.

## Features

- **User Authentication**: Register, login, and manage your profile
- **User Profiles**: Customize your profile with a profile picture
- **Verified Status**: Trusted scripters can receive a verified badge
- **Script Publishing**: Share your scripts with the community
- **Script Browsing**: Discover scripts from other users
- **Categories**: Browse scripts by categories (Combat, Simulator, Admin, etc.)

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with sessions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/fzscripts.git
cd fzscripts
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgres://username:password@localhost:5432/fzscripts
SESSION_SECRET=your_session_secret
```

4. Initialize the database
```
npm run db:push
```

5. Start the development server
```
npm run dev
```

6. Open your browser and navigate to `http://localhost:5000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.