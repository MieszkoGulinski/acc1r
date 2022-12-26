import { loadSounds, loadSprites, loadGameData } from "./assetsLoading";

// Reusable platform game engine, not specific to any game
// Accepts all game content and logic with inheritance

class BaseGameEngine {
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  prevTimestamp: number;
  isPaused: boolean = false;

  canvasWidth: number;
  canvasHeight: number;

  // Resource paths
  spritePaths: Record<string, string> = {};
  soundPaths: Record<string, string> = {};
  gameDataPaths: Record<string, string> = {};

  // Resources
  sprites: Record<string, HTMLImageElement> = {};
  sounds: Record<string, HTMLAudioElement> = {};
  gameData: Record<string, unknown> = {}; // to be casted into specific types

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasContext = canvas.getContext("2d");
  }

  async initialize() {
    this.syncCanvasSize();
    document.addEventListener("resize", this.syncCanvasSize);

    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);

    try {
      this.sprites = await loadSprites(this.spritePaths);
      this.sounds = await loadSounds(this.soundPaths);
      this.gameData = await loadGameData(this.gameDataPaths);

      // start main loop
      requestAnimationFrame(this.handleAnimationFrame);
    } catch (err) {
      console.log(err.target);
      if (err?.target?.src) {
        this.displayError("Error loading asset: " + err?.target?.src);
      } else {
        this.displayError("Error initializing game engine");
      }
      // display error here
      console.error(err);
    }
  }

  syncCanvasSize = () => {
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
  };

  displayError(errorMsg: string) {
    this.canvasContext.fillStyle = "black";
    this.canvasContext.font = "30px";
    this.canvasContext.textAlign = "left";
    this.canvasContext.textBaseline = "top";
    this.canvasContext.fillText(errorMsg, 0, 0);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    console.log("down", event.key); // " " for space; Escape, ArrowUp
  };

  handleKeyUp = (event: KeyboardEvent) => {
    console.log("up", event.key);
  };

  handleAnimationFrame = (timestamp: number) => {
    const timeSincePreviousFrame =
      this.prevTimestamp === undefined ? 0 : timestamp - this.prevTimestamp;

    if (!this.isPaused) this.renderContent(timeSincePreviousFrame);

    this.prevTimestamp = timestamp;
    requestAnimationFrame(this.handleAnimationFrame);
  };

  renderContent(timeSincePreviousFrame: number) {
    // TODO mark to be replaced
  }
}

export default BaseGameEngine;
