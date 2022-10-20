window.addEventListener('load', () => {
    const x_class = 'x';
    const o_class = 'o';
    let x_score = 0, o_score = 0, draw_count = 0;
    const tilesElement = document.querySelectorAll('[data-tileset]');
    const toplayerElement = document.querySelectorAll('[data-toplayer]');
    const prevButton = document.querySelector('#prevbtn');
    const nextButton = document.querySelector('#nxtbtn');
    const restartButton = document.querySelector('#restartbtn');
    const startButton = document.querySelector('#startbtn');
    const matchHistory = [], prevHistory = [];
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
    let playerTurn, currentPanel, activePanel=false;

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

                playerScore()
            } else if (isDraw()){
                activePanel = false;
                draw_count++;
                console.log('draw')
            }

            if(overAllWin(currentPlayer)){
                console.log(currentPlayer + ' win')
            } else if(overAllWinbyScore(currentPlayer)){

            }
            
            swapPlayer()
        }, {once: true});
    })
    restartButton.addEventListener('click', () => {
        location.reload();
        const startmenu = document.querySelector('#startmenu');
        startmenu.style.display = 'none'
    })
    startButton.addEventListener('click', () => {
        const startmenu = document.querySelector('#startmenu');
        startmenu.style.display = 'none'
    })

    function placeMark(tiles, currentPlayer){
        tiles.classList.add(currentPlayer);
    }

    function swapPlayer() {
        let X_player = document.querySelector('#player1score');
        let O_player = document.querySelector('#player2score');
        playerTurn = !playerTurn;

        X_player.textContent = x_score;
        O_player.textContent = o_score;
    }

    function playerScore() {
        playerTurn ? o_score++ : x_score++;
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

    function overAllWin(currentPlayer){
        return win_panel_pattern.some(combination => {
            return combination.every(data => {
                let chktest = document.querySelector(`[data-toplayer='${data}']`);
                return chktest.classList.contains(currentPlayer);
            })
        })
    }
    function overAllWinbyScore(currentPlayer){
        if (currentPlayer == x_class && x_score >= 5 - draw_count) {
            console.log(`x win with score of ${x_score}`)
        }
        if (currentPlayer == o_class && o_score >= 5 - draw_count) {
            console.log(`o win with score of ${o_score}`)
        }
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
})