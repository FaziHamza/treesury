export function toFilteringUrl(url: string, filter: any): string {
  if (typeof filter === 'object' && Object.keys(filter)?.length) {
    const searchParams = new URLSearchParams(filter).toString();
    return url.concat('?', searchParams);
  }
  return url;
}
