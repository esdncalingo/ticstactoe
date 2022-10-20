window.addEventListener('load', () => {
    const x_class = 'x';
    const o_class = 'o';
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
            } else if (isDraw()){
                activePanel = false;
                console.log('draw')
            }

            if(overAllWin(currentPlayer)){
                console.log(currentPlayer + ' win')
            }

            swapPlayer()
        }, {once: true});
    })
    restartButton.addEventListener('click', () => {
        location.reload();
    })
    startButton.addEventListener('click', () => {
        const startmenu = document.querySelector('#startmenu');
        startmenu.style.display = 'none'
    })

    function placeMark(tiles, currentPlayer){
        tiles.classList.add(currentPlayer);
    }

    function swapPlayer() {
        playerTurn = !playerTurn;
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