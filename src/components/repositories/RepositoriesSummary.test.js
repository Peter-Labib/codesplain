import { screen, render } from '@testing-library/react';

import RepositoriesSummary from './RepositoriesSummary';

test('display info about repo', () => {
  const repo = {
    stargazers_count: 5,
    open_issues: 1,
    forks: 30,
    language: 'js',
  };
  render(<RepositoriesSummary repository={repo} />);
  for (const key in repo) {
    const value = repo[key];
    const element = screen.getByText(new RegExp(value));

    expect(element).toBeInTheDocument();
  }
});
