"use client";
import { useEffect, useState } from "react";
import { Rating, Avatar, Box, Typography } from "@mui/material";
import styles from "./page.module.css";


interface Restaurant {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  rating: number;
}

interface AIResponse {
  selected_intent: string;
  business_search?: {
    description: string;
    businesses: {
      id: string;
      name: string;
      location: {
        formatted_address: string;
      };
      rating: number;
      price: string | null;
      photos: {
        original_url: string;
      }[];
    }[];
  };
  error?: {
    code: string;
    description: string;
  };
}

// Helper function for ranking
function removeDuplicatesKeepingLast(array: Restaurant[]): Restaurant[] {
  const reversed = [...array].reverse();
  const filtered = reversed.filter(
    (item, index, self) => self.findIndex((r) => r.id === item.id) === index
  );
  return filtered.reverse();
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<Restaurant[]>([]);
  const [query, setQuery] = useState<string>("Find the best restaurants in Vancouver");
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Ranking feature
  useEffect(() => {
    const bracketData = localStorage.getItem("restaurantsForBracket");
    const finalData = localStorage.getItem("finalRanking");

    if (!bracketData || !finalData) {
      alert("아직 최종 랭킹 데이터가 없습니다!");
      return;
    }

    const bracketAll = JSON.parse(bracketData) as Restaurant[];
    const selectedList = JSON.parse(finalData) as Restaurant[];

    const unique = removeDuplicatesKeepingLast(selectedList);
    const finalList = [...unique].reverse();

    const selectedIds = new Set(finalList.map((r) => r.id));
    const losers = bracketAll.filter((r) => !selectedIds.has(r.id));

    const combined = [...finalList, ...losers];
    const top8 = combined.slice(0, 8);

    setRanking(top8);
  }, []);

  // Function to fetch AI chatbot responses
  const fetchAIChat = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/yelp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: query,
          chat_history: [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response.");
      }

      const data = await response.json();
      setAIResponse(data);
    } catch (error) {
      console.error("Error fetching AI response from backend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {ranking.length === 0 ? (
        <p>No data.</p>
      ) : (
        <div className="col-span-4 flex items-end justify-content: center;
  align-items: center;">
          <div className="flex justify-between items-start w-full px-10">
            <div className="flex items-end w-full">
              <div className="flex flex-col items-center w-[55%]">
                <div className="flex justify-between items-end w-full">
                  {/* Rank 1 */}
                  <div className="flex flex-col items-center">
                    <Avatar
                      src={ranking[0]?.imageUrl || ""}
                      alt={ranking[0]?.name || "N/A"}
                      sx={{
                        width: { xs: 80, sm: 120, lg: 100 },
                        height: { xs: 80, sm: 120, lg: 100 },
                        border: "4px solid gold",
                      }}
                    />
                    <Box
                      sx={{
                        width: { xs: 70, sm: 100, lg: 110 },
                        height: { xs: 100, sm: 140, lg: 250 },
                        backgroundColor: "gold",
                        borderRadius: "8px 8px 0 0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="h5" color="white" fontWeight="bold">
                        🥇
                      </Typography>
                    </Box>
                    <Typography
                      align="center"
                      sx={{
                        maxWidth: 120,
                        fontWeight: "bold",
                        wordWrap: "break-word",
                        mt: 2,
                      }}
                    >
                      {ranking[0]?.name}
                    </Typography>
                    <Typography align="center" color="textSecondary">
                      {ranking[0]?.category}
                    </Typography>
                    <Rating
                      value={ranking[0]?.rating || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </div>

                  {/* Rank 2 */}
                  <div className="flex flex-col items-center">
                    <Avatar
                      src={ranking[1]?.imageUrl || ""}
                      alt={ranking[1]?.name || "N/A"}
                      sx={{
                        width: { xs: 70, sm: 110, lg: 100 },
                        height: { xs: 70, sm: 110, lg: 100 },
                        border: "4px solid silver",
                      }}
                    />
                    <Box
                      sx={{
                        width: { xs: 60, sm: 90, lg: 100 },
                        height: { xs: 80, sm: 120, lg: 200 },
                        backgroundColor: "silver",
                        borderRadius: "8px 8px 0 0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="h5" color="white" fontWeight="bold">
                        🥈
                      </Typography>
                    </Box>
                    <Typography
                      align="center"
                      sx={{
                        maxWidth: 120,
                        fontWeight: "bold",
                        wordWrap: "break-word",
                        mt: 2,
                      }}
                    >
                      {ranking[1]?.name}
                    </Typography>
                    <Typography align="center" color="textSecondary">
                      {ranking[1]?.category}
                    </Typography>
                    <Rating
                      value={ranking[1]?.rating || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-[45%] flex items-center justify-start">
                <table className="table-auto w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2">Rank</th>
                      <th className="px-4 py-2">Restaurant</th>
                      <th className="px-4 py-2">Category</th>
                      <th className="px-4 py-2">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.slice(2, 8).map((res, idx) => (
                      <tr key={res.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{idx + 3}</td>
                        <td className="px-4 py-2">{res.name}</td>
                        <td className="px-4 py-2">{res.category}</td>
                        <td className="px-4 py-2">
                          <Rating value={res.rating || 0} precision={0.5} readOnly size="small" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {!chatOpen && (
        <div
          className={styles.chatToggle}
          onClick={() => setChatOpen(true)}
        >
          💬
        </div>
      )}

      {chatOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <span>ChatBot</span>
            <button onClick={() => setChatOpen(false)}>✕</button>
          </div>

          {/* Content */}
          <div className={styles.chatContent}>
            {aiResponse?.error ? (
              <p className="text-sm text-red-500">{aiResponse.error.description}</p>
            ) : aiResponse?.business_search ? (
              <>
                <p className="text-gray-800 font-semibold mb-4">
                  {aiResponse.business_search.description}
                </p>
                <div>
                  {aiResponse.business_search.businesses.map((business) => (
                    <div key={business.id} className={styles.businessCard}>
                      <img
                        src={business.photos?.[0]?.original_url || ""}
                        alt={business.name}
                      />
                      <div>
                        <h3>{business.name}</h3>
                        <p>{business.location.formatted_address}</p>
                        <p>
                          Rating: {business.rating} | Price:{" "}
                          {business.price || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Ask me anything!</p>
            )}
          </div>

          {/* Input */}
          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Type your question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={fetchAIChat}>
              {loading ? "Loading..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}