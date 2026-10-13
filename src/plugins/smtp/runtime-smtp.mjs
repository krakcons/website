import { definePlugin } from "emdash";
import { readSmtpConfig, sendSmtpMessage } from "./smtp-transport.mjs";

export function createPlugin() {
  return definePlugin({
    id: "runtime-smtp",
    version: "1.0.0",
    capabilities: ["hooks.email-transport:register"],
    hooks: {
      "email:deliver": {
        exclusive: true,
        timeout: 45000,
        handler: async (event, ctx) => {
          const config = readSmtpConfig();
          if (!config) {
            throw new Error(
              "Runtime SMTP is not configured. Inject SMTP variables or select the development console under Settings → Email.",
            );
          }
          await sendSmtpMessage(config, event.message);
          ctx.log.info("Runtime SMTP delivery accepted by the mail server.");
        },
      },
    },
  });
}
