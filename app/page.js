"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState(""); // "create" or "visit"
  const router = useRouter();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasSeenReadmeAlert");
    if (!hasVisited) {
      alert("📘 Please go through the README file before using the website!\n\nJust click on the \"Home\" button to see it.");
      localStorage.setItem("hasSeenReadmeAlert", "true");
    }
  }, []);

  const handleAction = async () => {
    const slug = username.trim();
    if (!slug) return;

    const res = await fetch(`/api/user/${slug}`);
    const data = await res.json();

    if (mode === "create") {
      if (data.exists) {
        const isOwner = confirm("This username already exists.\n\nClick OK if it's yours and you want to edit it.\nClick Cancel to choose another username.");
        if (isOwner) {
          const enteredPassword = prompt("Enter your password:");
          if (!enteredPassword) return;

          const resVerify = await fetch(`/api/user/${slug}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: enteredPassword })
          });

          const result = await resVerify.json();

          if (result.success) {
            router.push(`/users/${slug}?edit=true`);
          } else {
            alert("Password is incorrect. You cannot edit this InfoTree.");
          }
        } else {
          alert("Please choose a different username.");
        }
        return;
      } else {
        router.push(`/users/${slug}`);
      }
    }
    else if (mode === "visit") {
      if (data.exists) {
        router.push(`/users/${slug}`);
      } else {
        alert("No InfoTree found for this username.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full flex">
        {/* 🧩 Left Column */}
        <section className="w-[58vw]">
          <div className="text-6xl text-lime-300 font-bold px-10 w-[55vw] my-5">
            Get a simple link to manage all your profiles, social media handles, work-projects etc.
          </div>
          <div className="text-2xl text-white font-bold px-10 w-[55vw] my-5">
            One link to help you share everything you create, curate and design from your Instagram, TikTok, Twitter, YouTube and other social media profiles.
          </div>

          {/* 💡 Mode Selector */}
          {!mode && (
            <div className="flex gap-4 px-10 mt-4">
              <button
                onClick={() => setMode("create")}
                className="bg-green-400 hover:bg-green-500 text-black font-bold px-4 py-3 rounded-xl cursor-pointer"
              >
                Create New InfoTree
              </button>
              <button
                onClick={() => setMode("visit")}
                className="bg-blue-400 hover:bg-blue-500 text-black font-bold px-4 py-3 rounded-xl cursor-pointer"
              >
                Visit already saved InfoTrees
              </button>
            </div>
          )}

          {/* 🔠 Username Input */}
          {mode && (
            <div className="input flex w-[58vw] mt-10 px-10 gap-2">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-1/2 px-4 py-4 border-3 border-white rounded-xl shadow-sm text-gray-800 bg-white font-bold cursor-pointer"
              />
              <button
                onClick={handleAction}
                className="border-2 border-pink-300 bg-pink-300 px-4 py-3 text-gray-900 font-bold rounded-2xl cursor-pointer"
              >
                {mode === "create" ? "Claim your InfoHub" : "Visit InfoTree"}
              </button>
              <button
                onClick={() => {
                  setMode("");
                  setUsername("");
                }}
                className="mt-3 mb-3 px-4 py-2 text-gray-900 font-semibold border border-white rounded-xl bg-white transition cursor-pointer"
              >
                ← Go Back
              </button>
            </div>
          )}
        </section>

        {/* 🖼️ Right Column Image */}
        <img
          src="./coverImage.webp"
          alt="img"
          className="w-[39vw] h-[68vh] mt-3 mb-3"
        />
      </div>

      <div className="text-center text-white mt-6 text-2xl font-bold">
        "Arrange everything You Do, In One Place !"
      </div>
    </>
  );
}
