"use client";

import React from "react";
import { motion } from "framer-motion";

function ResponseBox({ chatHistory }) {
  return (
    <div className="relative mt-6 p-6 w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 text-white text-xl">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur-xl opacity-50"></div>

      {/* Chat Messages */}
      <div className="relative z-10 max-h-80 overflow-y-auto space-y-4 p-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
        {(chatHistory?.length ?? 0) > 0 ? (
          chatHistory.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-5 rounded-xl shadow-md max-w-[80%] text-lg font-semibold ${
                msg.role === "user"
                  ? "bg-blue-600 self-end ml-auto"
                  : "bg-gray-800 self-start mr-auto"
              }`}
            >
              <p className="text-lg font-medium">{msg.content}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-300 text-center animate-pulse text-lg">
            Awaiting response...
          </p>
        )}
      </div>
    </div>
  );
}

export default ResponseBox;
