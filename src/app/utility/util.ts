export function toFilteringUrl(url: string, filter: any): string {
  if (typeof filter === 'object' && Object.keys(filter)?.length) {
    const searchParams = new URLSearchParams(filter).toString();
    return url.concat('?', searchParams);
  }
  return url;
}

export function csvExport(name:any, data:any) {
  if (!data || !Array.isArray(data)) {
    return;
  }
  name = name.length ? `${name}.csv` : 'export.csv';
  const csvData = new Blob([data.map((e) => e.join(',')).join('\n')], {
    type: 'text/csv',
  });
  const csvUrl = URL.createObjectURL(csvData);
  const link = document.createElement('a');
  link.setAttribute('href', csvUrl);
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
