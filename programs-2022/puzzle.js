let currTile, otherTile, turns = 0;
let currentRows, currentColumns, currentLevel; // Tambahkan variabel global untuk rows, columns, dan level

function startPuzzle(level) {
    console.log("Starting puzzle at level:", level);
    document.querySelector('.container').style.display = 'block';
    document.getElementById('game-container').style.display = 'block';

    if (level === 'easy') {
        currentRows = 3;
        currentColumns = 3;
        document.documentElement.style.setProperty('--board-width', '1059px');
        document.documentElement.style.setProperty('--board-height', '642px');
    } else if (level === 'medium') {
        currentRows = 4;
        currentColumns = 4;
        document.documentElement.style.setProperty('--board-width', '794px');
        document.documentElement.style.setProperty('--board-height', '482px');
    } else if (level === 'hard') {
        currentRows = 5;
        currentColumns = 5;
        document.documentElement.style.setProperty('--board-width', '952.5px');
        document.documentElement.style.setProperty('--board-height', '577.5px');
    } else if (level === 'legend') {
        currentRows = 6;
        currentColumns = 6;
        document.documentElement.style.setProperty('--board-width', '1058px');
        document.documentElement.style.setProperty('--board-height', '642px');
    }

    currentLevel = level; // Simpan level saat ini

    turns = 0;
    document.getElementById("turns").innerText = "Total Langkah :" + turns;
    document.getElementById("pieces").innerHTML = "";
    document.getElementById("pieces").style.gridTemplateColumns = `repeat(${currentColumns}, 1fr)`;

    let pieces = [];
    
    for (let i = 1; i <= currentRows * currentColumns; i++) {
        let suffix = (level === 'easy') ? 'S' : (level === 'medium') ? 'M' : (level === 'legend') ? 'L' : '';
        pieces.push(i.toString() + suffix);
    }
    pieces.reverse();
    for (let i = 0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);
        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
    }
    
    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.id = 'tile' + (i + 1); // Assign unique ID to each tile
        tile.src = "./images/" + pieces[i] + ".jpg";
        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", function() {
            dragEnd(currentRows, currentColumns, currentLevel); // Pass the current values
        });
        // Event listeners untuk perangkat layar sentuh
        tile.addEventListener("touchstart", touchStart);
        tile.addEventListener("touchmove", touchMove);
        tile.addEventListener("touchend", function() {
            touchEnd(currentRows, currentColumns, currentLevel);
        });
        document.getElementById("pieces").append(tile);
    }
}
// Variables to track touch positions
let startX, startY;

function touchStart(e) {
    currTile = this;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
}

function touchMove(e) {
    e.preventDefault(); // Prevent default scrolling behavior
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    currTile.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
}

function touchEnd(rows, columns, level) {
    currTile.style.transform = ""; // Reset position
    
    // Determine the closest tile to swap
    const touch = event.changedTouches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    otherTile = document.elementFromPoint(touchX, touchY);
    
    if (otherTile && otherTile.tagName === "IMG" && otherTile !== currTile) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        if (currImg !== otherImg) {
            currTile.src = otherImg;
            otherTile.src = currImg;
            turns += 1;
            document.getElementById("turns").innerText = "Total Langkah :" + turns;
        }

        checkCorrectPieces(rows, columns, level);
    }
}
// DRAG TILES Functions
function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

function checkCorrectPieces(rows, columns, level) {
    let correctPieces = 0;
    let suffix;

    if (level === 'easy') {
        suffix = 'S';
    } else if (level === 'medium') {
        suffix = 'M';
    } else if (level === 'hard') {
        suffix = '';
    } else if (level === 'legend') {
        suffix = 'L';
    }

    for (let i = 0; i < rows * columns; i++) {
        let tile = document.getElementById('tile' + (i + 1));

        // Extract the base filename without the path and extension
        let tileSrc = tile.src.split('/').pop().split('.')[0];

        // Determine the correct image name
        let correctImg = (i + 1) + suffix;

        console.log(`Checking tile ${i + 1}: Expected image: ${correctImg}, Tile source: ${tileSrc}`);

        if (tileSrc === correctImg) {
            correctPieces++;
        }
    }

    // Log jumlah yang benar ke console
    console.log(`Correct pieces: ${correctPieces}/${rows * columns}`);

    // Update text di elemen HTML untuk menunjukkan jumlah potongan yang benar
    document.getElementById("correctPieces").innerText = `Benar: ${correctPieces}/${rows * columns}`;

    if (correctPieces === rows * columns) {
        // Pause all other playing audio elements and save their state
        const allAudioElements = document.querySelectorAll('audio');
        let previouslyPlayingAudio = null;
        allAudioElements.forEach(audioElement => {
            if (!audioElement.paused) {
                audioElement.pause();
                previouslyPlayingAudio = audioElement;
            }
        });
    
        // Munculkan popup
        const popup = document.getElementById('popup');
        const themeNameElement = document.getElementById('theme-name'); 
        const selectedThemeName = "PETA LAUT INDONESIA SELESAI!"; 
        themeNameElement.textContent = selectedThemeName;
        popup.classList.add('active');
      
        // Mainkan audio
        const audio = new Audio('assets/audio/congratula.mp3');
        audio.volume = 0.3;
        audio.play();
    
        // Sembunyikan popup dan resume previous audio setelah lagu selesai
        audio.addEventListener('ended', function() {
            popup.classList.remove('active');
            
            // Resume the previously playing audio if there was one
            if (previouslyPlayingAudio) {
                previouslyPlayingAudio.play();
            }
        });
      
        // Membacakan teks yang muncul di popup
        // speakText(popup.textContent);
    }    
}

function dragEnd(rows, columns, level) {
    if (currTile.src.includes("blank")) {
        return;
    }
    let currImg = currTile.src;
    let otherImg = otherTile.src;

    if (currImg !== otherImg) {
        currTile.src = otherImg;
        otherTile.src = currImg;
        turns += 1;
        document.getElementById("turns").innerText = "Total Langkah :" + turns;
    }

    checkCorrectPieces(rows, columns, level);
}

function resetPuzzle() {
    const pieces = Array.from(document.getElementById("pieces").children);
    const newOrder = [];
    
    for (let i = 1; i <= currentRows * currentColumns; i++) {
        newOrder.push(i);
    }
    
    newOrder.reverse();
    for (let i = 0; i < newOrder.length; i++) {
        let j = Math.floor(Math.random() * newOrder.length);
        let tmp = newOrder[i];
        newOrder[i] = newOrder[j];
        newOrder[j] = tmp;
    }
    
    pieces.forEach((piece, index) => {
        const suffix = currentLevel === 'easy' ? 'S' : currentLevel === 'medium' ? 'M' : currentLevel === 'legend' ? 'L' : '';
        piece.src = `./images/${newOrder[index]}${suffix}.jpg`;
    });

    // Reset turns count
    turns = 0;
    document.getElementById("turns").innerText = "Total Langkah :" + turns;

    // Panggil fungsi checkCorrectPieces() untuk memperbarui jumlah potongan yang benar
    checkCorrectPieces(currentRows, currentColumns, currentLevel);
}


// Event listener untuk tombol reset
document.getElementById('reset-button').addEventListener('click', function() {
    resetPuzzle();
});

// Function to save puzzle as image
// document.getElementById('save-button').addEventListener('click', function() {
//     // Gabungkan semua tile menjadi satu gambar di canvas
//     const board = document.getElementById('board');
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');

//     const tiles = board.getElementsByTagName('img');
//     const tileWidth = tiles[0].naturalWidth; // gunakan ukuran asli gambar
//     const tileHeight = tiles[0].naturalHeight; // gunakan ukuran asli gambar
//     const rows = board.style.gridTemplateRows.split(' ').length;
//     const columns = board.style.gridTemplateColumns.split(' ').length;

//     canvas.width = columns * tileWidth;
//     canvas.height = rows * tileHeight;

//     Array.from(tiles).forEach((tile, index) => {
//         const x = (index % columns) * tileWidth;
//         const y = Math.floor(index / columns) * tileHeight;
//         ctx.drawImage(tile, x, y, tileWidth, tileHeight);
//     });

//     // Download gambar sebagai 
//     const link = document.createElement('a');
//     link.download = 'puzzle-result.png';
//     link.href = canvas.toDataURL('image/png');
//     link.click();

//     // Tampilkan popup
//     const popup = document.getElementById('popup');
//     const themeNameElement = document.getElementById('theme-name'); 
//     const selectedThemeName = "Tema Puzzle"; 
//     themeNameElement.textContent = selectedThemeName;
//     popup.classList.add('active');
  
//     // Mainkan audio
//     const audio = document.getElementById('congratulations-audio');
//     audio.volume = 0.3;
//     audio.play();
  
//     // Membacakan teks yang muncul di popup
//     speakText(popup.textContent);
// });

// // Event listener for close popup button
// document.getElementById('close-popup').addEventListener('click', function() {
//     // Sembunyikan popup
//     const popup = document.getElementById('popup');
//     popup.classList.remove('active');
// });

// Function to speak text
function speakText(text) {
    speechSynthesis.cancel(); 

    const maxLength = 150;
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);

    let index = 0;

    function speakPart() {
        if (index < sentences.length) {
            const sentence = sentences[index];
            index++;

            const utterance = new SpeechSynthesisUtterance(sentence);
            utterance.lang = 'id-ID';

            utterance.onend = function () {
                speakPart();
            };

            speechSynthesis.speak(utterance);
        }
    }

    speakPart();
}
