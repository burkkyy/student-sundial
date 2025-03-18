export function stripTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url
}
