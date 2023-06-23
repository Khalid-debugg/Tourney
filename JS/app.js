let participantsNo ;
let tourTitle;
let participantName;
const participants =[];
const btn = document.querySelector('.enter-btn');
const playerBtn = document.querySelector('.player-btn');
const playersList = document.querySelector('.players-list');
const generateBtn = document.querySelector('.generate-btn');

const showPlayersNo =()=>{
    document.querySelector('.players').textContent = `Enter each participant name: ${participantsNo} left`;
} 

btn.addEventListener('click', ()=>{
    participantsNo = document.querySelector('.participants-no').value;
    tourTitle = document.querySelector('.tour-title').value;

    while(playersList.childElementCount)playersList.removeChild(playersList.firstChild);
    showPlayersNo();
    if(participantsNo >= 2 && tourTitle){
        playerBtn.removeAttribute('disabled');
    }
    else{
        alert('Please enter valid data');
    }
})

playerBtn.addEventListener('click', ()=>{
    participantName = document.querySelector('.part-name').value;
    if(participantName){
        const element = new Participant(participantName);
        const parser = new DOMParser();
        let div = parser.parseFromString(element.getParticipant(), "text/html");
        
        div = div.getElementsByTagName('div')[0];
        playersList.appendChild(div);
        div.querySelector('button').addEventListener('click', ()=>{
            playersList.removeChild(div);
            participantsNo++;
            showPlayersNo();
            generateBtn.setAttribute('disabled', '');
            playerBtn.removeAttribute('disabled');
        })
    }  
    else{
        alert('Please, enter a valid participant name');
    }
    participantsNo--;
    showPlayersNo();
    if(!participantsNo) {
        playerBtn.setAttribute('disabled', '');
        generateBtn.removeAttribute('disabled');
    }
})

generateBtn.addEventListener('click', ()=>{
    for(let participant of playersList.children){
        let name = participant.querySelector('p');
        participants.push(name.textContent);
    }
    localStorage.setItem('participants', JSON.stringify(participants));
})
class Participant {
    constructor(name){
        this.name = name;
    }
    getParticipant(){
        return `<div class="mb-1 flex justify-between items-center bg-white p-2 text-black rounded transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 hover:bg-yellow-100 duration-300 cursor-pointer">
                    <p>${this.name}</p>
                    <button><img class="p-1 hover:outline-2" src="./images/icons8-delete-30.png"></button>
                </div>`;
    }

}

// Store the string in local storage
