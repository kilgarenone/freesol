import fs from "fs";
import path from "path";
import log from "../utils/logger.js";
import frontMatterParser from "@egoist/front-matter";
import { markdownParser } from "../modules/markdownParser.js";

function throughDirectory(directory, files = []) {
  fs.readdirSync(directory).forEach((file) => {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) throughDirectory(absolute, files);
    else files.push(absolute);
  });

  return files;
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Build the site
 */
export function build(buildConfig, siteConfig) {
  log.info("Building site...");

  const startTime = process.hrtime();

  const { postsDir, outputDir, version } = buildConfig;

  const outputPath = path.join(outputDir, postsDir);

  // clear destination folder
  // fs.readdirSync(outputDir).forEach((f) => fs.rmSync(`${outputDir}/${f}`));

  const outputCssAssetsDirPath = path.join("assets", "css", version);
  const outputIndexCssAssetFilePath = path.join(
    outputCssAssetsDirPath,
    "index.css"
  );

  fs.mkdirSync(path.join(outputDir, outputCssAssetsDirPath), {
    recursive: true,
  });

  const srcIndexCssPath = path.resolve(
    __dirname,
    "..",
    "assets",
    "css",
    "index.css"
  );

  fs.copyFileSync(
    srcIndexCssPath,
    path.join(outputDir, outputIndexCssAssetFilePath)
  );

  // get an array of flat filepaths in posts folder
  const markdownFiles = throughDirectory(postsDir);

  // build pages
  markdownFiles.forEach((file) =>
    buildPage(file, {
      outputDir,
      siteConfig,
      postsDir,
    })
  );

  // build the index page
  buildIndexPage(markdownFiles, {
    outputDir,
    postsDir,
    siteConfig,
    styleSheet: outputIndexCssAssetFilePath,
  });

  // display build time
  const timeDiff = process.hrtime(startTime);
  const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
  log.success(`Site built succesfully in ${duration}ms`);
}

async function buildIndexPage(
  files,
  { postsDir, outputDir, siteConfig, styleSheet }
) {
  const { default: indexLayout } = await loadLayout("index");
  fs.writeFileSync(
    `${outputDir}/index.html`,
    indexLayout(siteConfig, files, {
      postsDir,
      styleSheet,
    })
  );
}

/**
 * Loads a layout file
 */
function loadLayout(layout) {
  return import(`../layouts/${layout}.js`);
}

/**
 * Build a single page
 */
async function buildPage(file, { outputDir, siteConfig, postsDir }) {
  const fileData = path.parse(file);

  // // read page file
  const content = fs.readFileSync(file, "utf8");

  // render page
  const { head, body } = frontMatterParser(content);
  const frontMatter = JSON.parse(head);

  const destPath = path.join(outputDir, "posts", frontMatter.permalink);
  // create destination directory
  fs.mkdirSync(destPath, { recursive: true });
  // const pageData = frontMatter(data);
  // const templateConfig = {
  //   site,
  //   page: pageData.attributes
  // };

  // let pageContent;
  const pageContent = markdownParser.render(body);

  // render layout with page contents
  // const layoutName = pageData.attributes.layout || 'default';
  const { default: postLayout } = await loadLayout(postsDir);

  // const completePage = ejs.render(
  //   layout.data,
  //   Object.assign({}, templateConfig, {
  //     body: pageContent,
  //     filename: `${srcPath}/layout-${layoutName}`
  //   })
  // );

  // // save the html file
  fs.writeFileSync(
    `${destPath}/index.html`,
    postLayout(siteConfig, pageContent)
  );
}
