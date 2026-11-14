import { initBotId } from "botid/client/core";

initBotId({
  protect: [{ path: "/api/review/*/comments", method: "POST" }],
});
