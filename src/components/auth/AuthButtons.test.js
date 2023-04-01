import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { createServer } from '../../test/server';

import AuthButtons from './AuthButtons';

const renderComponent = async () => {
  render(
    <SWRConfig>
      <MemoryRouter value={{ provider: () => new Map() }}>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );

  await screen.findAllByRole('link');
};

describe('when user singn in', () => {
  createServer([
    {
      path: '/api/user',
      method: 'get',
      res: () => {
        return {
          user: { id: 2, email: 'peter@test.com' },
        };
      },
    },
  ]);

  test('show signout button', async () => {
    await renderComponent();

    const link = await screen.findByRole('link', {
      name: new RegExp('Sign Out'),
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/signout');
  });

  test('sign in and signup buttons are not shown', async () => {
    await renderComponent();

    const signinlink = screen.queryByRole('link', {
      name: new RegExp(/Sign In/i),
    });
    const signoutlink = screen.queryByRole('link', {
      name: new RegExp(/Sign up/i),
    });

    expect(signinlink).not.toBeInTheDocument();
    expect(signoutlink).not.toBeInTheDocument();
  });
});

describe('when user in not signed in', () => {
  createServer([
    {
      path: '/api/user',
      method: 'get',
      res: () => {
        return {
          user: null,
        };
      },
    },
  ]);

  test('sign in and sign up buttons are shown', async () => {
    await renderComponent();

    const signinLink = await screen.findByRole('link', {
      name: new RegExp(/Sign in/i),
    });
    const signupLink = await screen.findByRole('link', {
      name: new RegExp(/Sign up/i),
    });

    expect(signinLink).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();
    expect(signinLink).toHaveAttribute('href', '/signin');
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  test('sign out button are not shown', async () => {
    await renderComponent();

    const signoutlink = screen.queryByRole('link', {
      name: new RegExp('Sign out'),
    });

    expect(signoutlink).not.toBeInTheDocument();
  });
});
