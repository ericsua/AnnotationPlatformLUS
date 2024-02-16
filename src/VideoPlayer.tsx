import React from "react";
import ReactPlayer from "react-player";
import { Component } from "react";
import "./VideoPlayer.css";

class ResponsivePlayer extends Component {
    render() {
      return (
        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            url={"src/assets/clip.mp4"}
            controls={true}
            loop={true}
            width="100%"
            height="100%"
          />
        </div>
      );
    }
  }

// Render a YouTube video player
export default function VideoPlayer() {
  return (
    <ResponsivePlayer />
  );
}


