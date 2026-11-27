export function urlDeDownload(url: string): string {
  return url.replace('/upload/', '/upload/fl_attachment/');
}
