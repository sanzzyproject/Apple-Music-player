import YTMusic from 'ytmusic-api';

const ytmusic = new YTMusic();

async function test() {
  await ytmusic.initialize();
  const videos = await ytmusic.searchVideos('The Chainsmokers');
  console.log(JSON.stringify(videos[0], null, 2));
}

test().catch(console.error);
