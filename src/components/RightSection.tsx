"use client";
import React, { useState } from "react";
import styles from "@/styles/RightSection.module.css";
import robot from "@/assets/robot (1).png";
import robot2 from "@/assets/bot.png";
import nouserlogo from "@/assets/profile (1).png";
import Image from "next/image";

const openAiAPI = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const RightSection = () => {
  const [message, setMessage] = useState("");

  const [allMessages, setAllMessages] = useState<any[]>([]);

  const [loading, setLoading] = useState(false); // State to track loading status

  const sendMessage = async () => {
    setLoading(true); // Set loading to true when sending message
    let url = "https://api.openai.com/v1/chat/completions";

    let token = `Bearer ${openAiAPI}`;
    let model = "gpt-3.5-turbo";

    let messagesToSend = [
      ...allMessages,
      {
        role: "user",
        content: message,
      },
    ];

    let res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messagesToSend,
      }),
    });
    let resjson = await res.json();
    if (resjson) {
      let newAllMessages = [...messagesToSend, resjson.choices[0].message];

      setAllMessages(newAllMessages);
      setMessage("");
    }
    setLoading(false); // Set loading to false when response is received
  };
  return (
    <div className={styles.rightSection}>
      <div className={styles.chatgptversion}>
        <Image src={robot} alt="logo" height={50} width={50} />
        <p className={styles.text1}>AI ChatBot</p>
      </div>

      {allMessages.length > 0 ? (
        <div className={styles.messages}>
          {allMessages.map((msg, index) => (
            <div key={index} className={styles.message}>
              {loading && <div className={styles.loadingSpinner}></div>}{" "}
              {/* Render loading spinner if loading is true */}
              <Image
                src={msg.role === "user" ? nouserlogo : robot2}
                width={50}
                height={50}
                alt=""
              />
              <div className={styles.details}>
                <h2>{msg.role === "user" ? "You" : "ChatBot"}</h2>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.nochat}>
          {loading && <div className={styles.loadingSpinner}></div>}{" "}
          {/* Render loading spinner if loading is true */}
          <div className={styles.s1}>
            <Image src={robot} alt="bot" height={70} width={70} />
            <h1>How can I help you today?</h1>
          </div>
        </div>
      )}

      <div className={styles.bottomsection}>
        <div className={styles.messagebar}>
          <input
            type="text"
            placeholder="Ask me anything :D ..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <svg
            onClick={sendMessage}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
            />
          </svg>
        </div>
        <p>
          Chatbot may give incorrect information, consider finding valid
          information.
        </p>
      </div>
    </div>
  );
};

export default RightSection;
