import Phaser from 'phaser'
import { Card } from './components/Card/Card'
import { gameConfig } from './config'

export class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
        this.level = 1;
        this.score = 0;
        this.successFolowingOpens = 0;
    }

    preload() {
        this.load.image('bg', 'src/assets/sprites/background.png');
        this.load.image('card', 'src/assets/sprites/card.png');
        this.load.image('card1', 'src/assets/sprites/card1.png');
        this.load.image('card2', 'src/assets/sprites/card2.png');
        this.load.image('card3', 'src/assets/sprites/card3.png');
        this.load.image('card4', 'src/assets/sprites/card4.png');
        this.load.image('card5', 'src/assets/sprites/card5.png');

        this.load.audio('card', 'src/assets/sounds/card.mp3');
        this.load.audio('complete', 'src/assets/sounds/complete.mp3');
        this.load.audio('success', 'src/assets/sounds/success.mp3');
        this.load.audio('theme', 'src/assets/sounds/theme.mp3');
        this.load.audio('timeout', 'src/assets/sounds/timeout.mp3');
    }

    createText() {
        this.scoreText = this.add.text(10, 280, "", {
            font: '36px CurseCasual',
            fill: '#ffffff'
        });

        this.levelText = this.add.text(10, 340, "", {
            font: '36px CurseCasual',
            fill: '#ffffff'
        });

        this.timeoutText = this.add.text(10, 400, "", {
            font: '36px CurseCasual',
            fill: '#ffffff'
        });
    }

    updateScoreText() {
        this.scoreText.setText("Score: " + this.score);
    }

    updateLevelText() {
        this.levelText.setText("Level: " + this.level);
    }

    updateTimeText() {
        this.timeoutText.setText("Time: " + this.timeout);
    }

    onTimerTick() {
        this.updateTimeText();

        if (this.timeout <= 0) {
            this.timer.paused = true;
            this.sounds.timeout.play();
            this.restart();
        } else {
            --this.timeout;
        }
    }

    createTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        });
    }

    createSounds() {
        this.sounds = {
            card: this.sound.add('card'),
            complete: this.sound.add('complete'),
            success: this.sound.add('success'),
            theme: this.sound.add('theme'),
            timeout: this.sound.add('timeout'),
        };
        this.sounds.theme.play({volume: 0.1});
    }

    create() {
        this.timeout = gameConfig.levelParams[this.level - 1].timeout;
        this.createSounds();
        this.createBackground();
        this.createText();
        this.start();
    }

    restart() {
        let count = 0;
        let onCardMoveComplete = () => {
            ++count;
            if (count >= this.cards.length) {
                this.start();
                this.updateLevelText();
            }
        };
        this.cards.forEach(card => {
            // card.depth = 1/card.position.delay/100;
            card.move({
                x: this.sys.game.config.width + card.width,
                y: this.sys.game.config.height + card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete
            });
        });
    }

    start() {
        this.createTimer();
        this.createCards();
        this.initCardsPositions();
        this.timeout = gameConfig.levelParams[this.level - 1].timeout;
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.timer.paused = false;
        this.initCards();
        this.showCards();

        document.fonts.ready.then(() => {
            this.updateLevelText();
            this.updateScoreText();
        })
    }

    initCards() {
        let positions = Phaser.Utils.Array.Shuffle(this.positions);

        this.cards.forEach(card => {
            card.init(positions.pop());
        });
    }

    showCards() {
        this.cards.forEach(card => {
            card.depth = card.position.delay;
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay
            });
        });
    }

    createBackground() {
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    }

    createCards() {
        this.cards = [];

        for (let value of gameConfig.levelParams[this.level - 1].cards) {
            for (let i = 0; i < 2; i++) {
                this.cards.push(new Card(this, value));
            }
        }   

        this.input.on("gameobjectdown", this.onCardClicked, this);
    }

    onCardClicked(_, card) {
        if (card.opened) {
            return false;
        }

        this.sounds.card.play();

        if (this.openedCard) {
            // уже есть открытая карта
            if (this.openedCard.value === card.value) {
                // картинки равны - запомнить
                this.sounds.success.play();
                this.openedCard = null;
                ++this.openedCardsCount;
                this.score += gameConfig.scoreBySuccessFolowingOpens[this.successFolowingOpens];
                this.successFolowingOpens = this.successFolowingOpens < 4? this.successFolowingOpens + 1: this.successFolowingOpens;
            } else {
                // картинки разные - скрыть прошлую
                this.openedCard.close();
                this.openedCard = card;
                this.successFolowingOpens = 0;
            }

            this.updateScoreText();
        } else {
            // еще нет открытой карта
            this.openedCard = card;
        }

        card.open(() => {
            if (this.openedCardsCount === this.cards.length / 2) {
                this.onWinGame();
            }
        });
    }

    onWinGame() {
        this.timer.reset();
        this.sounds.complete.play();
        this.level = this.level < 7? this.level + 1: this.level;
        this.restart();
    }
    
    initCardsPositions() {
        let positions = [];
        let cardTexture = this.textures.get('card').getSourceImage();
        let cardWidth = cardTexture.width + 4;
        let cardHeight = cardTexture.height + 4;
        let offsetX = (this.sys.game.config.width - cardWidth * gameConfig.levelParams[this.level - 1].cols) / 2 + cardWidth / 2;
        let offsetY = (this.sys.game.config.height - cardHeight * gameConfig.levelParams[this.level - 1].rows) / 2 + cardHeight / 2;

        let id = 0;
        for (let row = 0; row < gameConfig.levelParams[this.level - 1].rows; row++) {
            for (let col = 0; col < gameConfig.levelParams[this.level - 1].cols; col++) {
                ++id;
                positions.push({
                    delay: id * 100,
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight,
                });
            }
        }

        this.positions = positions;
    }
}
