import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import HomeRoute from './HomeRoute';

const handler = [
  rest.get('/api/repositories', (req, res, ctx) => {
    const language = req.url.searchParams.get('q').split('language:')[1];

    return res(
      ctx.json({
        items: [
          { id: '1', full_name: `first ${language} repo` },
          { id: '2', full_name: `second ${language} repo` },
        ],
      })
    );
  }),
];

const server = setupServer(...handler);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('render head and two links for each lang', async () => {
  const languages = ['javascript', 'typescript', 'rust', 'go'];
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );

  for (const lang of languages) {
    const links = await screen.findAllByRole('link', {
      name: new RegExp(lang),
    });
    const head = screen.getByRole('heading', {
      level: 1,
      name: new RegExp(lang, 'i'),
    });
    expect(links[0]).toHaveTextContent(new RegExp(`first ${lang}`));
    expect(links[1]).toHaveTextContent(new RegExp(`second ${lang}`));
    expect(links).toHaveLength(2);
    expect(head).toBeInTheDocument();
  }
});
