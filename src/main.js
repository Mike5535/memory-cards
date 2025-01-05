import './index.css'
import Phaser from 'phaser'
import { GameScene } from "./GameScene"
import { gameConfig } from "./config"

const config = {
  ...gameConfig,
  type: Phaser.AUTO,
  scene: new GameScene()
}

new Phaser.Game(config)
