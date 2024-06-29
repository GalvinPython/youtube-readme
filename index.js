const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

async function getLatestVideos(proxyUrl, channelId) {
	const url = `${proxyUrl}/get/${channelId}/`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data;
}

async function updateReadme(videos, readmeFilePath) {
	const videoLines = videos.map(video =>
		`- [${video.title}](https://www.youtube.com/watch?v=${video.videoId})`
	);

	const readmePath = path.resolve(readmeFilePath);
	const content = fs.readFileSync(readmePath, 'utf8');
	const startMarker = '<!-- YOUTUBE:START -->';
	const endMarker = '<!-- YOUTUBE:END -->';

	const startIndex = content.indexOf(startMarker);
	const endIndex = content.indexOf(endMarker) + endMarker.length;

	if (startIndex === -1 || endIndex === -1) {
		core.setFailed("Markers for YouTube videos not found in README.");
		return;
	}

	const newContent = `${content.slice(0, startIndex + startMarker.length)}
${videoLines.join('\n')}
${content.slice(endIndex)}`;

	fs.writeFileSync(readmePath, newContent, 'utf8');
}

(async () => {
	try {
		const proxyUrl = 'https://latestvid.stats100.xyz';
		const channelId = core.getInput('youtube_channel_id');
		const readmeFilePath = core.getInput('readme_file_path');
		console.log(channelId, readmeFilePath)

		const videos = await getLatestVideos(proxyUrl, channelId);
		await updateReadme(videos, readmeFilePath);
	} catch (error) {
		core.setFailed(error.message);
	}
})();
