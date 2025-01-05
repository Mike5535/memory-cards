export const gameConfig = {
  width: 1280,
  height: 720,
  levelParams: [
    {
      rows: 2,
      cols: 2,
      cards: [1, 2],
      timeout: 15,
    },
    {
      rows: 2,
      cols: 3,
      cards: [1, 2, 3],
      timeout: 20,
    },
    {
      rows: 2,
      cols: 4,
      cards: [1, 2, 3, 4],
      timeout: 25,
    },
    {
      rows: 2,
      cols: 5,
      cards: [1, 2, 3, 4, 5],
      timeout: 30,
    },
    {
      rows: 2,
      cols: 5,
      cards: [1, 2, 3, 4, 5],
      timeout: 25,
    },
    {
      rows: 2,
      cols: 5,
      cards: [1, 2, 3, 4, 5],
      timeout: 20,
    },
    {
      rows: 2,
      cols: 5,
      cards: [1, 2, 3, 4, 5],
      timeout: 15,
    },
  ],
  scoreBySuccessFolowingOpens: [
    100, 250, 500, 1000, 5000
  ]
}
