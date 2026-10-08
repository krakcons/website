export const projectGroups = [
  {
    id: "client-work",
    value: "Client & nonprofit work",
    title: "Client & nonprofit work",
    description:
      "Digital solutions for the organizations and people we work with.",
  },
  {
    id: "internal-products",
    value: "Internal products",
    title: "Internal products",
    description:
      "Our own products, built to solve useful problems and strengthen our ecosystem.",
  },
  {
    id: "open-source",
    value: "Open source",
    title: "Open source",
    description: "KrakStack tools and components that others can build on.",
  },
];

export const safeProjectUrl = (value?: string) => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
};
