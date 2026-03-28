const YTMusic = require('ytmusic-api');

async function test() {
  const ytmusic = new YTMusic();
  await ytmusic.initialize();
  try {
    const artist = await ytmusic.getArtist('UCVacQ2t5GUZ2t_J3Ia9BynA');
    
    // Fix ytmusic-api bug where carousels are shifted
    const isPlaylist = (id) => id && (id.startsWith('VL') || id.startsWith('PL') || id.startsWith('RD'));
    const isVideo = (id) => id && id === artist.artistId; // ytmusic-api sets playlistId to artistId for videos
    
    // Check if featuredOn actually contains videos (Live performances)
    if (artist.featuredOn && artist.featuredOn.length > 0 && isVideo(artist.featuredOn[0].playlistId)) {
      // It's actually videos! Let's extract videoIds
      const videos = artist.featuredOn.map(item => {
        let videoId = item.playlistId;
        if (item.thumbnails && item.thumbnails.length > 0) {
          const match = item.thumbnails[0].url.match(/\/vi\/([a-zA-Z0-9-_]{11})\//);
          if (match) videoId = match[1];
        }
        return { ...item, type: 'VIDEO', videoId };
      });
      
      // If similarArtists actually contains playlists (Featured on)
      if (artist.similarArtists && artist.similarArtists.length > 0 && isPlaylist(artist.similarArtists[0].artistId)) {
        // Swap them!
        const realFeaturedOn = artist.similarArtists.map(item => ({
          type: 'PLAYLIST',
          playlistId: item.artistId,
          name: item.name,
          artist: artist,
          thumbnails: item.thumbnails
        }));
        
        artist.featuredOn = realFeaturedOn;
        artist.similarArtists = []; // We lost the real similar artists, so clear it
        
        // Maybe we can put the videos in topVideos if they are not there?
        // Or just create a new property `livePerformances`
        artist.livePerformances = videos;
      } else {
        // Just clear featuredOn if it's invalid
        artist.featuredOn = [];
      }
    }
    
    console.log("Fixed Featured On:");
    artist.featuredOn.forEach(item => {
      console.log(`- ${item.name} (ID: ${item.playlistId})`);
    });
    
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
