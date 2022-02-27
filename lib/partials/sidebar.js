import fs from "fs";
import frontMatterParser from "@egoist/front-matter";

function arrangeIntoTree(flatArray, { postsDir }) {
  const tree = [];

  // This example uses the underscore.js library.
  flatArray.forEach((file) => {
    let currentLevel = tree; // initialize currentLevel to root

    const markdownData = fs.readFileSync(file, "utf-8");
    const { head } = frontMatterParser(markdownData);
    const frontMatter = JSON.parse(head);

    file
      .replace(/^posts\//, "")
      .split("/")
      .forEach((part) => {
        // check to see if the path already exists.
        const existingPath = currentLevel.find((level) => level.name === part);

        if (existingPath) {
          // The path to this item was already in the tree, so don't add it again.
          // Set the current level to this path's children
          currentLevel = existingPath.children;
        } else {
          const newPart = {
            name: part,
            children: [],
            path: postsDir + "/" + frontMatter.permalink,
          };

          currentLevel.push(newPart);
          currentLevel = newPart.children;
        }
      });
  });

  return tree;
}

function treeToHTML(arg, nested = false) {
  return `
        <ul ${nested ? `class="nested"` : ""}>
        ${arg
          .map(({ children, name, path }) =>
            children.length
              ? `<li><span class="caret">${name}</span>${treeToHTML(
                  children,
                  true
                )}</li>`
              : `<li><a href="${path}">${name}</a></li>`
          )
          .join("")}
        </ul>
        `;
}

export function sidebar(files, configs) {
  return treeToHTML(arrangeIntoTree(files, configs));
}
