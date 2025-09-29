import React, { useEffect, useRef, useState } from "react";
import { Send, Camera, Image, Smile, MoreVertical, X } from "lucide-react";

// Mock initial messages
const initialMessages = [
  { id: 1, sender: "friend", text: "Hey! How's it going?", time: "10:30 AM" },
  { id: 2, sender: "me", text: "Good! You?", time: "10:31 AM" },
  {
    id: 3,
    sender: "friend",
    text: "All good, just chilling 😎",
    time: "10:32 AM",
  },
];

// Sample friend replies (used for auto-responses)
const friendReplies = [
  "That's awesome! 🎉",
  "Yeah, I totally agree!",
  "Haha, that's funny 😂",
  "No way! Really? 😮",
  "Nice! Tell me more",
  "I'm down for that!",
  "Sounds good to me 👍",
  "OMG yes! 💯",
  "Let's do it!",
  "That's so cool!",
  "For real though",
  "I feel you",
  "Same here!",
  "Absolutely!",
];

// Emoji list for the emoji picker
const emojiList = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "😚",
  "😙",
  "😋",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  "🤨",
  "😐",
  "😑",
  "😶",
  "😏",
  "😒",
  "🙄",
  "😬",
  "🤥",
  "😌",
  "😔",
  "😪",
  "🤤",
  "😴",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "🥵",
  "🥶",
  "😎",
  "🤓",
  "🧐",
  "😕",
  "😟",
  "🙁",
  "☹️",
  "😮",
  "😯",
  "😲",
  "😳",
  "🥺",
  "😦",
  "😧",
  "😨",
  "😰",
  "😥",
  "😢",
  "😭",
  "😱",
  "😖",
  "😣",
  "😞",
  "😓",
  "😩",
  "😫",
  "🥱",
  "👍",
  "👎",
  "👌",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👈",
  "👉",
  "👆",
  "👇",
  "☝️",
  "✋",
  "🤚",
  "🖐️",
  "🖖",
  "👋",
  "🤝",
  "💪",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "❣️",
  "💕",
  "💞",
  "💓",
  "💗",
  "💖",
  "💘",
  "💝",
  "🔥",
  "✨",
  "⭐",
  "🌟",
  "💫",
  "💥",
  "💯",
  "🎉",
  "🎊",
  "🎈",
  "🎁",
  "🏆",
];

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const chatEndRef = useRef(null);
  const videoRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Simulate friend typing and replying when user sends a message
  useEffect(() => {
    if (
      messages.length > initialMessages.length &&
      messages[messages.length - 1].sender === "me"
    ) {
      setIsTyping(true);

      // Show typing for 1.5-2.5 seconds, then send a random reply
      const typingDuration = 1500 + Math.random() * 1000;

      const timer = setTimeout(() => {
        setIsTyping(false);

        // Send friend's reply after typing stops
        const randomReply =
          friendReplies[Math.floor(Math.random() * friendReplies.length)];
        const friendMessage = {
          id: Date.now(),
          sender: "friend",
          text: randomReply,
          time: getCurrentTime(),
        };

        setMessages((prev) => [...prev, friendMessage]);
      }, typingDuration);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: input.trim(),
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setShowEmojiPicker(false); // Close emoji picker when sending
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji);
  };

  const handleCameraOpen = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log(err);
      alert("Camera access denied or not available");
    }
  };

  const handleCameraClose = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);

      const newMessage = {
        id: Date.now(),
        sender: "me",
        text: "📷 Photo captured!",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, newMessage]);
      handleCameraClose();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Creative animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      {/* Header with Snapchat-style design */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg relative z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                F
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">Friend</h1>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
        {messages.map((msg, index) => {
          const showTime =
            index === 0 || messages[index - 1].sender !== msg.sender;

          return (
            <div key={msg.id}>
              {showTime && (
                <div className="text-center text-xs text-white/70 font-medium mb-2">
                  {msg.time}
                </div>
              )}
              <div
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                } animate-[slideIn_0.3s_ease-out]`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-3xl shadow-lg transform transition-all hover:scale-105 ${
                    msg.sender === "me"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">
                    {msg.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-[slideIn_0.3s_ease-out]">
            <div className="bg-white rounded-3xl rounded-bl-md px-5 py-3 shadow-lg">
              <div className="flex space-x-1.5">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area with Snapchat-style controls */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 relative z-10">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 max-h-64 overflow-y-auto animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Emojis</h3>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {emojiList.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition-all active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEmojiPicker(false)}
            className="p-2.5 hover:bg-gray-100 rounded-full transition-all active:scale-95"
          >
            <Image className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleCameraOpen}
            className="p-2.5 hover:bg-gray-100 rounded-full transition-all active:scale-95"
          >
            <Camera className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full px-5 py-3 bg-gray-100 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all text-sm"
              placeholder="Send a chat..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <button
            className={`p-3 rounded-full transition-all shadow-lg active:scale-95 ${
              input.trim()
                ? "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                : "bg-gray-200"
            }`}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send
              className={`w-5 h-5 ${
                input.trim() ? "text-white" : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl max-h-screen p-4">
            <button
              onClick={handleCameraClose}
              className="absolute top-8 right-8 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />

            <button
              onClick={handleCapture}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center"
            >
              <div className="w-14 h-14 border-4 border-gray-800 rounded-full"></div>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
