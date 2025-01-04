import { useEffect, useRef } from "react"
import Phaser from 'phaser'
import { GameScene } from "./GameScene"
import { gameConfig } from "./config"

let game

export const App = () => {
  const rootRef = useRef()
  
  useEffect(() => {
    if (!game) {
      const config = {
        ...gameConfig,
        type: Phaser.AUTO,
        scene: new GameScene()
      }
  
      game = new Phaser.Game(config)
    }

  }, [])

  return <div ref={rootRef}/>
}