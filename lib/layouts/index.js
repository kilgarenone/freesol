import { footer } from "../partials/footer.js";
import { head } from "../partials/head.js";
import { sidebar } from "../partials/sidebar.js";

export default function IndexLayout(siteConfig, files, configs) {
  return /*html*/ `
<!DOCTYPE html>
<html lang="en">
  ${head(siteConfig, configs)}
  <body>
  ${sidebar(files, configs)}
  ${footer(siteConfig, configs)}
  </body>
</html>
  `;
}
