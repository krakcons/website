import { cardsBlockType, cardsPageFields } from "../src/schema/cards.mjs";

// Schema only, local only. Production schema/content requires separate review.
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
if (!cookie) throw new Error("Start the local Astro development server first.");

async function call(path, input, method = input ? "POST" : "GET") {
  const response = await fetch(new URL(path, base), {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-EmDash-Request": "1",
      Origin: base.origin,
      Cookie: cookie,
    },
    ...(input ? { body: JSON.stringify(input) } : {}),
  });
  const body = await response.json();
  if (!response.ok || body.success === false) {
    throw new Error(`${path}: ${body.error?.message ?? response.status}`);
  }
  return body.data ?? body;
}

const types = await call("/_emdash/api/schema/block-types");
const existingType = types.items.find((type) => type.slug === "cards");
if (existingType) {
  const fields = existingType.versions.find(
    (version) => version.version === 1,
  )?.fields;
  if (
    existingType.currentVersion !== 1 ||
    !cardsBlockType.fields.every((expected) => {
      const actual = fields?.find((field) => field.slug === expected.slug);
      return (
        actual?.type === expected.type &&
        (expected.validation?.subFields ?? []).every(
          (subField) =>
            actual.validation?.subFields?.some(
              (field) =>
                field.slug === subField.slug && field.type === subField.type,
            ) ||
            (subField.slug === "icon" &&
              !actual.validation?.subFields?.some(
                (field) => field.slug === "icon",
              )),
        )
      );
    })
  ) {
    throw new Error("Cards has an incompatible schema; left unchanged.");
  }
  const cards = fields.find((field) => field.slug === "cards");
  if (!cards.validation.subFields.some((field) => field.slug === "icon")) {
    const icon = cardsBlockType.fields
      .find((field) => field.slug === "cards")
      .validation.subFields.find((field) => field.slug === "icon");
    await call(
      "/_emdash/api/schema/block-types/cards",
      {
        expectedFingerprint: existingType.versions.find(
          (version) => version.version === existingType.currentVersion,
        ).fingerprint,
        fields: fields.map((field) =>
          field.slug === "cards"
            ? {
                ...field,
                validation: {
                  ...field.validation,
                  subFields: [...field.validation.subFields, icon],
                },
              }
            : field,
        ),
      },
      "PUT",
    );
    console.log("Added optional card icons; existing content unchanged.");
  } else {
    console.log("Cards type already exists; left unchanged.");
  }
} else {
  await call("/_emdash/api/schema/block-types", cardsBlockType);
  console.log("Created Cards block type.");
}

const path = "/_emdash/api/schema/collections/pages/fields";
const { items: fields } = await call(path);
for (const field of cardsPageFields) {
  const existing = fields.find((item) => item.slug === field.slug);
  if (existing) {
    if (
      existing.type !== "blocks" ||
      !existing.validation?.allowedTypes?.includes("cards")
    ) {
      throw new Error(
        `${field.slug} has an incompatible schema; left unchanged.`,
      );
    }
    console.log(`${field.slug} already exists; left unchanged.`);
  } else {
    await call(path, field);
    console.log(`Created ${field.slug}.`);
  }
}
