// Comprehensive Video Utility for YouTube, Vimeo, and direct video embeds

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If the user entered just the 11 character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex matching all variations (watch, embed, youtu.be, shorts, live, etc.)
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

export interface VideoInfo {
  embedUrl: string;
  directWatchUrl: string;
  isYouTube: boolean;
  videoId: string | null;
}

export function formatVideoEmbed(url?: string | null): VideoInfo {
  const defaultId = 'kY73_5Vq-uU'; // High-yield physics lecture: Measurement & Units

  if (!url || typeof url !== 'string' || !url.trim()) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${defaultId}?rel=0&enablejsapi=1`,
      directWatchUrl: `https://www.youtube.com/watch?v=${defaultId}`,
      isYouTube: true,
      videoId: defaultId
    };
  }

  const trimmed = url.trim();
  const ytId = extractYouTubeId(trimmed);

  if (ytId) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&enablejsapi=1`,
      directWatchUrl: `https://www.youtube.com/watch?v=${ytId}`,
      isYouTube: true,
      videoId: ytId
    };
  }

  // Handle Vimeo
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      directWatchUrl: trimmed,
      isYouTube: false,
      videoId: vimeoMatch[1]
    };
  }

  // If already an embed URL or other iframe-compatible URL
  return {
    embedUrl: trimmed,
    directWatchUrl: trimmed,
    isYouTube: false,
    videoId: null
  };
}
