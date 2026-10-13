import type { ImageValue } from "emdash";

/** Correct legacy uploads without replacing newer, editor-selected logos. */
export function resolveLogo(image: ImageValue | undefined | null) {
  if (!image) return image;
  if (image.filename === "findhelp-transparent.png") {
    return {
      id: "bundled-findhelp",
      src: "/logos/findhelp-transparent.png",
      alt: image.alt,
      width: 200,
      height: 69,
    };
  }
  return image;
}
