import fs from 'fs';
import path from 'path';
import log from '../utils/logger.js';

const files = [];

function throughDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute);
    else return files.push(absolute);
  });
}

/**
 * Build the site
 */
export function build(config) {
  log.info('Building site...');

  const startTime = process.hrtime();

  const {
    build: { postsDir, outputDir, baseDir },
    site,
  } = config;

  const postsPath = path.join(baseDir, postsDir);
  // const outputPath = path.join(outputDir);

  // clear destination folder
  // fs.readdirSync(outputDir).forEach((f) => fs.rmSync(`${outputDir}/${f}`));

  // // copy assets folder
  // if (fs.existsSync(`${srcPath}/assets`)) {
  //   fs.copySync(`${srcPath}/assets`, outputPath);
  // }

  // get an array of flat filepaths in posts folder
  throughDirectory(postsPath);
  // files.forEach(file => _buildPage(file, { srcPath, outputPath, site }));

  console.log('files:', files);
  files.forEach((file) =>
    _buildPage(file, {
      postsPath,
      outputDir,
      site,
      postsDir,
      baseDir,
    })
  );

  // // display build time
  // const timeDiff = process.hrtime(startTime);
  // const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
  // log.success(`Site built succesfully in ${duration}ms`);
}

/**
 * Loads a layout file
 */
function _loadLayout(layout, { baseDir }) {
  const file = path.resolve(baseDir, 'layouts', layout + '.js');
  // const file = path.resolve(baseDir, 'layouts', layout + '.js');
  return import('../layouts/posts.js');
}

/**
 * Build a single page
 */
async function _buildPage(
  file,
  { postsPath, outputDir, site, postsDir, baseDir }
) {
  const fileData = path.parse(file);
  // fileData.dir = site/posts/ok man 22/fucke-m-ahrd-wow-m2an-v2agb1p4
  const dir = fileData.dir.split('/');

  const permalink = dir.slice(-1)[0];

  // create extra dir if generating clean URLs and filename is not index
  const destPath = path.join(outputDir, 'posts', permalink);

  // create destination directory
  fs.mkdirSync(destPath, { recursive: true });

  // // read page file
  const data = fs.readFileSync(file, 'utf-8');

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
  const { default: layout } = await _loadLayout(postsDir, { baseDir });

  // const completePage = ejs.render(
  //   layout.data,
  //   Object.assign({}, templateConfig, {
  //     body: pageContent,
  //     filename: `${srcPath}/layout-${layoutName}`
  //   })
  // );

  // // save the html file
  fs.writeFileSync(`${destPath}/index.html`, layout(site, data));
}
