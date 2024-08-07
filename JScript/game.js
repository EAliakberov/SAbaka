'use strict';




class Game{
    players = [];
    activePlayer = 0;
    gamesCount = 0;
    dices = [];
    dicesPosition = [];
    throwNumber = -1;

    combos =[];
    combosScores = {
    };



    allCombos = ['twins', 'differ', 'l.street', 'b.street', 'care', 'abaka', 'summa'];

    constructor(name, gamesCount, HTMLelement){
        this.gamesCount = gamesCount;
        this.players = [];
        this.activePlayer = 0;
        this.HTMLcontainer = HTMLelement;

    }

    clearDices(){
        this.dices = [0,0,0,0,0];
        this.dicesPosition = [true,true,true,true,true];
        this.throwNumber = -1;
    }

    clearCombos(){
        this.combosScores['1'] = 0;
        this.combosScores['2'] = 0;
        this.combosScores['3'] = 0;
        this.combosScores['4'] = 0;
        this.combosScores['5'] = 0;
        this.combosScores['6'] = 0;
        this.combosScores['twins'] = 0;
        this.combosScores['differ'] = 0;
        this.combosScores['l.street'] = 0;
        this.combosScores['b.street'] = 0;
        this.combosScores['care'] = 0;
        this.combosScores['abaka'] = 0;
        this.combosScores['summa'] = 0;
    }

    nextPlayer(){
        let players = this.players;
        if (this.activePlayer < players.length-1){
            this.activePlayer++;
        }
        else
        {
            this.activePlayer = 0;
        }

        for (let i in players){
            players[i].HTMLcontainer.classList.remove('active');
        }

        players[this.activePlayer].HTMLcontainer.classList.add('active');

        this.clearDices();
        this.throwNumber = -1;
    }

    createScoreTable(player){
        let table = document.createElement('table');
        table.classList.add('game-scores');

        let rows = [].concat(this.allCombos,'bonus');

        for (let rowName of rows){

            let row = document.createElement('tr');
            player.scoresTable[rowName] = [];
            player.scores[rowName] = [];

            for (let i = 0; i < this.gamesCount+2; i++){

                let col = document.createElement('td');
                if (i === 0){
                    col.textContent = rowName;
                }
                row.appendChild(col);
                player.scoresTable[rowName][i] = col;
                player.scores[rowName][i] = 0;
            }
            table.appendChild(row);
        }
        return table;
    }

    createSchoolTable(player){
        let table = document.createElement('table');
        table.classList.add('game-school');

        let rows = ['1', '2', '3', '4', '5', '6'];


        for (let rowName of rows){
            let row = document.createElement('tr');
            player.schoolTable[rowName] = [];
            player.school[rowName] = [];
            for (let i = 0; i < this.gamesCount+2; i++){
                let col = document.createElement('td');
                if (i === 0){
                    col.textContent = rowName;
                }
                row.appendChild(col);
                player.schoolTable[rowName][i] = col;
                player.school[rowName][i] = 0;
            }
            table.appendChild(row);
        }
        return table;
    }

    createGameFieldForPlayer(player){

        player.HTMLcontainer = document.createElement('div');
        player.HTMLcontainer.classList.add('player');


        let headerDiv = document.createElement('div');
        headerDiv.classList.add('header-div');

        player.HTMLscoresSum = document.createElement('div');
        player.HTMLscoresSum.classList.add('score-label');
        player.HTMLscoresSum.textContent = '0';

        player.HTMLschoolSum = document.createElement('div');
        player.HTMLschoolSum.classList.add('school-label');
        player.HTMLschoolSum.textContent = '0';

        player.HTMLbonusSum = document.createElement('div');
        player.HTMLbonusSum.classList.add('bonus-label');
        player.HTMLbonusSum.textContent = '0';

        let playerNameEl = document.createElement('h3');

        playerNameEl.classList.add('player-name');
        playerNameEl.textContent = player.name;

        headerDiv.appendChild(playerNameEl);
        headerDiv.appendChild(player.HTMLschoolSum);
        headerDiv.appendChild(player.HTMLscoresSum);
        headerDiv.appendChild(player.HTMLbonusSum);

        player.HTMLcontainer.appendChild(headerDiv);
        player.HTMLcontainer.appendChild(this.createSchoolTable(player));
        player.HTMLcontainer.appendChild(this.createScoreTable(player));

        return player.HTMLcontainer;
    }


    addPlayer(name){
        let newPlayer = {
            setScore(rowName, colNumber, value){
                if (this.scores[rowName][colNumber]<this.scores[rowName].length-3){
                    this.scores[rowName][colNumber]=value;
                    this.scoresTable[rowName][colNumber].textContent=value;
                    this.scores[rowName][0]++;
                }
            }
        };

        newPlayer.name = name;
        newPlayer.schoolTable = [];
        newPlayer.scoresTable = [];
        newPlayer.scoresSum = 0;
        newPlayer.schoolSum = 0;
        newPlayer.bonusSum = 0;


        newPlayer.school = [];
        newPlayer.scores = [];

        for (let i = 0; i<this.gamesCount+2; i++){
            newPlayer.school[i] = [];
        }

        this.createGameFieldForPlayer(newPlayer);

        this.players.push(newPlayer);
        this.HTMLcontainer.appendChild(newPlayer.HTMLcontainer);
        this.setActivePlayer();
    }

    setActivePlayer(){
        for (let player of this.players){
            player.HTMLcontainer.classList.remove('active');
        }
        this.players[this.activePlayer].HTMLcontainer.classList.add('active');
    }

    setNextPlayerActive(){
        if (this.activePlayer < this.players.length-1){
            this.activePlayer++;
        }
        else{
            this.activePlayer = 0;
        }
        this.setActivePlayer();
    }

    setHTMLelements(Parent){
        for (player of this.players){
            Parent.appendChild(player.HTMLcontainer);
        }
    }

    calculateThrowScores(dices){
        let resultArray = [0,0,0,0,0,0]
        for(let dice of dices){
            resultArray[dice-1]++;
        }
        return resultArray;
    }

    findCombos(dices){
        let scores = this.calculateThrowScores(dices);
        let pairs = 0;
        let tripple = 0;
        let quad = 0;
        let abaka = 0;

        this.clearCombos();

        let combosList = [];
        let multiplier = 1;
        if (this.throwNumber == 0){ multiplier++}

        for (let b = 0; b < 6; b++){
            let a = b + 1;
            this.combosScores[a.toString()]+=a*(scores[b]-3);
            if (scores[b] === 2) {
                pairs++;
                this.combosScores['twins']+=a*2*multiplier;
                this.combosScores['differ']+=a*2*multiplier;
            };
            if (scores[b] === 3) {
                tripple++;
                this.combosScores['twins']+=a*2*multiplier;
                this.combosScores['differ']+=a*3*multiplier;
            };
            if (scores[b] === 4) {
                quad++;
                this.combosScores['twins']+=a*4*multiplier;
                this.combosScores['care']+=a*4*multiplier;
            };
            if (scores[b] === 5) {
                abaka++;
                this.combosScores['twins']+=a*4*multiplier;
                this.combosScores['care']+=a*4*multiplier;
                this.combosScores['differ']+=a*5*multiplier;
                this.combosScores['abaka']+=a*5*multiplier;
            };
            this.combosScores['summa'] += a*scores[b]*multiplier;
        }

        if (pairs == 2 || (pairs == 1 && tripple == 1) || (quad == 1) || (abaka == 1)){
            combosList.push('twins');
        }
        else {this.combosScores['twins'] =0;}

        if ((pairs == 1 && tripple == 1) || (abaka == 1)){
            combosList.push('differ');
        }
        else {this.combosScores['differ'] =0;}

        if (quad == 1 || abaka == 1){
            combosList.push('care');
            this.combosScores['care'] += 10;
        }
        else {this.combosScores['care'] =0;}

        if (abaka == 1){
            combosList.push('abaka');
            this.combosScores['abaka'] += 50;
        }
        else {this.combosScores['abaka'] =0;}

        if (scores[0]>0 && scores[1]>0 && scores[2]>0 && scores[3]>0 && scores[4]>0){
            combosList.push('l.street');
            this.combosScores['l.street'] = 15*multiplier;
        }


        if (scores[1]>0 && scores[2]>0 && scores[3]>0 && scores[4]>0 && scores[5]>0){
            combosList.push('b.street');
            this.combosScores['b.street'] =20*multiplier;
        }

        return combosList;
    }

    makeFirstThrow(){
        this.dices = [];
        this.dicesPosition = [];
        for (let i = 0; i < 5; i++){
            let newThrow = Math.floor(Math.random()*6)+1;
            this.dices[i] = newThrow
            this.dicesPosition[i] = true;
        }
    }



    makeNextThrow(){
        for(let i = 0; i < 5; i++){
            if (this.dicesPosition[i]){
                let newThrow = Math.floor(Math.random()*6)+1;
                this.dices[i] = newThrow;
            }
        }
    }


    makeThrow(){
        if(this.throwNumber<20){
            this.throwNumber++;
            if (this.throwNumber == 0){
                this.makeFirstThrow();
            }
            else{
                this.makeNextThrow();
            }
        }
    }

    changeDicePosition(number){
        this.dicesPosition[number] = !this.dicesPosition[number];
    }

    setDicePositionUp(number){
        this.dicesPosition[number] = false;
    }
    setDicePositionDown(number){
        this.dicesPosition[number] = true;
    }

    getMaxScore(arr){
        let newArr = arr.slice(1,6);
        let max = 0;
        for (let i in newArr){
            if (newArr[i] > max){
                max = newArr[i];
            }
        }
        return max;
    }

    addSchoolBonus(rowName){
        let curRows = this.players.map(item => item.school[rowName]);
        for (let curRow of curRows){
            curRow[6] = -1;
        }
        curRows[this.activePlayer][6] = this.getMaxScore(curRows[this.activePlayer]);
    }

    addScoresBonus(rowName){
        let curRows = this.players.map(item => item.scores[rowName]);
        for (let curRow of curRows){
            curRow[6] = -1;
        }
        curRows[this.activePlayer][6] = this.getMaxScore(curRows[this.activePlayer]);
    }




    addVerticalBonus(colNumber){
        let activePlayer = this.activePlayer;

        let bonusRows = this.players.map(item => item.scores['bonus']);
        let curScores = this.players.map(item => item.scores);

        if (bonusRows[activePlayer][colNumber] >= 0){
            let res = true;
            let max = 0;

            for (let row in curScores[activePlayer]){
                if(row != 'bonus'){
                    if (curScores[activePlayer][row][0] < colNumber){
                        res = false;
                        break;
                    }
                }
            }
            if (res){
                if(row != 'bonus'){
                    for (let row in curScores[activePlayer]){
                        if (curScores[activePlayer][row][colNumber] > 0){
                            if (max < curScores[activePlayer][row][colNumber]){
                                max = curScores[activePlayer][row][colNumber];
                            }
                        }
                        else{
                            res = false;
                        }
                    }
                }
            }

            if (res){
                for(playerNum in curScores){
                    bonusRows[playerNum][colNumber] = -1;
                    bonusRows[activePlayer][colNumber] = max;
                }
            }
        }
    }



    addScoresToPlayer(rowName){
        if (this.throwNumber < 0){
            return false;
        }

        let curRow = this.players[this.activePlayer].scores[rowName];

        if (curRow[0] > 4){
            alert('Все ячейки заполнены!');
            return false;
        }
        else{
            if (+this.combosScores[rowName] > 0){
                curRow[0]++;
                curRow[curRow[0]] = +this.combosScores[rowName];
                if (curRow[0] >= 5 && curRow[6] >= 0){
                    this.addScoresBonus(rowName);
                }
                this.addVerticalBonus(curRow[0]);
            }
            else{
                if (confirm('Обнулить ячейку '+ rowName + '?')){
                    curRow[0]++;
                    curRow[curRow[0]] = +this.combosScores[rowName];
                    curRow[6] = -1;
                }
                else{
                    return false;
                }
            }
        }

        return true;
    }

    addSchoolToPlayer(rowName){
        if (this.throwNumber < 0){
            return false;
        }

        let curRow = this.players[this.activePlayer].school[rowName];

        if (curRow[0] > 4){
            alert('Все ячейки заполнены!');
            return false;
        }
        else{
            if (+this.combosScores[rowName] >= 0){
                curRow[0]++;
                curRow[curRow[0]] = +this.combosScores[rowName];
                if (curRow[0] >= 5 && curRow[6] >= 0){
                    this.addSchoolBonus(rowName);
                }
            }
            else{
                if (confirm('Записать отрицательный результат в строку '+ rowName + ': ' + this.combosScores[rowName] + '?')){
                    curRow[0]++;
                    curRow[curRow[0]] = +this.combosScores[rowName];
                    curRow[6] = -1;
                }
                else {
                    return false;
                }
            }
        }

        return true;
    }

    addToPlayer(rowName){
        let res;
        if (+rowName){
            res = this.addSchoolToPlayer(rowName);

        }
        else{
            res = this.addScoresToPlayer(rowName);
        }


        if(res){
            this.clearCombos();
            this.calculateAllScores();
            this.showPlayers();
        };
        return res;
    }

    calculateAllScores(){
        for (let player of this.players){
            let schoolSum = 0;
            for (let i = 1; i < 7; i++){
                let schoolRow = player.school[i];
                for (let i = 1; i < 6; i++){
                    schoolSum += schoolRow[i];
                }
                if (schoolRow[6] > 0){
                    schoolSum += schoolRow[6];
                }
            }
            player.schoolSum = schoolSum;

            let scoresSum = 0;
            for (let scoresRow of player.scores){
                for (let i = 1; i < 7; i++){
                    if(scoresRow[i] > 0){
                        scoresSum += scoresRow[i];
                    }
                }
            }
            player.scoresSum = scoresSum;

            let bonusSum = 0;
            for (let bonusRow of player.scores){
                if (bonusRow[6] > 0){
                        bonusSum += bonusRow[6];
                }
            }
            for (let i = 1; i < 6; i++){
                if (player.scores['bonus'][i] > 0){
                        bonusSum += player.scores['bonus'][i];
                }
            }
            player.bonusSum = bonusSum;


        }
    }

    showPlayerScores(activePlayerNum){
        let activePlayer = this.players[activePlayerNum];

        for (let row in activePlayer.scoresTable){
            for(let col = 1; col <= activePlayer.scores[row][0]; col++){
                activePlayer.scoresTable[row][col].textContent = activePlayer.scores[row][col];
            }
            if(activePlayer.scores[row][6] == -1){
                activePlayer.scoresTable[row][6].textContent = 'X';
            }
            else{
                if(activePlayer.scores[row][6] > 0){
                    activePlayer.scoresTable[row][6].textContent = activePlayer.scores[row][6];
                }
            }
        }

    }

    showPlayerSchool(activePlayerNum){
        let activePlayer = this.players[activePlayerNum];

        for (let row in activePlayer.schoolTable){
            for(let col = 1; col <= activePlayer.school[row][0]; col++){
                activePlayer.schoolTable[row][col].textContent = activePlayer.school[row][col];
            }
            if(activePlayer.school[row][6] == -1){
                activePlayer.schoolTable[row][6].textContent = 'X';
            }
            else{
                if(activePlayer.school[row][6] > 0){
                    activePlayer.schoolTable[row][6].textContent = activePlayer.school[row][6];
                }
            }
        }

        activePlayer.HTMLschoolSum.textContent = activePlayer.schoolSum;
    }

    showPlayers(){
        for (let i = 0; i < this.players.length; i++){
            this.showPlayerScores(i);
            this.showPlayerSchool(i);
        }
    }
}


let startAbaka =document.querySelector('.start-abaka');
let gameMenu = document.querySelector('.game-menu');
let gameAbaka = document.querySelector('.abaka');


startAbaka.onclick = function(){
    gameMenu.classList.remove('active-frame');
    gameAbaka.classList.add('active-frame');
}


let gameField = document.querySelector('.game-field');
let newGame = new Game('First Game', 5, gameField);

newGame.addPlayer('Олег');
newGame.addPlayer('Вадим Валентинович Азероткин');


let userButtons = document.querySelector('.game-buttons-list');

let createUserButton = function(name){
    let newButton = document.createElement('button');
    newButton.classList.add('button-' + name.toLowerCase());
    newButton.textContent = name;
    newButton.onclick = function(){
        if (newGame.addToPlayer(name)){
            newGame.nextPlayer();
            showDices(newGame);
        }
    }
    return newButton;
}

let buttons = ['1','2','3','4','5', '6', 'twins', 'differ', 'l.street', 'b.street', 'care', 'abaka', 'summa'];

for (let button of buttons){
    userButtons.appendChild(createUserButton(button));
}




let throwButton = document.querySelector('.button-throw');
let bottomDices = document.querySelectorAll('.dice .down');
let upDices = document.querySelectorAll('.dice .up');

let allDicesDownButton = document.querySelector('.button-all-down');
let allDicesUpButton = document.querySelector('.button-all-up');

let positionButtons = document.querySelectorAll('.dice .dice-button');


allDicesDownButton.onclick = function(){
    newGame.setDicePositionDown(0);
    newGame.setDicePositionDown(1);
    newGame.setDicePositionDown(2);
    newGame.setDicePositionDown(3);
    newGame.setDicePositionDown(4);
    showDices(newGame);
}

allDicesUpButton.onclick = function(){
    newGame.setDicePositionUp(0);
    newGame.setDicePositionUp(1);
    newGame.setDicePositionUp(2);
    newGame.setDicePositionUp(3);
    newGame.setDicePositionUp(4);
    showDices(newGame);
}

function showDices(game){

    for(let i = 0; i < 5; i++){
        if (game.throwNumber < 0){
            upDices[i].textContent = '';
            bottomDices[i].textContent = '';
        }
        else{
            if(game.dicesPosition[i]){
                bottomDices[i].textContent = game.dices[i];
                upDices[i].textContent = '';
            }
            else
            {
                upDices[i].textContent = game.dices[i];
                bottomDices[i].textContent = '';
            }
        }
    }
}

throwButton.onclick = function(){
    newGame.makeThrow();
    showDices(newGame);

    throwButton.textContent = newGame.findCombos(newGame.dices);

    console.log(newGame.combosScores);
};

for(let i = 0; i < 5; i++){
    positionButtons[i].onclick = function(){
        newGame.changeDicePosition(i);
        showDices(newGame);
    }
}

//newGame.players[newGame.activePlayer].setScore('twins', 3, 15);

