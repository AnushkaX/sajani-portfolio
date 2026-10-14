const VIDEO_EXTENSIONS = /\.(mp4|webm|ogv|ogg|mov|m4v)(?:$|[?#])/i;

export function isVideoUrl(url: string): boolean {
  return VIDEO_EXTENSIONS.test(url);
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

export function mediaLabel(url: string): string {
  try {
    const name = decodeURIComponent(new URL(url, 'http://local').pathname.split('/').pop() ?? '');
    return name || url;
  } catch {
    return url;
  }
}
