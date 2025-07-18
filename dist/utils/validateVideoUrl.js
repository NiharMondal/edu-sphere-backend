"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidVideoUrl = void 0;
const isValidVideoUrl = (url) => {
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname.toLowerCase();
        return (hostname.includes("youtube.com") ||
            hostname.includes("youtu.be") ||
            hostname.includes("vimeo.com"));
    }
    catch (_a) {
        return false;
    }
};
exports.isValidVideoUrl = isValidVideoUrl;
