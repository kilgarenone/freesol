import { footer } from "../partials/footer.js";
import { head } from "../partials/head.js";
import { sidebar } from "../partials/sidebar.js";

export default function IndexLayout(props, files, configs) {
  return /*html*/ `
<!DOCTYPE html>
<html lang="en">
  ${head(props)}
  <body>
  ${sidebar(files, configs)}
  ${footer(props)}
  </body>
</html>
  `;
}
