import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const createServer = (configHandler) => {
  const handlers = configHandler.map((config) => {
    return rest[config.method](config.path, (req, res, ctx) => {
      return res(ctx.json(config.res(req, res, ctx)));
    });
  });

  const server = setupServer(...handlers);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};
