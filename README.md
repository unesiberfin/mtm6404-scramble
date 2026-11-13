# Scramble

## Objective
Using React and local storage, create an interactive version of the game Scramble.

## Run the game

Open `index.html` with VS Code's Live Server extension. Alternatively, run this
command from the repository folder, then open <http://127.0.0.1:8000>:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

The starter loads React 18, ReactDOM, and Babel from CDN scripts. An internet
connection is needed. No installation or build command is required.

## Rules

- Each round has 12 nature words containing only letters.
- A correct guess earns one point and removes the word.
- A wrong guess adds one strike and keeps the same scrambled letters.
- Each round starts with 3 passes and ends at 3 strikes or when no words remain.
- A pass removes the word without adding points or strikes.
- Enter submits a guess. Uppercase and lowercase guesses both work.
- An empty guess does not add a strike.
- Play Again resets the round without refreshing the page.

The assignment instructions and rubric do not specify numeric strike or pass
limits, so this version uses 3 of each.

## How the code works

`index.html` keeps the starter scripts and adds the `root` element where React
displays the game. `style.css` controls the layout, colours, readable controls,
and narrow-screen layout.

`app.js` keeps the instructor's `shuffle()` function unchanged. `createNewGame()`
shuffles a copy of the full word list. The first item in `remainingWords` is the
current answer. `scrambleWord()` uses `shuffle()` to mix its letters.

The `App` function uses `useState` to track the counts, words, scramble, textbox,
and feedback. The textbox is controlled: its `value` comes from `guess`, and
`onChange` updates `guess` as the player types.

`handleGuess()` stops the form refresh with `preventDefault()`, trims spaces,
and compares lowercase versions of the guess and answer. It clears the textbox
after submitting. Only a correct guess or a pass calls `advanceWord()`, which
uses `slice(1)` to make a new array without the current word. A wrong guess
leaves both the answer and scramble alone.

`useEffect` saves points, strikes, passes remaining, the remaining words array,
and the current scramble together under the `scrambleGame` localStorage key.
`JSON.stringify()` turns that object into text for storage. On page load,
`JSON.parse()` turns the stored text back into an object for the initial state.
Refresh therefore restores the exact same round. Use the same browser and
server address to resume it.

`gameOver` checks whether the list is empty or the strike limit has been reached.
Conditional rendering then shows the result and Play Again button. Play Again
creates a fresh round and updates every saved game value.

## Verification

Checked in Chrome using the starter's CDN setup and a local HTTP server:

- Incorrect Enter guesses add strikes, clear the input, and preserve the exact scramble.
- An uppercase correct Enter guess adds a point, clears the input, and advances.
- Passes decrease and remove words without changing points or strikes.
- At zero passes, the disabled pass button does not advance the game.
- Refresh restores points, strikes, passes, remaining word count, and exact letters.
- Reaching 3 strikes ends the game; refreshing preserves that finished round.
- Solving all 12 words ends the game with 12 points and no repeated words.
- Play Again works after both endings and restores 0 points, 0 strikes, 3 passes, and all 12 words.
- Submitting an empty textbox gives feedback without adding a strike.

Still check the layout on your phone and in any other browser you plan to use.
Commit, push, and Brightspace submission remain manual. The assignment asks for
the commit message `Completes the assignment.` and your GitHub repository URL.

## Course references

- [Weekly course material through Week 10](https://imdac.github.io/mtm6404/content/#week-10)
- [Course form handling examples](https://imdac.github.io/modules/react/form-handling/)
- [Course localStorage examples](https://imdac.github.io/modules/js/js-localstorage/)
- [Instructor's starter repository](https://github.com/imdac/mtm6404-scramble)
- [Scramble instructions and rubric (Brightspace login required)](https://brightspace.algonquincollege.com/d2l/lms/dropbox/user/folder_submit_files.d2l?db=858215&grpid=0&isprv=0&bp=0&ou=931895)
