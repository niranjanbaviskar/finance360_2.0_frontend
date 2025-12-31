"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NewsItem from "./NewsItem";
import NewsLoader from "./NewsLoader";

const API_KEY = "d1d76628090f44caac49652923298fcc"; // Replace with your API key
const API_URL = `https://newsapi.org/v2/top-headlines?category=business&language=en&apiKey=${API_KEY}`;

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(API_URL);
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-center mb-6">Latest Financial News</h1>
      {loading ? (
        <NewsLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <NewsItem key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
