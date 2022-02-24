const computerChoices = ["repair", "attack"]
const playerBarracks = {
    hitPoints: 10,
    peons: [],
}
const computerBarracks = {
    hitPoints: 10
}
function displayPeonCreationForm(){
    $("#peon-nursery").css("display", "block")
}
function respondToPeonCreationFormSubmit(event){
    event.preventDefault()
    const newPeonName = $("#new-peon-name").val();
    const newPeon = {
        name: newPeonName,
        job: null
    }
    $("#new-peon-name").val("")
    playerBarracks.peons.push(newPeon);
    $("#peon-nursery").css("display", "none");
    displayPeons();
    peonsDoTheirJobs();
}
function displayPeonJobAssignmentChoices(){
    $("#peon-assignment-div").css("display", "block")
    console.log("The user has chosen to assign a peon")
    playerBarracks.peons.forEach((peon)=>{
        const $peonLI = $(`<li></li>`)
        $peonLI.append(`<p>${peon.name}</p>`)
        const $attackButton = $(`<button>Assign ${peon.name} to attack</button>`)
        $attackButton.on("click", ()=>{
            assignPeonToJob(peon, "attack")
        })
        const $repairButton = $(`<button>Assign ${peon.name} to repair</button>`)
        $repairButton.on("click", ()=>{
            assignPeonToJob(peon, "repair")
        })
        if(!peon.job){
            // append both buttons
            $peonLI.append($repairButton)
            $peonLI.append($attackButton);
        }else if(peon.job === "repair"){
            $peonLI.append($attackButton);
            // append the switch to attack button
        }else{
            $peonLI.append($repairButton)
            // append the switch to repair button
        }
        $("#peon-assignment-list").append($peonLI)
    })
}
function assignPeonToJob(peon, jobChoice){
    peon.job = jobChoice;
    $('#peon-assignment-div').css('display', 'none');
    $('#peon-assignment-list').empty();
    peonsDoTheirJobs();
}
function peonsDoTheirJobs(){
    for(let i = 0; i < playerBarracks.peons.length; i++){
        const currentPeon = playerBarracks.peons[i];
        if(currentPeon.job === "repair"){
            playerBarracks.hitPoints++;
        }else if(currentPeon.job === "attack"){
            computerBarracks.hitPoints--;
        }
    }
    displayStatus();
    computerTurn();
}
function userTurnChoice(){
    $("#initial-choice").css("display", "block")
}
function evaluateWinCondition(){
    const result = {
        computerVictory : false,
        playerVictory : false
    }
    if(playerBarracks.hitPoints <= 0){
        result.computerVictory = true;
    }
    if(computerBarracks.hitPoints <= 0){
        result.playerVictory = true;
    }
    return result;
}
function computerTurn(){
    const randomChoiceIndex = Math.floor(Math.random() * computerChoices.length);
    const randomChoice = computerChoices[randomChoiceIndex];
    if(randomChoice === "repair"){
        computerBarracks.hitPoints += Math.floor(Math.random() * 3) + 1
    }else if(randomChoice === "attack"){
        playerBarracks.hitPoints -= Math.floor(Math.random() * 3) + 1
    }
    displayStatus();
    const victory = evaluateWinCondition();
    if(!victory.playerVictory && !victory.computerVictory){
        userTurnChoice();
    }else if(victory.playerVictory){
        $('body').prepend("<h1>YOU ARE THE CASTLE BATTLE CHAMPION!!!!")
    }else{
        $('body').empty();
        $('body').append("The computer gloats over the barren wasteland that was your kingdom. RIP :(((((")
    }
}
function displayStatus(){
    $('#your-hit-points').text(`${playerBarracks.hitPoints}`)
    $('#enemy-hit-point').text(`${computerBarracks.hitPoints}`)
    displayPeons();
}
function displayPeons(){
    $('#peon-list').empty();
    $('#peon-list').append(`<p>You have ${playerBarracks.peons.length} peons`)
    playerBarracks.peons.forEach((peon)=>{
        const $peonLI = $('<li></li>');
        if(peon.job){
            $peonLI.text(`${peon.name}'s job is ${peon.job}`)
        }else{
            $peonLI.text(`${peon.name} is currently looking for work and considering a coding bootcamp to reinvent their career.`)
        }
        $('#peon-list').append($peonLI);
    })
}
function roundOfGame(){
    displayStatus();
    userTurnChoice();
    peonsDoTheirJobs();
    computerTurn();
}
// EVENT LISTENERS
$('#choose-create-peon').on("click", ()=>{
    $("#initial-choice").css("display", "none")
    displayPeonCreationForm()
})
$('#choose-assign-peon').on("click", ()=>{
    $("#initial-choice").css("display", "none")
    displayPeonJobAssignmentChoices()
})
$("#peon-creation-form").on("submit", respondToPeonCreationFormSubmit)
// INITIALIZE THE GAME
displayStatus();
userTurnChoice();