import BaseGameEngine from "./BaseGameEngine";
import soundPaths from "./resources/soundPaths";
import spritePaths from "./resources/spritePaths";
import dataPaths from "./resources/dataPaths";

const SPRITE_SPEED = 0.1; // in pixels per ms

class GameEngine extends BaseGameEngine {
  gameState = { x: 0, y: 0, dirX: 1, dirY: 1 };

  renderContent(timeSincePreviousFrame: number): void {
    const { x, y, dirX, dirY } = this.gameState;
    const newX = Math.round(x + timeSincePreviousFrame * dirX * SPRITE_SPEED);
    const newY = Math.round(y + timeSincePreviousFrame * dirY * SPRITE_SPEED);

    this.gameState.x = newX;
    this.gameState.y = newY;

    if (newX > 200) this.gameState.dirX = -1;
    if (newY > 200) this.gameState.dirY = -1;
    if (newX < 0) this.gameState.dirX = 1;
    if (newY < 0) this.gameState.dirY = 1;

    this.canvasContext.drawImage(this.sprites.test, newX, newY);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const canvas: HTMLCanvasElement = document.querySelector("#canvas");

  const engine = new GameEngine(canvas);
  engine.spritePaths = spritePaths;
  engine.soundPaths = soundPaths;
  engine.gameDataPaths = dataPaths;

  engine.initialize();
});
