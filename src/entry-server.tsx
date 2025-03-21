// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";

declare module "@solidjs/start/server" {
  interface RequestEventLocals {
    n: number;
    s: string;
  }
}

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body class="dark:bg-neutral-900">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
