import servor from 'servor';

export function server({ path, port }) {
  return servor({
    root: path,
    fallback: 'index.html',
    module: false,
    static: true,
    reload: true,
    port,
  });
}
