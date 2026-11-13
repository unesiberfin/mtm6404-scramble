/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const startingWords = [
  'planet',
  'garden',
  'forest',
  'ocean',
  'meadow',
  'sunset',
  'river',
  'flower',
  'mountain',
  'island',
  'breeze',
  'cloud'
]

const strikeLimit = 3
const startingPasses = 3
const storageKey = 'scrambleGame'

function scrambleWord (word) {
  let scrambledWord = shuffle(word)

  // Shuffle again if the letters happen to stay in their original order.
  while (scrambledWord === word) {
    scrambledWord = shuffle(word)
  }

  return scrambledWord
}

function createNewGame () {
  const remainingWords = shuffle(startingWords)

  return {
    points: 0,
    strikes: 0,
    passesRemaining: startingPasses,
    remainingWords: remainingWords,
    scrambledWord: scrambleWord(remainingWords[0])
  }
}

// Read the saved round once, before React renders the game.
const savedGame = JSON.parse(localStorage.getItem(storageKey))
const initialGame = savedGame || createNewGame()

function App () {
  const [points, setPoints] = React.useState(initialGame.points)
  const [strikes, setStrikes] = React.useState(initialGame.strikes)
  const [passesRemaining, setPassesRemaining] = React.useState(initialGame.passesRemaining)
  const [remainingWords, setRemainingWords] = React.useState(initialGame.remainingWords)
  const [scrambledWord, setScrambledWord] = React.useState(initialGame.scrambledWord)
  const [guess, setGuess] = React.useState('')
  const [feedback, setFeedback] = React.useState(
    savedGame ? 'Your saved round has been restored.' : 'Ready? Your first word is waiting.'
  )

  const gameOver = remainingWords.length === 0 || strikes >= strikeLimit

  // Save all five parts together whenever the round changes.
  React.useEffect(() => {
    const game = {
      points: points,
      strikes: strikes,
      passesRemaining: passesRemaining,
      remainingWords: remainingWords,
      scrambledWord: scrambledWord
    }

    localStorage.setItem(storageKey, JSON.stringify(game))
  }, [points, strikes, passesRemaining, remainingWords, scrambledWord])

  function handleGuessChange (event) {
    setGuess(event.target.value)
  }

  function advanceWord () {
    // The first word is always the current answer. Remove it with a new array.
    const nextWords = remainingWords.slice(1)
    setRemainingWords(nextWords)

    if (nextWords.length > 0) {
      setScrambledWord(scrambleWord(nextWords[0]))
    } else {
      setScrambledWord('')
    }
  }

  function handleGuess (event) {
    event.preventDefault()
    const submittedGuess = guess.trim().toLowerCase()
    setGuess('')

    if (gameOver) {
      return
    }

    if (submittedGuess === '') {
      setFeedback('Type a word before submitting. No strike added.')
      return
    }

    if (submittedGuess === remainingWords[0].toLowerCase()) {
      setPoints(points + 1)
      setFeedback(`Correct! The word was ${remainingWords[0]}. One point added.`)
      advanceWord()
    } else {
      setStrikes(strikes + 1)
      if (strikes + 1 >= strikeLimit) {
        setFeedback('Not quite. One strike added. That was your last strike.')
      } else {
        setFeedback('Not quite. One strike added. Try the same letters again.')
      }
      // Leave both the current word and its exact scramble unchanged.
    }
  }

  function handlePass () {
    if (gameOver || passesRemaining === 0) {
      return
    }

    setPassesRemaining(passesRemaining - 1)
    setGuess('')
    setFeedback(`Passed. The word was ${remainingWords[0]}. No point or strike added.`)
    advanceWord()
  }

  function handlePlayAgain () {
    const newGame = createNewGame()
    setPoints(newGame.points)
    setStrikes(newGame.strikes)
    setPassesRemaining(newGame.passesRemaining)
    setRemainingWords(newGame.remainingWords)
    setScrambledWord(newGame.scrambledWord)
    setGuess('')
    setFeedback('Fresh letters, fresh start. Give it a go!')
  }

  return (
    <main className="game">
      <header className="game-header">
        <p className="eyebrow">A little word play</p>
        <h1>Scramble<span>.</span></h1>
        <p>Untangle the letters. Find the word.</p>
      </header>

      <dl className="counts" aria-label="Game counts">
        <div>
          <dt>Points</dt>
          <dd>{points}</dd>
        </div>
        <div>
          <dt>Strikes</dt>
          <dd>{strikes} <span>/ {strikeLimit}</span></dd>
        </div>
        <div>
          <dt>Passes left</dt>
          <dd>{passesRemaining}</dd>
        </div>
      </dl>

      <section className="play-area" aria-label="Word game">
        {gameOver ? (
          <div className="game-result">
            <p className="eyebrow">Round complete</p>
            <h2>{strikes >= strikeLimit ? 'Out of strikes!' : 'All words cleared!'}</h2>
            <p>
              {strikes >= strikeLimit
                ? `You reached the ${strikeLimit}-strike limit.`
                : 'You made it through the whole word list.'}
              {' '}You earned {points} {points === 1 ? 'point' : 'points'}.
            </p>
            <button type="button" onClick={handlePlayAgain}>Play Again</button>
          </div>
        ) : (
          <React.Fragment>
            <p className="word-count">{remainingWords.length} of {startingWords.length} words remaining</p>
            <p className="scrambled-word" aria-label={`Scrambled letters: ${scrambledWord.split('').join(' ')}`}>
              {scrambledWord}
            </p>
            <form onSubmit={handleGuess}>
              <label htmlFor="guess">Your guess</label>
              <input
                id="guess"
                name="guess"
                type="text"
                value={guess}
                onChange={handleGuessChange}
                placeholder="Type the unscrambled word"
                aria-describedby="guess-hint"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                autoFocus
              />
              <p id="guess-hint" className="hint">Press Enter or choose Check Guess.</p>
              <div className="actions">
                <button type="submit">Check Guess</button>
                <button
                  className="pass-button"
                  type="button"
                  onClick={handlePass}
                  disabled={passesRemaining === 0}
                >
                  Pass ({passesRemaining} left)
                </button>
              </div>
            </form>
          </React.Fragment>
        )}

        <p className="feedback" role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
      </section>

      <footer>
        <p>One correct word = one point. {strikeLimit} strikes ends the round.</p>
        <p>You get {startingPasses} passes. Your round is saved automatically in this browser.</p>
      </footer>
    </main>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
