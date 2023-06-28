const run = () => {
  const tourTitle = localStorage.getItem("tourTitle");
  document.querySelector(
    "h1"
  ).textContent = `Welcome to "${tourTitle}" tournament!!`;
  const tournament = [];
  buildBrackets(tournament);
  drawBrackets(tournament);
  elemenateByes(tournament);
};
const updateBrackets = (tournament, btn) => {
  let roundId = btn.getAttribute("data-roundIndex");
  let bracketId = btn.getAttribute("data-bracketIndex");
  let playerId = parseInt(btn.getAttribute("data-playerIndex"));
  const player = tournament[roundId][bracketId][playerId];
  const opponent = tournament[roundId][bracketId][(playerId + 1) % 2];
  if (opponent.name !== 'TBD') {
    player.setStatus('Winner');
    opponent.setStatus('loser');
    let indexInRound = bracketId * 2 + playerId;
    let newindexInRound = Math.floor(indexInRound / 2);
    bracketId = Math.floor(newindexInRound / 2);
    playerId = newindexInRound % 2;
    roundId++;
    tournament[roundId][bracketId][playerId].name = player.name;
    deleteBrackets();
    drawBrackets(tournament);
  }
};
const buildBrackets = (tournament) => {
  let participantsNo = localStorage.getItem("participantsNo");
  const participants = JSON.parse(localStorage.getItem("participants"));
  const numberOfRounds = Math.ceil(Math.log2(participantsNo));
  let playersPerRound = 2 ** Math.ceil(Math.log2(participantsNo));
  const byes = playersPerRound - participantsNo;
  shufflePlayers(participants);
  insertByes(participants, byes);
  for (let i = 0; i < numberOfRounds; i++) {
    let round = [];
    for (let j = 0; j < playersPerRound; j += 2) {
      let bracket = [];
      if (i === 0) {
        bracket.push(new Player(participants[j], i, j / 2, 0, 'Idle'));
        bracket.push(new Player(participants[j + 1], i, j / 2, 1, 'Idle'));
      } else {
        bracket.push(new Player('TBD', i, j / 2, 0, 'Idle'));
        bracket.push(new Player('TBD', i, j / 2, 1, 'Idle'));
      }
      round.push(bracket);
    }
    tournament.push(round);
    playersPerRound /= 2;
  }
  console.log(tournament);
  console.log(participants);
};
const drawBrackets = (tournament) => {
  for (let i = 0; i < tournament.length; i++) {
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
    for (let j = 0; j < tournament[i].length; j++) {
      let bracket = document.createElement("div");
      bracket.classList.add(
        "flex",
        "flex-col",
        "p3",
        "w-full"
      );
      const parser = new DOMParser();
      let btn = parser.parseFromString(tournament[i][j][0].getBtn(), 'text/html');
      btn = btn.querySelector('button');
      bracket.appendChild(btn);
      btn = parser.parseFromString(tournament[i][j][1].getBtn(), 'text/html');
      btn = btn.querySelector('button');
      bracket.appendChild(btn);

      round.appendChild(bracket);
    }
    document.querySelector("main").appendChild(round);
  }
  const buttons = document.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      let btn = event.target;
      if (btn.textContent !== 'TBD' && btn.textContent !== 'bye') updateBrackets(tournament, btn);
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
const elemenateByes = (tournament) => {
  for (let i = 0; i < tournament[0].length; i++) {
    if (tournament[0][i][1].name === 'bye') {
      let indexInRound = i * 2 + 0;
      let newindexInRound = Math.floor(indexInRound / 2);
      tournament[1][Math.floor(newindexInRound / 2)][newindexInRound % 2].name = tournament[0][i][0].name;
      tournament[0][i][0].setStatus('Winner');
      tournament[0][i][1].setStatus('Loser');
    }
  }
  deleteBrackets();
  drawBrackets(tournament);
}
const deleteBrackets = () => {
  const main = document.querySelector("main");
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
}
class Player {
  constructor(name, roundIndx, bracketIndx, playerIndx, status) {
    this.name = name;
    this.roundIndx = roundIndx;
    this.bracketIndx = bracketIndx;
    this.playerIndx = playerIndx;
    this.status = status;
  }
  getBtn() {
    if (this.status === 'Idle') {
      return `<button class="p-3 bg-slate-500" data-roundIndex=${this.roundIndx}  data-bracketIndex=${this.bracketIndx}  data-playerIndex=${this.playerIndx}>${this.name}</button>`
    } else if (this.status === 'Winner') {
      return `<button class="p-3 bg-emerald-500" data-roundIndex=${this.roundIndx}  data-bracketIndex=${this.bracketIndx}  data-playerIndex=${this.playerIndx}>${this.name}</button>`
    } else {
      return `<button class="p-3 bg-red-500 line-through" data-roundIndex=${this.roundIndx}  data-bracketIndex=${this.bracketIndx}  data-playerIndex=${this.playerIndx}>${this.name}</button>`
    }
  }
  setStatus(status) {
    this.status = status;
  }
}
run();