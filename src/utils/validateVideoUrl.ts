export const isValidVideoUrl = (url: string) => {
	try {
		const parsed = new URL(url);
		const hostname = parsed.hostname.toLowerCase();
		return (
			hostname.includes("youtube.com") ||
			hostname.includes("youtu.be") ||
			hostname.includes("vimeo.com")
		);
	} catch {
		return false;
	}
};
