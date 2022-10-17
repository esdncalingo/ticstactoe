window.addEventListener('load', () =>{
    const board = document.querySelector('.board');
    let counter=0;
    
    for (i = 1 ; i <= 9; i++){
        let panel = document.createElement('div');
        let toplayer = document.createElement('div');
        for (j = 1; j <= 9; j++){
            let tiles = document.createElement('div');

            counter += 1;

            tiles.className = 'tiles';
            tiles.dataset.tileset = `${i}${j}`;
            tiles.dataset.tilegroup = i;
            tiles.dataset.id = counter;
            panel.appendChild(tiles);
        }
        counter += 1;
        panel.className = 'panels'
        panel.dataset.panel = i;
        toplayer.className = 'toplayer';
        toplayer.dataset.toplayer = i
        toplayer.dataset.id = counter;
        board.appendChild(panel);
        panel.appendChild(toplayer);
    }
})