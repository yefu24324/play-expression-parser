import { createMiddleware } from "@solidjs/start/middleware";

export default createMiddleware({
  onRequest: [(event) => {}],
  onBeforeResponse: [(event, { body }) => {}],
});
