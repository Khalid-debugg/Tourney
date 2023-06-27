const run = () => {
  const tourTitle = localStorage.getItem("tourTitle");
  document.querySelector(
    "h1"
  ).textContent = `Welcome to "${tourTitle}" tournament!!`;
  const brackets = [];
  buildBrackets(brackets);
  drawBrackets(brackets);
};
const updateBrackets = (brackets, btn) => {
  let roundId = btn.getAttribute("data-roundIndex");
  let bracketId = btn.getAttribute("data-bracketIndex");
  let playerId = parseInt(btn.getAttribute("data-playerIndex"));
  const player = brackets[roundId][bracketId][playerId];
  let indexInRound = bracketId * 2 + playerId;
  let newindexInRound = Math.floor(indexInRound / 2);
  bracketId = Math.floor(newindexInRound / 2);
  playerId = newindexInRound % 2;
  roundId++;
  brackets[roundId][bracketId][playerId] = player;
  const main = document.querySelector("main");
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  drawBrackets(brackets);
};
const buildBrackets = (brackets) => {
  let participantsNo = localStorage.getItem("participantsNo");
  const participants = JSON.parse(localStorage.getItem("participants"));
  const numberOfRounds = Math.ceil(Math.log2(participantsNo));
  let playersPerRound = 2 ** Math.ceil(Math.log2(participantsNo));
  const byes = playersPerRound - participantsNo;
  shufflePlayers(participants);
  insertByes(participants, byes);
  for (let i = 1; i <= numberOfRounds; i++) {
    let round = [];
    for (let j = 0; j < playersPerRound; j += 2) {
      let bracket = [];
      if (i === 1) {
        bracket.push(participants[j], participants[j + 1]);
      } else {
        bracket.push("TBD", "TBD");
      }
      round.push(bracket);
    }
    brackets.push(round);
    playersPerRound /= 2;
  }
  console.log(brackets);
  console.log(participants);
};
const drawBrackets = (brackets) => {
  for (let i = 0; i < brackets.length; i++) {
    let round = document.createElement("div");
    round.classList.add(
      "flex",
      "flex-col",
      "justify-evenly",
      "items-center",
      "w-60"
    );
    let roundNum = document.createElement("h2");
    roundNum.textContent = `Round ${i + 1}`;
    round.appendChild(roundNum);
    for (let j = 0; j < brackets[i].length; j++) {
      let bracket = new Bracket(
        brackets[i][j][0],
        i,
        j,
        0,
        brackets[i][j][1],
        i,
        j,
        1
      );
      const parser = new DOMParser();
      let div = parser.parseFromString(bracket.generateBracket(), "text/html");
      div = div.getElementsByTagName("div")[0];
      round.appendChild(div);
    }
    document.querySelector("main").appendChild(round);
  }
  const buttons = document.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      let btn = event.target;
      updateBrackets(brackets, btn);
    });
  });
};
const shufflePlayers = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
const insertByes = (array, byes) => {
  let counter = 1;
  while (byes--) {
    array.splice(counter, 0, "bye");
    counter += 2;
  }
};

class Bracket {
  constructor(
    player1,
    roundIndex1,
    bracketIndex1,
    playerIndex1,
    player2,
    roundIndex2,
    bracketIndex2,
    playerIndex2
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.roundIndex1 = roundIndex1;
    this.bracketIndex1 = bracketIndex1;
    this.playerIndex1 = playerIndex1;
    this.roundIndex2 = roundIndex2;
    this.bracketIndex2 = bracketIndex2;
    this.playerIndex2 = playerIndex2;
  }
  generateBracket() {
    return `<div class="flex flex-col bg-slate-500 p3 w-full">
                    <button class="p-3" data-roundIndex=${this.roundIndex1}  data-bracketIndex=${this.bracketIndex1}  data-playerIndex=${this.playerIndex1}>${this.player1}</button>
                    <button class="p-3" data-roundIndex=${this.roundIndex2}  data-bracketIndex=${this.bracketIndex2}  data-playerIndex=${this.playerIndex2}>${this.player2}</button>
            </div>`;
  }
}
