export const mockSavedGames = [
  {
    id: 1,
    gameTitle: 'Seinfeld Escape',
    gameDescription: 'Dodge the Soup Nazi: Can you escape?',
    timeLimit: 600,
    titleBg: 'yellow',
    bodyBg: 'green',
    numberOfChallenges: 3,
    challenges: [
      {
        id: 'Challenge 1',
        type: 'Trivia',
        description: 'Test your Seinfeld knowledge',
        clue: "Who is Jerry's next door neighbour?",
        answer: 'Kramer',
      },
      {
        id: 'Challenge 2',
        type: 'Word Scramble',
        description: 'Unscramble this Seinfeld quote',
        clue: ['These', 'pretzels', 'are', 'making', 'me', 'thirsty'],
        answer: 'These pretzels are making me thirsty',
      },
      {
        id: 'Challenge 3',
        type: 'Caesar Cypher',
        description: "Decode this Seinfeld character's name",
        clue: ['q', 'h', 'z', 'p', 'd', 'q'],
        answer: 'Newman',
      },
    ],
  },
  {
    id: 2,
    gameTitle: '3rd Rock Riddles',
    gameDescription: 'Embark on an interstellar adventure with the Solomons!',
    timeLimit: 600,
    titleBg: 'purple',
    bodyBg: 'silver',
    numberOfChallenges: 3,
    challenges: [
      {
        id: 'Challenge 1',
        type: 'Trivia',
        description: 'Test your knowledge about the Solomons',
        clue: "Who is the High Commander of the mission?",
        answer: 'Dick Solomon',
      },
      {
        id: 'Challenge 2',
        type: 'Word Scramble',
        description: 'Rearrange these words to form a quote from the show',
        clue: ['physics', 'is', 'sexy', 'theoretical'],
        answer: 'Theoretical physics is sexy',
      },
      {
        id: 'Challenge 3',
        type: 'Caesar Cypher',
        description: 'Decrypt the name of the only female alien in the crew',
        clue: ['v', 'l', 'z', 'h', 's', 'b'],
        answer: 'Sally',
      },
    ],
  },
  {
    id: 3,
    gameTitle: 'Family Matters Mystery',
    gameDescription: 'Solve challenges in the Winslow household!',
    timeLimit: 600,
    titleBg: 'blue',
    bodyBg: 'pink',
    numberOfChallenges: 3,
    challenges: [
      {
        id: 'Challenge 1',
        type: 'Trivia',
        description: 'Identify the Winslows’ quirky neighbor',
        clue: "Who always says 'Did I do that?'",
        answer: 'Steve Urkel',
      },
      {
        id: 'Challenge 2',
        type: 'Word Scramble',
        description: 'Unscramble this famous catchphrase',
        clue: ['do', 'I', 'that', 'did', '?'],
        answer: 'Did I do that ?',
      },
      {
        id: 'Challenge 3',
        type: 'Caesar Cypher',
        description: 'Decrypt the name of the Winslows’ son',
        clue: ['l', 'k', 'k', 'p', 'l'],
        answer: 'Eddie',
      },
    ],
  },
];
