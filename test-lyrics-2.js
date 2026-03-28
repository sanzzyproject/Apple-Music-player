const YTMusic = require('ytmusic-api');

async function test() {
  const ytmusic = new YTMusic();
  await ytmusic.initialize();
  try {
    const artist = await ytmusic.getArtist('UCVacQ2t5GUZ2t_J3Ia9BynA');
    artist.featuredOn.forEach(item => {
      if (item.playlistId === artist.artistId) {
        // It's a video!
        const thumbnailUrl = item.thumbnails[0].url;
        const match = thumbnailUrl.match(/\/vi\/([a-zA-Z0-9-_]{11})\//);
        if (match) {
          const videoId = match[1];
          console.log(`Found videoId ${videoId} for ${item.name}`);
        }
      }
    });
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
