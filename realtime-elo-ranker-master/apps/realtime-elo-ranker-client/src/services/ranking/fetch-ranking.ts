import { PlayerData } from "@realtime-elo-ranker/libs/ui";

/**
 * Fetch the ranking.
 * 
 * Sends a GET request to the server to fetch the ranking.
 * 
 * @returns {Promise<PlayerData[]>} A promise of future ranking data
 */
export default function fetchRanking(baseUrl: string): Promise<PlayerData[]> {
  return fetch( "http://localhost:3000/get/ranking", { method: "GET" })
    .then(res => {
      if (res.ok) {
        console.log(res)
        return res.json();
      }
      throw new Error("Failed to fetch ranking");
    })
    .then(data => {
      // Assuming the data is in the correct format
      return data as PlayerData[];
    })
    .catch(error => {
      console.error("Error fetching ranking:", error);
      throw error;
    });
}