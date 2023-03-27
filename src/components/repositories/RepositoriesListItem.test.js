import { screen, render, findByRole } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import RepositoriesListItem from "./RepositoriesListItem";

const renderComponent = () => {
  const repo = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "A js library",
    owner: {
      login: "facebook",
    },
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

  expect(link).toHaveAttribute("href", repo.html_url);
});

test("show a fileicon with the appropriate icon", async () => {
  const { repo } = renderComponent();
  const icon = await screen.findByRole("img", { name: repo.language });
  expect(icon).toHaveClass("js-icon");
});

test("show a link to code editor page", async () => {
  const { repo } = renderComponent();
  await screen.findByRole("img", { name: repo.language });
  const link = screen.getByRole("link", { name: new RegExp(repo.owner.login)});

  expect(link).toHaveAttribute('href', `/repositories/${repo.full_name}`)
});
