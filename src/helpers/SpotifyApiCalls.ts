export async function GetSpotifyPlaylists(
  accessToken: string,
  limit = 30,
  offset = 0,
) {
  const url = 'https://api.spotify.com/v1/me/playlists';
  const queryProps = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  try {
    const response = await fetch(`${url}?${queryProps}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      console.log(response);
      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export async function GetSpotifyFavoriteSongs(
  accessToken: string,
  limit = 30,
  offset = 0,
) {
  const url = 'https://api.spotify.com/v1/me/playlists';
  const queryProps = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  try {
    const response = await fetch(`${url}?${queryProps}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      console.log(response);
      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export async function getSpotifyPlaylist(
  accessToken: string,
  playlistId: string,
) {
  const url = 'https://api.spotify.com/v1/playlists';
  try {
    const response = await fetch(`${url}/${playlistId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}

export async function getTrackBPM(accessToken: string, id: string) {
  const url = 'https://api.spotify.com/v1/audio-features';
  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
}
