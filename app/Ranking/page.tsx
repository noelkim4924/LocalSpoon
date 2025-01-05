"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Rating, Avatar, Typography, Box } from "@mui/material";
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
        <Typography>No data.</Typography>
      ) : (
        <div className="flex justify-between items-start w-full px-10 gap-10 relative mt-36">
          <div className="flex flex-col items-center w-[55%] relative">
            {/* Rank 1 */}
            <div
              className="flex flex-col items-center absolute z-10"
              style={{
                top: "-25%",
                left: "26.5%",
              }}
            >
              <Avatar
                src={ranking[0]?.imageUrl || ""}
                alt={ranking[0]?.name || "N/A"}
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid #D9D9D9",
                }}
              />
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: "150px",
                  minHeight: "60px",
                  backgroundColor: "#857777",
                  borderRadius: "10px",
                  textAlign: "center",
                  overflow: "hidden",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  boxShadow: "0px 5px 6px rgba(0, 0, 0, 0.2)",
                  padding: "5px"
                }}
              >
                <Typography align="center" sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  color: "white",
                  wordBreak: "break-word",
                }}>
                  {ranking[0]?.name}
                </Typography>
                <Typography align="center" color="textSecondary" sx={{ fontSize: "10px", color: "white", wordBreak: "break-word" }}>
                  {ranking[0]?.category}
                </Typography>
                <Rating
                  value={ranking[0]?.rating || 0}
                  precision={0.1}
                  readOnly
                  size="small"
                />
              </Box>
            </div>

            {/* Rank 2 */}
            <div
              className="flex flex-col items-center absolute z-10"
              style={{
                top: "5%",
                left: "58%",
              }}
            >
              <Avatar
                src={ranking[1]?.imageUrl || ""}
                alt={ranking[1]?.name || "N/A"}
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid #D9D9D9",
                }}
              />
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: "150px",
                  minHeight: "60px",
                  backgroundColor: "#857777",
                  borderRadius: "10px",
                  textAlign: "center",
                  overflow: "hidden",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  boxShadow: "0px 5px 6px rgba(0, 0, 0, 0.2)",
                  padding: "5px"
                }}
              >
                <Typography align="center" sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  color: "white",
                  wordBreak: "break-word",
                }}>
                  {ranking[1]?.name}
                </Typography>
                <Typography align="center" color="textSecondary" sx={{ fontSize: "10px", color: "white", wordBreak: "break-word" }}>
                  {ranking[1]?.category}
                </Typography>
                <Rating
                  value={ranking[1]?.rating || 0}
                  precision={0.1}
                  readOnly
                  size="small"
                />
              </Box>
            </div>
            {/* Podium Image */}
            <Image
              src="/images/rank.png"
              alt="Podium"
              layout="intrinsic"
              width={500}
              height={300}
              className="relative bottom-50 left-1/3 transform -translate-x-1/2 z-0"
              priority
            />
          </div>

          {/* Table Section */}
          <div className="w-[45%] bg-white" style={{ opacity: 0.7, padding: "20px", borderRadius: "12px" }}>
            <table className="table-auto w-full">
              <thead
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #A99E9E",
                }}
              >
                <tr className="text-left">
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2">Restaurant</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {ranking.slice(2, 8).map((res, idx, arr) => (
                  <tr
                    key={res.id}
                    style={{
                      borderBottom: idx !== arr.length - 1 ? "1px solid #A99E9E" : "none", // No border for the last row
                    }}
                  >
                    <td className="px-4 py-2">{idx + 3}</td>
                    <td className="px-4 py-2">{res.name}</td>
                    <td className="px-4 py-2">{res.category}</td>
                    <td className="px-4 py-2">
                      <Rating
                        value={res.rating || 0}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                      <Image
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