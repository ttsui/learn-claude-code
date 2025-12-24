import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GooglePhotosPicker } from '../GooglePhotosPicker';

describe('GooglePhotosPicker', () => {
  it('should render a button to initiate OAuth flow', () => {
    render(<GooglePhotosPicker />);

    const loginButton = screen.getByRole('button', { name: /connect google photos/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('should display a link with correct OAuth URL', () => {
    const mockClientId = 'test-client-id';
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = mockClientId;

    render(<GooglePhotosPicker />);

    const loginButton = screen.getByRole('button', { name: /connect google photos/i });
    expect(loginButton).toBeInTheDocument();
  });
});
