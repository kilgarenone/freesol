import fs from "fs";
import path from "path";
import log from "../utils/logger.js";

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

  const { postsDir, outputDir, baseDir, version } = buildConfig;

  const htmlPostsPath = path.join(baseDir, postsDir);
  // const outputPath = path.join(outputDir);

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
  const htmlFiles = throughDirectory(htmlPostsPath);

  // build pages
  htmlFiles.forEach((file) =>
    buildPage(file, {
      htmlPostsPath,
      outputDir,
      siteConfig,
      postsDir,
      baseDir,
    })
  );

  const markdownFiles = throughDirectory(postsDir);

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
async function buildPage(
  file,
  { htmlPostsPath, outputDir, siteConfig, postsDir, baseDir }
) {
  const fileData = path.parse(file);
  // fileData.dir = site/posts/ok man 22/fucke-m-ahrd-wow-m2an-v2agb1p4
  const dir = fileData.dir.split("/");

  const permalink = dir.slice(-1)[0];

  // create extra dir if generating clean URLs and filename is not index
  const destPath = path.join(outputDir, "posts", permalink);

  // create destination directory
  fs.mkdirSync(destPath, { recursive: true });

  // // read page file
  const data = fs.readFileSync(file, "utf8");

  // render page
  // const pageData = frontMatter(data);
  // const templateConfig = {
  //   site,
  //   page: pageData.attributes
  // };

  // let pageContent;

  // generate page content according to file type
  // switch (fileData.ext) {
  //   case '.md':
  //     pageContent = markdownLib.render(data);
  //     break;
  //   // case '.ejs':
  //   //   pageContent = ejs.render(pageData.body, templateConfig, {
  //   //     filename: `${srcPath}/page-${pageSlug}`
  //   //   });
  //   //   break;
  //   default:
  //     pageContent = data;
  // }

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
  fs.writeFileSync(`${destPath}/index.html`, postLayout(siteConfig, data));
}
