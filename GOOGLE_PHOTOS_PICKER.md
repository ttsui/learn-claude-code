# Google Photos Picker API Integration

This project implements a complete Google Photos Picker API integration with OAuth 2.0 authentication. Users can securely select photos from their Google Photos library through Google's official Picker interface.

## Features

- ✅ Server-side OAuth 2.0 authorization flow
- ✅ PKCE (Proof Key for Code Exchange) for enhanced security
- ✅ CSRF protection via state parameter validation
- ✅ Google Photos Picker session management
- ✅ Secure token storage using HTTP-only cookies
- ✅ Automatic session cleanup to prevent resource exhaustion
- ✅ Comprehensive error handling
- ✅ Full test coverage with Vitest

## Prerequisites

1. **Google Cloud Project**: You need a Google Cloud project with the Photos Library API enabled
2. **OAuth 2.0 Credentials**: Create OAuth 2.0 client credentials in the Google Cloud Console

## Setup Instructions

### 1. Enable Google Photos Library API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Library**
4. Search for "Photos Library API"
5. Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Select **Web application** as the application type
4. Configure:
   - **Name**: Your application name (e.g., "My App - Google Photos Picker")
   - **Authorized redirect URIs**: Add `http://localhost:3000/api/auth/callback` (for development)
   - For production, add your production callback URL
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Run the Application

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Architecture

### OAuth 2.0 Flow

1. **User initiates login** → Redirected to `/api/auth/login`
2. **Generate authorization URL** → With PKCE code challenge and state parameter
3. **User authenticates** → On Google's authorization page
4. **User grants permissions** → To access their Google Photos
5. **Callback received** → At `/api/auth/callback`
6. **Exchange code for token** → Using PKCE code verifier
7. **Store tokens** → In HTTP-only cookies

### Picker Flow

1. **Create picker session** → POST to `/api/picker/session`
2. **Redirect to picker** → Using the returned `pickerUri`
3. **User selects photos** → In Google Photos Picker interface
4. **Retrieve media items** → GET `/api/picker/media?sessionId={sessionId}`
5. **Session cleanup** → Automatically deleted after retrieval

## API Routes

### Authentication Routes

#### `GET /api/auth/login`

Initiates the OAuth 2.0 flow.

**Response**: Redirects to Google's authorization page

**Cookies Set**:
- `oauth_code_verifier` - PKCE code verifier (10 min expiry)
- `oauth_state` - CSRF protection state (10 min expiry)

---

#### `GET /api/auth/callback`

Handles OAuth callback and exchanges authorization code for access token.

**Query Parameters**:
- `code` - Authorization code from Google
- `state` - CSRF protection state

**Response**: Redirects to `/?auth=success` on success or `/?error={error}` on failure

**Cookies Set**:
- `access_token` - OAuth access token (1 hour expiry)
- `refresh_token` - OAuth refresh token (30 days expiry, if available)

**Cookies Deleted**:
- `oauth_code_verifier`
- `oauth_state`

---

### Picker Routes

#### `POST /api/picker/session`

Creates a new Google Photos Picker session.

**Authentication**: Requires valid `access_token` cookie

**Response**:
```json
{
  "sessionId": "session_abc123",
  "pickerUri": "https://photos.google.com/picker/...",
  "mediaItemsSet": false
}
```

**Errors**:
- `401` - Not authenticated
- `500` - Failed to create session

---

#### `GET /api/picker/media?sessionId={sessionId}`

Retrieves media items from a picker session and deletes the session.

**Authentication**: Requires valid `access_token` cookie

**Query Parameters**:
- `sessionId` - The picker session ID

**Response**:
```json
{
  "mediaItems": [
    {
      "id": "item_123",
      "filename": "photo.jpg",
      "mimeType": "image/jpeg",
      "mediaFile": {
        "url": "https://..."
      },
      "mediaMetadata": {
        "creationTime": "2024-01-01T00:00:00Z",
        "width": "1920",
        "height": "1080"
      }
    }
  ],
  "count": 1
}
```

**Errors**:
- `400` - Missing session ID
- `401` - Not authenticated
- `500` - Failed to retrieve media items

## Module Structure

### `lib/config/oauth.ts`

Configuration module for OAuth 2.0 settings.

**Exports**:
- `OAuthConfig` - TypeScript interface for OAuth configuration
- `GOOGLE_PHOTOS_SCOPE` - Required OAuth scope constant
- `getOAuthConfig()` - Retrieves configuration from environment variables

---

### `lib/auth/oauth.ts`

OAuth 2.0 client implementation with PKCE support.

**Exports**:
- `createOAuthClient()` - Creates a configured OAuth2Client instance
- `generateAuthorizationUrl()` - Generates authorization URL with PKCE and state
- `exchangeCodeForToken()` - Exchanges authorization code for access token

**Features**:
- PKCE with SHA-256 code challenge
- CSRF protection via state parameter
- Cryptographically secure random string generation
- Comprehensive error handling

---

### `lib/photos/picker.ts`

Google Photos Picker API client.

**Exports**:
- `createPickerSession()` - Creates a new picker session
- `getSessionDetails()` - Retrieves session information
- `listMediaItems()` - Lists media items from a session
- `deleteSession()` - Deletes a picker session
- `PickerAPIError` - Custom error class for API errors

**Error Handling**:
- `401 UNAUTHENTICATED` - Invalid or expired token
- `400 FAILED_PRECONDITION` - No active Google Photos account
- `429 RESOURCE_EXHAUSTED` - Too many active sessions

## Security Considerations

### PKCE (Proof Key for Code Exchange)

PKCE prevents authorization code interception attacks by using a dynamically generated code verifier and challenge:

1. Generate random `code_verifier` (128 characters)
2. Create SHA-256 hash: `code_challenge = SHA256(code_verifier)`
3. Send `code_challenge` with authorization request
4. Send `code_verifier` with token exchange
5. Google validates `SHA256(code_verifier) === code_challenge`

### State Parameter

The state parameter prevents CSRF attacks:

1. Generate random state value
2. Store in HTTP-only cookie
3. Include in authorization URL
4. Validate match on callback
5. Reject if mismatch

### HTTP-Only Cookies

Tokens are stored in HTTP-only cookies to prevent XSS attacks:

- Not accessible via JavaScript
- Automatically sent with requests
- Secure flag in production
- SameSite=Lax for CSRF protection

### Session Cleanup

Sessions are automatically deleted after media retrieval to prevent resource exhaustion and comply with Google's best practices.

## Testing

### Run All Tests

```bash
pnpm test
```

### Run Tests with Coverage

```bash
pnpm test:coverage
```

### Run Tests with UI

```bash
pnpm test:ui
```

### Test Structure

- `lib/auth/__tests__/oauth.test.ts` - OAuth 2.0 flow tests
- `lib/photos/__tests__/picker.test.ts` - Picker API tests

All tests use mocked HTTP calls to avoid network dependencies.

## OAuth Scope

The implementation uses the `photospicker.mediaitems.readonly` scope, which:

- ✅ Allows read-only access to media items selected by the user
- ✅ Does not grant access to the entire library
- ✅ User explicitly selects which photos to share
- ✅ More privacy-friendly than broader scopes

**Scope URL**: `https://www.googleapis.com/auth/photospicker.mediaitems.readonly`

## Error Handling

### Common Errors

#### `FAILED_PRECONDITION`

**Cause**: User doesn't have an active Google Photos account

**Solution**: Ensure the user has Google Photos set up and has uploaded at least one photo

---

#### `RESOURCE_EXHAUSTED`

**Cause**: Too many active picker sessions

**Solution**: The implementation automatically deletes sessions after use. If this error occurs, old sessions may need manual cleanup.

---

#### `UNAUTHENTICATED` (401)

**Cause**: Invalid or expired access token

**Solution**: Redirect user to `/api/auth/login` to re-authenticate

---

#### `Token exchange failed`

**Cause**: Invalid authorization code or code verifier mismatch

**Solution**: Ensure PKCE flow is correctly implemented and cookies are preserved

## References

### Official Documentation

- [Google Photos Picker API Guide](https://developers.google.com/photos/picker/guides/get-started-picker)
- [Session Management](https://developers.google.com/photos/picker/guides/sessions)
- [Media Items API](https://developers.google.com/photos/picker/guides/media-items)
- [OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Authorization Scopes](https://developers.google.com/photos/overview/authorization)

### API Reference

- [Picker API Reference](https://developers.google.com/photos/picker/reference/rest)
- [Sessions.create](https://developers.google.com/photos/picker/reference/rest/v1/sessions/create)
- [MediaItems.list](https://developers.google.com/photos/picker/reference/rest/v1/mediaItems/list)

## License

This implementation follows Google's terms of service and API usage policies. Ensure compliance with:

- [Google APIs Terms of Service](https://developers.google.com/terms)
- [Google Photos APIs Additional Terms](https://developers.google.com/photos/terms)

## Support

For issues or questions:

1. Check the [Google Photos API Documentation](https://developers.google.com/photos)
2. Review [Stack Overflow](https://stackoverflow.com/questions/tagged/google-photos-api)
3. File an issue in this repository
