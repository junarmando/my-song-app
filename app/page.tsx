"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./script.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove the script if the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="player-container">
      <h1>Future in the Glimmer</h1>
      <div className="subtitle">Text to speech with a beat.</div>

      <div id="lyrics-window">
        <div id="lyrics-content"></div>
      </div>

      <div id="controls">
        <button id="start-btn">Start Performance</button>
        <div id="playback-controls">
          <button id="pause-btn">Pause</button>
          <button id="stop-btn">Stop</button>
          <button id="restart-btn">Restart</button>
        </div>
      </div>

      <canvas id="visualizer"></canvas>
    </div>
  );
}
