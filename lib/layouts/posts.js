import { footer } from "../partials/footer.js";
import { head } from "../partials/head.js";

export default function PostLayout(props, body) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    ${head(props)}
    <body>
      ${body}
      ${footer(props)}
    </body>
    </html>
  `;
}
