import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "node:net";
import { readSmtpConfig, sendSmtpMessage } from "./smtp-transport.mjs";
import { createPlugin } from "./krakstack-smtp.mjs";

const env = {
  SMTP_HOST: "smtp.example.com",
  SMTP_PORT: "587",
  SMTP_USER: "test-user",
  SMTP_PASSWORD: "test-password",
  SMTP_FROM: "noreply@example.com",
};
const message = {
  to: "recipient@example.com",
  subject: "Test / Essai",
  text: "Test message",
  html: "<p>Test message</p>",
};

test("no environment settings reports SMTP as unconfigured", () => {
  assert.equal(readSmtpConfig({}), null);
});

test("partial configuration fails without including credential values", () => {
  for (const key of Object.keys(env)) {
    const partial = { ...env };
    delete partial[key];
    assert.throws(
      () => readSmtpConfig(partial),
      (error) => {
        assert.match(error.message, new RegExp(key));
        assert.ok(!error.message.includes(env.SMTP_PASSWORD));
        return true;
      },
    );
  }
  assert.throws(() => readSmtpConfig({ SMTP_NAME: "Test" }), /missing/);
});

test("invalid ports and sender addresses are rejected", () => {
  for (const SMTP_PORT of ["0", "65536", "587.5", "abc", "587xyz"]) {
    assert.throws(() => readSmtpConfig({ ...env, SMTP_PORT }), /SMTP_PORT/);
  }
  for (const SMTP_FROM of [
    "invalid",
    "a@example.com,b@example.com",
    "a@example.com\r\nBcc: b@example.com",
  ]) {
    assert.throws(() => readSmtpConfig({ ...env, SMTP_FROM }), /SMTP_FROM/);
  }
  assert.throws(
    () => readSmtpConfig({ ...env, SMTP_NAME: "Name\r\nBcc: test" }),
    /SMTP_NAME/,
  );
});

test("configuration is resolved fresh, without caching runtime secrets", () => {
  const mutable = { ...env };
  assert.equal(readSmtpConfig(mutable).password, "test-password");
  mutable.SMTP_PASSWORD = "rotated-password";
  assert.equal(readSmtpConfig(mutable).password, "rotated-password");
});

for (const port of [587, 465]) {
  test(`port ${port} uses the correct TLS mode and forwards the message`, async () => {
    let closed = false;
    const config = readSmtpConfig({ ...env, SMTP_PORT: String(port) });
    const id = await sendSmtpMessage(config, message, (options) => {
      assert.equal(options.secure, port === 465);
      assert.equal(options.requireTLS, port !== 465);
      assert.deepEqual(options.auth, {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      });
      assert.notEqual(options.tls?.rejectUnauthorized, false);
      assert.equal(options.disableFileAccess, true);
      assert.equal(options.disableUrlAccess, true);
      return {
        async sendMail(mail) {
          assert.deepEqual(mail, {
            ...message,
            from: { address: env.SMTP_FROM, name: "Krak Consultants" },
          });
          return { accepted: [message.to], rejected: [], messageId: "test-id" };
        },
        close() {
          closed = true;
        },
      };
    });
    assert.equal(id, "test-id");
    assert.equal(closed, true);
  });
}

test("delivery failures are redacted and close the transport", async () => {
  let closed = false;
  await assert.rejects(
    sendSmtpMessage(readSmtpConfig(env), message, () => ({
      async sendMail() {
        throw new Error(`Auth failed for ${env.SMTP_PASSWORD}`);
      },
      close() {
        closed = true;
      },
    })),
    (error) => {
      assert.match(error.message, /delivery failed/);
      assert.ok(!error.message.includes(env.SMTP_PASSWORD));
      return true;
    },
  );
  assert.equal(closed, true);
});

test("recipient rejection fails delivery", async () => {
  await assert.rejects(
    sendSmtpMessage(readSmtpConfig(env), message, () => ({
      async sendMail() {
        return { accepted: [], rejected: [message.to] };
      },
      close() {},
    })),
    /delivery failed/,
  );
});

test("minimal plugin provides only the exclusive SMTP delivery hook", () => {
  const plugin = createPlugin();
  assert.equal(plugin.id, "krakstack-smtp");
  assert.ok(!plugin.routes || Object.keys(plugin.routes).length === 0);
  assert.ok(!plugin.admin?.pages?.length);
  assert.equal(plugin.hooks["email:deliver"].exclusive, true);
  assert.equal(plugin.hooks["email:deliver"].timeout, 45000);
});

test("unconfigured runtime provider fails explicitly instead of dropping email", async () => {
  const keys = [...Object.keys(env), "SMTP_NAME"];
  const previous = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  for (const key of keys) delete process.env[key];
  try {
    await assert.rejects(
      createPlugin().hooks["email:deliver"].handler(
        { message, source: "test" },
        {},
      ),
      /Runtime SMTP is not configured/,
    );
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("runtime hook refuses a real SMTP connection without TLS before sending credentials", async () => {
  const commands = [];
  const sockets = new Set();
  const server = createServer((socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    socket.write("220 localhost test SMTP\r\n");
    let buffer = "";
    socket.on("data", (data) => {
      buffer += data.toString();
      let end;
      while ((end = buffer.indexOf("\r\n")) !== -1) {
        const command = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        commands.push(command);
        if (command.startsWith("EHLO")) {
          socket.write("250-localhost\r\n250 AUTH LOGIN PLAIN\r\n");
        } else if (command === "STARTTLS") {
          socket.write("454 TLS not available\r\n");
        } else {
          socket.write("500 Unexpected command\r\n");
        }
      }
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const previous = Object.fromEntries(
    [...Object.keys(env), "SMTP_NAME"].map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, env, {
    SMTP_HOST: "127.0.0.1",
    SMTP_PORT: String(server.address().port),
    SMTP_NAME: "Test sender",
  });

  try {
    await assert.rejects(
      createPlugin().hooks["email:deliver"].handler(
        { message, source: "test" },
        {},
      ),
      /Runtime SMTP delivery failed/,
    );
    assert.ok(commands.includes("STARTTLS"));
    assert.ok(
      !commands.some((command) =>
        /^(AUTH|MAIL FROM|RCPT TO|DATA)/.test(command),
      ),
    );
    assert.ok(!commands.some((command) => command.includes(env.SMTP_PASSWORD)));
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    for (const socket of sockets) socket.destroy();
    await new Promise((resolve) => server.close(resolve));
  }
});
