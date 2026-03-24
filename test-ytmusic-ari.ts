import YTMusic from 'ytmusic-api';

const ytmusic = new YTMusic();

async function test() {
  await ytmusic.initialize();
  const search = await ytmusic.search('Ari Lasso');
  const artistId = search.find(s => s.type === 'ARTIST')?.artistId;
  if (!artistId) return;
  const artist = await ytmusic.getArtist(artistId);
  console.log(JSON.stringify(artist.featuredOn, null, 2));
}

test().catch(console.error);
