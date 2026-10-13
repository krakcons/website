import type { ImageValue } from "emdash";

/** Correct legacy uploads without replacing newer, editor-selected logos. */
export function resolveLogo(image: ImageValue | undefined | null) {
  if (!image) return image;
  if (
    image.filename === "goalieup-logo.png" ||
    image.id === "01M4VN4QMZA53X94WP3H24VTEZ" ||
    image.src?.split("?")[0].endsWith("/01M4VN4QMZA53X94WP3H24VTEZ.png")
  ) {
    return {
      id: "bundled-goalieup",
      src: "/logos/goalieup.svg",
      alt: image.alt,
      // Leave dimensions unset so the vector is served without rasterization.
    };
  }
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
