import React from "react";
import Image from "next/image";

const NewsItem = ({ article }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
      {article.urlToImage && (
        <Image src={article.urlToImage} alt="News" width={500} height={300} className="w-full h-48 object-cover" />
      )}
      <h2 className="text-xl font-bold mt-2">{article.title}</h2>
      <p className="text-gray-600 text-sm mt-2">{article.description}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="block mt-4 text-blue-500 font-medium">
        Read More →
      </a>
    </div>
  );
};

export default NewsItem;
