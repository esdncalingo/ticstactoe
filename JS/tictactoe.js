window.addEventListener('load', () => {
    const x_class = 'x';
    const o_class = 'o';
    let x_score = 0, o_score = 0;
    const prevButton = document.querySelector('#prevbtn');
    const nextButton = document.querySelector('#nxtbtn');
    const restartButton = document.querySelector('#restartbtn');
    const startButton = document.querySelector('#startbtn');
    const reviewButton = document.querySelector('#reviewbtn');
    const rematchButton = document.querySelector('#rematchbtn');
    const reviewRematchButton = document.querySelector('#rematch2btn');
    const quitButton = document.querySelector('#quitbtn');
    let messageBox = document.querySelector('.winmessage');
    let reviewDisplay = document.querySelector('.endgamebtns');
    let matchHistory = [], prevHistory = [];
    const win_panel_pattern = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [1,4,7],
        [2,5,8],
        [3,6,9],
        [1,5,9],
        [7,5,3]
    ];
    const playList = ['Nice', 'Oh Hell No!', 'Ok', 'That Was Legitness', 'Toasty!', 'Why you Bully Me', 'Wow!'];
    let playerTurn, currentPanel, activePanel=false;
    let startBGM, gameBGM;

    loadAllPanelClickEvent()
    loadAllTilesClickEvent()
    
    restartButton.addEventListener('click', () => {
        location.reload();
    })
    startButton.addEventListener('click', () => {
        const startmenu = document.querySelector('#startmenu');
        startmenu.style.display = 'none'
        startBGM.pause()
        gameBGM.play()
    })
    reviewButton.addEventListener('click', () => {
        reviewDisplay.style.display = 'flex';
        messageBox.style.display = 'none';
    })
    quitButton.addEventListener('click', () => {
        location.reload();
    })
    rematchButton.addEventListener('click', rematch)
    reviewRematchButton.addEventListener('click', () => {
        reviewDisplay.style.display = 'none';
        rematch()
    })

    function loadAllPanelClickEvent(){
        const toplayerElement = document.querySelectorAll('[data-toplayer]');
        toplayerElement.forEach(toplayer => {
            toplayer.addEventListener('click', (e) => {
                if (!activePanel){
                    const layer = e.target;
                    layer.classList.add('hide');
                    currentPanel = layer.dataset.toplayer;
                    activePanel = true;
                } 
            })
        })
    }
    function loadAllTilesClickEvent(){
        const tilesElement = document.querySelectorAll('[data-tileset]');
        tilesElement.forEach(tiles => {
            tiles.addEventListener('click', (e) => {
                const tiles = e.target;
                const currentPlayer = playerTurn ? o_class : x_class;
                let winPanel = document.querySelector(`[data-toplayer='${currentPanel}']`);
                placeMark(tiles, currentPlayer)
                matchHistory.push({id: tiles.dataset.id, mark: currentPlayer});
                
                if(checkWin(currentPlayer)){  
                    winPanel.classList.remove('hide')
                    winPanel.classList.add(currentPlayer)
                    winPanel.replaceWith(winPanel.cloneNode(true))
                    activePanel = false;
                    matchHistory.push({id: winPanel.dataset.id, mark: currentPlayer});
                    playerTurn ? o_score++ : x_score++;
                    randomSounds()
                    playerScore()
                } else if (isDraw()){
                    winPanel.classList.add('draw')
                    activePanel = false;
                }
    
                if(overAllWin(currentPlayer)){
                    winningMessage(`Player ${currentPlayer.toUpperCase()} win!`)
                } else if(overallDraw()){
                    overAllWinbyScore()
                }
                swapPlayer()
            }, {once: true});
        })

        function placeMark(tiles, currentPlayer){
            tiles.classList.add(currentPlayer);
        }
    
        function swapPlayer() {
            playerTurn = !playerTurn;
        }
    }

    function playerScore() {
        let X_player = document.querySelector('#player1score');
        let O_player = document.querySelector('#player2score');
        X_player.textContent = x_score;
        O_player.textContent = o_score;
    }

    function checkWin(currentPlayer){
        const win_pattern = [
            [currentPanel + 1, currentPanel + 2, currentPanel + 3],
            [currentPanel + 4, currentPanel + 5, currentPanel + 6],
            [currentPanel + 7, currentPanel + 8, currentPanel + 9],
            [currentPanel + 1, currentPanel + 4, currentPanel + 7],
            [currentPanel + 2, currentPanel + 5, currentPanel + 8],
            [currentPanel + 3, currentPanel + 6, currentPanel + 9],
            [currentPanel + 1, currentPanel + 5, currentPanel + 9],
            [currentPanel + 7, currentPanel + 5, currentPanel + 3]
        ];
        return win_pattern.some(combination => {
            
            return combination.every(data => {
                let chktest = document.querySelector(`[data-tileset='${data}']`); 
                return chktest.classList.contains(currentPlayer);
            })
        })
    }

    function isDraw() {
        let winPanel = document.querySelectorAll(`[data-tilegroup='${currentPanel}']`);
        return [...winPanel].every(tiles => {
            return tiles.classList.contains(o_class) || tiles.classList.contains(x_class)
        })
    }

    function overallDraw() {
        let winPanel = document.querySelectorAll('.toplayer');
        return [...winPanel].every(panels => {
            return panels.classList.contains(o_class) || panels.classList.contains(x_class) || panels.classList.contains('draw')
        })
    }

    function overAllWin(currentPlayer){
        return win_panel_pattern.some(combination => {
            return combination.every(data => {
                let chktest = document.querySelector(`[data-toplayer='${data}']`);
                return chktest.classList.contains(currentPlayer);
            })
        })
    }
    function overAllWinbyScore(){
        if (o_score === x_score) {
            winningMessage('Draw')
        } else if (x_score > o_score) {
            winningMessage(`X win with score of ${x_score}`)
        } else {
            winningMessage(`O win with score of ${o_score}`)
        }
    }

    function rematch() {
        let resetTiles = document.querySelectorAll('[data-id]');
        
        resetTiles.forEach(box => {
            box.classList.remove(x_class)
            box.classList.remove(o_class)
            box.classList.remove('draw') 
            if(box.classList.contains('toplayer')){
                box.classList.remove('hide')
            }
            box.replaceWith(box.cloneNode(true))   
        })

        loadAllPanelClickEvent()
        loadAllTilesClickEvent()

        matchHistory = [];
        prevHistory = [];
        x_score = 0;
        o_score = 0;
        messageBox.style.display = 'none';
        playerScore()
    }

    function randomSounds(){
        var randomMusic = playList[Math.floor(Math.random()*playList.length)];
        var playAudio = new Audio();
        playAudio.src = `./audio/meme/${randomMusic}.mp3`;
        playAudio.play()
        playAudio.volume = .1;
    }

    function winningMessage(message){
        let msg = document.querySelector('#messagestatus');
        messageBox.style.display = 'flex';
        msg.textContent = message;
    }

    prevButton.addEventListener('click', () => {
        prev = matchHistory.pop();
        
        if (prev !== undefined){
            const idNumber = document.querySelector(`[data-id='${prev.id}']`);
            idNumber.classList.remove(prev.mark);
            prevHistory.push(prev)
            if(idNumber.classList.contains('toplayer')){
                idNumber.classList.add('hide')
            }
        }
    })

    nextButton.addEventListener('click', () => {
        next = prevHistory.pop();
        
        if (next !== undefined){
            const idNumber = document.querySelector(`[data-id='${next.id}']`);
            idNumber.classList.add(next.mark);
            matchHistory.push(next)
            if(idNumber.classList.contains('toplayer')){
                idNumber.classList.remove('hide')
            }
        }
    })

    startBGM = new Audio();
    startBGM.src = './audio/bgm/start.mp3';    
    startBGM.play()
    startBGM.loop = true;
    startBGM.volume = .02;

    gameBGM = new Audio();
    gameBGM.src = './audio/bgm/game.mp3';
    gameBGM.loop = true;
    gameBGM.volume = .03;
})