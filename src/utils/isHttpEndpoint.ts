export function isHttpEndpoint(url: string): boolean {
	return url.startsWith('http://') || url.startsWith('https://');
}
