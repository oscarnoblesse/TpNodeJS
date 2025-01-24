const URL = "/post/player";
import eventEmitter from '../eventEmmitter'; // Ensure this path is correct and the module exists

/**
 * Post a player to create it.
 * 
 * @param {string} baseUrl The base URL of the API
 * @param {string} id The ID of the new player
 */

export async function postPlayer(baseUrl: string, playerName: string): Promise<Response> {
  const response = await fetch( baseUrl + URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({playerName, }),
  });

  if (!response.ok) {
    eventEmitter.emit('playerPosted',playerName);
  }

  return response;
}