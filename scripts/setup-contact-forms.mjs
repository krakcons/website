// Explicitly local-only: production form creation is a reviewed admin operation.
const base = new URL(process.argv[2] ?? "http://localhost:4321");
if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) {
  throw new Error(
    "This setup command only supports a local development server.",
  );
}
const auth = await fetch(new URL("/_emdash/api/auth/dev-bypass", base), {
  redirect: "manual",
});
const cookie = auth.headers.get("set-cookie")?.split(";")[0];
if (!cookie)
  throw new Error(
    "No development session. Start Astro in development mode first.",
  );
async function call(path, input = {}) {
  const response = await fetch(new URL(path, base), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-EmDash-Request": "1",
      Origin: base.origin,
      Cookie: cookie,
    },
    body: JSON.stringify(input),
  });
  const body = await response.json();
  if (!response.ok || body.success === false)
    throw new Error(`${path}: ${body.error?.message ?? response.status}`);
  return body.data ?? body;
}
const prefix = "/_emdash/api/plugins/emdash-forms";
const { items } = await call(`${prefix}/forms/list`);
for (const locale of ["en", "fr"]) {
  const slug = `contact-${locale}`;
  if (items.some((item) => item.slug === slug)) {
    console.log(`${slug}: already exists; left unchanged.`);
    continue;
  }
  const fr = locale === "fr";
  const field = (name, type, label, required, maxLength, minLength) => ({
    id: name,
    name,
    type,
    label,
    required,
    width: "full",
    validation: { maxLength, ...(minLength ? { minLength } : {}) },
  });
  await call(`${prefix}/forms/create`, {
    name: fr ? "Contact — Français" : "Contact — English",
    slug,
    pages: [
      {
        fields: [
          field("name", "text", fr ? "Nom" : "Name", true, 150),
          field(
            "email",
            "email",
            fr ? "Adresse courriel" : "Email address",
            true,
            254,
          ),
          field(
            "organization",
            "text",
            fr ? "Entreprise ou organisation" : "Company or organization",
            false,
            200,
          ),
          field(
            "message",
            "textarea",
            fr ? "Message" : "Message",
            true,
            5000,
            10,
          ),
        ],
      },
    ],
    settings: {
      notifyEmails: ["info@krakconsultants.com"],
      spamProtection: "honeypot",
      confirmationMessage: fr
        ? "Merci! Votre message a bien été reçu."
        : "Thanks! Your message has been received.",
      submitLabel: fr ? "Envoyer le message" : "Send message",
    },
  });
  console.log(`${slug}: created.`);
}
