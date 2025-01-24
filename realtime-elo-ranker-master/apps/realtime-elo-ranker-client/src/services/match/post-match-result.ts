import { MatchResult } from "@realtime-elo-ranker/libs/ui";
import eventEmitter from '../eventEmmitter'; // Ensure this path is correct and the module exists

const URL = "/post/match";

/**
 * Post the result of a match.
 * 
 * @param {string} baseUrl The base URL of the API
 * @param {string} adversaryA The ID of the first adversary
 * @param {string} adversaryB The ID of the second adversary
 * @param {MatchResult} result The result of the match
 */
export async function postMatchResult(baseUrl: string, adversaryA: string, adversaryB: string, result: MatchResult): Promise<Response> {
  const response = await fetch(baseUrl + URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      winner: result === MatchResult.LEFT_WIN ? adversaryA : result === MatchResult.RIGHT_WIN ? adversaryB : null,
      loser: result === MatchResult.LEFT_WIN ? adversaryB : result === MatchResult.RIGHT_WIN ? adversaryA : null,
      draw: result === MatchResult.DRAW ? true : false,
    }),
  });
  eventEmitter.emit('matchResultPosted', { adversaryA, adversaryB, result });

  return response;
}