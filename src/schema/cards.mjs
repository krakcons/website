export const cardsBlockType = {
  slug: "cards",
  label: "Cards",
  description:
    "A heading, optional section link, and an ordered list of cards.",
  category: "Layout",
  fields: [
    { slug: "eyebrow", label: "Section label", type: "string" },
    { slug: "heading", label: "Heading", type: "string", required: true },
    { slug: "link_label", label: "Section link label", type: "string" },
    { slug: "link_url", label: "Section link URL", type: "url" },
    {
      slug: "cards",
      label: "Cards",
      type: "repeater",
      validation: {
        minItems: 1,
        maxItems: 12,
        subFields: [
          { slug: "title", label: "Title", type: "string", required: true },
          {
            slug: "icon",
            label:
              "Icon (shield, accessibility, languages, activity, sparkles)",
            type: "string",
          },
          { slug: "summary", label: "Summary", type: "text" },
          { slug: "url", label: "Link URL", type: "url" },
          { slug: "link_label", label: "Link label", type: "string" },
        ],
      },
    },
  ],
};

// Homepage slots share the same Cards type and keep their content independent.
export const cardsPageFields = [
  { slug: "services_section", label: "Services section" },
  { slug: "approach_section", label: "Built into the approach section" },
  { slug: "projects_section", label: "Projects section" },
].map((field) => ({
  ...field,
  type: "blocks",
  validation: { allowedTypes: ["cards"], maxItems: 1 },
}));
