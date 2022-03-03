import MarkdownIt from "markdown-it";

function MermaidChart(code) {
  if (!code) return;

  try {
    return `<div class="mermaid">\n${code}\n</div>\n`;
  } catch (err) {
    return `<pre>${code}</pre>`;
  }
}

function MarkdownMermaidPlugIn(md) {
  const defaultRenderer = md.renderer.rules.fence.bind(md.renderer.rules);

  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    const code = token.content.trim();
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : "";
    let langName = "";

    if (info) {
      langName = info.split(/\s+/g)[0];
    }

    if (langName === "mermaid") {
      return MermaidChart(code);
    }

    return defaultRenderer(tokens, idx, opts, env, self);
  };
}

const options = {
  html: true,
  breaks: true,
  linkify: true,
};

export const markdownParser = MarkdownIt(options).use(MarkdownMermaidPlugIn);
