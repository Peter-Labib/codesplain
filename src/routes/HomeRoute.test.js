import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { createServer } from '../test/server';

import HomeRoute from './HomeRoute';

const handlers = [
  {
    path: '/api/repositories',
    method: 'get',
    res: (req) => {
      const language = req.url.searchParams.get('q').split('language:')[1];

      return {
        items: [
          { id: '1', full_name: `first ${language} repo` },
          { id: '2', full_name: `second ${language} repo` },
        ],
      };
    },
  },
];

createServer(handlers);

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
