import nodemailer from "nodemailer";

const keys = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
  "SMTP_NAME",
];

// Resolve on delivery, never while Astro serializes its build configuration.
export function readSmtpConfig(env = process.env) {
  if (!keys.some((key) => env[key] !== undefined)) return null;

  const required = keys.slice(0, 5);
  const missing = required.filter((key) => !env[key]?.trim());
  if (missing.length) {
    throw new Error(
      `Runtime SMTP configuration is missing: ${missing.join(", ")}`,
    );
  }

  const port = Number(env.SMTP_PORT);
  if (
    !/^\d+$/.test(env.SMTP_PORT) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error("SMTP_PORT must be an integer between 1 and 65535.");
  }
  const from = env.SMTP_FROM.trim();
  if (!/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(from)) {
    throw new Error("SMTP_FROM must be a single email address.");
  }
  if (/[\r\n]/.test(env.SMTP_NAME ?? "")) {
    throw new Error("SMTP_NAME must not contain line breaks.");
  }

  return {
    host: env.SMTP_HOST.trim(),
    port,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from,
    name: env.SMTP_NAME?.trim() || "Krak Consultants",
  };
}

export async function sendSmtpMessage(
  config,
  message,
  createTransport = nodemailer.createTransport,
) {
  const transport = createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port !== 465,
    auth: { user: config.user, pass: config.password },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    logger: false,
    debug: false,
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  try {
    const result = await transport.sendMail({
      from: { address: config.from, name: config.name },
      to: message.to,
      subject: message.subject,
      text: message.text,
      ...(message.html ? { html: message.html } : {}),
    });
    if (!result.accepted?.length || result.rejected?.length) {
      throw new Error("SMTP server did not accept all recipients.");
    }
    return result.messageId;
  } catch {
    // SMTP errors can include connection/auth details; do not propagate secrets.
    throw new Error(
      "Runtime SMTP delivery failed. Check the provider and configuration.",
    );
  } finally {
    transport.close();
  }
}
