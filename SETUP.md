# Google Photos Picker API - Setup Guide

This guide will help you set up the Google Photos Picker API integration for this Next.js application.

## Prerequisites

- Node.js 18+ and pnpm installed
- A Google Cloud Platform account
- Basic understanding of OAuth 2.0

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name and click "Create"

### 1.2 Enable Google Photos Picker API

1. In your project, navigate to "APIs & Services" → "Library"
2. Search for "Google Photos Picker API"
3. Click on it and press "Enable"

### 1.3 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
   - Add the following scope: `https://www.googleapis.com/auth/photospicker.mediaitems.readonly`
   - Add test users if needed

4. Back at "Create OAuth client ID":
   - Application type: Web application
   - Name: Your app name
   - Authorized redirect URIs:
     - For local dev: `http://localhost:3000/api/auth/callback`
     - For production: `https://yourdomain.com/api/auth/callback`
   - Click "Create"

5. Copy the Client ID and Client Secret

## Step 2: Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your values:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
   SESSION_PASSWORD=generate-a-random-32-character-password
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Generate a secure session password (must be at least 32 characters):
   ```bash
   openssl rand -base64 32
   ```

## Step 3: Install Dependencies

```bash
pnpm install
```

## Step 4: Run the Application

### Development Mode

```bash
pnpm dev
```

Visit `http://localhost:3000`

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:ui

# Run with coverage
pnpm test:coverage
```

### Build for Production

```bash
pnpm build
pnpm start
```

## Step 5: Test the Integration

1. Open `http://localhost:3000` in your browser
2. Click "Sign in with Google"
3. Authorize the application to access your Google Photos
4. You'll be redirected back to the app
5. Click "Go to Photos"
6. Click "Create Picker Session"
7. Click "Open Google Photos Picker" to select photos

## API Endpoints

### Authentication

- `GET /api/auth/google` - Initiates OAuth flow
- `GET /api/auth/callback` - OAuth callback handler

### Photos Picker

- `POST /api/photos/sessions` - Create a new picker session
- `GET /api/photos/sessions/[id]` - Get session status
- `GET /api/photos/sessions/[id]/media` - List selected media items

## Architecture

### OAuth 2.0 Flow

1. User clicks "Sign in with Google"
2. App redirects to Google OAuth consent page
3. User grants permissions
4. Google redirects back with authorization code
5. App exchanges code for access and refresh tokens
6. Tokens stored in encrypted session cookie

### Photos Picker Flow

1. Create a picker session (POST /api/photos/sessions)
2. Get pickerUri from session response
3. User opens pickerUri to select photos
4. Poll session status to check when mediaItemsSet is true
5. Retrieve selected media items (GET /api/photos/sessions/[id]/media)

## Security Considerations

- Session cookies are encrypted using iron-session
- OAuth state parameter prevents CSRF attacks
- Tokens are stored server-side only
- HTTPS required in production
- Environment variables must never be committed

## Troubleshooting

### "Missing required Google OAuth environment variables"

Ensure all environment variables in `.env.local` are set correctly.

### "Invalid state parameter"

This indicates a potential CSRF attack or expired session. Clear cookies and try again.

### "Failed to create picker session"

Check that:
- You're authenticated (signed in with Google)
- Google Photos Picker API is enabled in Google Cloud Console
- OAuth tokens are valid and not expired

## Documentation References

- [Google Photos Picker API](https://developers.google.com/photos/picker/guides/get-started-picker)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Next.js Documentation](https://nextjs.org/docs)
- [iron-session](https://github.com/vvo/iron-session)
