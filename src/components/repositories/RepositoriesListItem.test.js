import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import RepositoriesListItem from "./RepositoriesListItem";

const renderComponent = () => {
  const repo = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "A js library",
    owner: "facebook",
    name: "react",
    html_url: "http://github.com/facebook/react",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repo} />
    </MemoryRouter>
  );

  return { repo };
};

test("show a link to the github home page for this repo", async () => {
  const { repo } = renderComponent();

  await screen.findByRole("img", { name: repo.language });
  const link = await screen.findByRole("link", {
    name: /gitub repository/i,
  });

  expect(link).toHaveAttribute('href', repo.html_url);
});
