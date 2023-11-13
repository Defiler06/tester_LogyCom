const playerOneName = document.querySelector('#playerOne');
const playerTwoName = document.querySelector('#playerTwo');

const form = document.querySelector('.form');
const modal = document.querySelector('.modal');
const backdrop = document.querySelector('.backdrop');

const error = document.querySelector('.error')

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (playerOneName.value.trim() !== '' && playerTwoName.value.trim() !== '') {
        ticTacToeApp.playerOne.username = playerOneName.value.trim();
        ticTacToeApp.playerTwo.username = playerTwoName.value.trim();

        modal.style.display = 'none';
        backdrop.style.display = 'none';

        playerOneName.value = '';
        playerTwoName.value = '';
        error.innerText = '';

        ticTacToeApp.drawBoard();
    } else {
        error.innerText = 'Все поля обязательные'
    }
});

const canvas = document.querySelector('#app');
const ctx = canvas.getContext('2d');

canvas.height = 600;
canvas.width = 600;

const ticTacToeApp = {
    rect: canvas.getBoundingClientRect(),
    cellSize: 200,
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ],
    topWinners: [],
    currentPlayer: 1,
    playerOne: {
        username: '',
        symbol: 'x',
        score: 0,
    },
    playerTwo: {
        username: '',
        symbol: 'o',
        score: 0,
    },
    gameOver: false,
    disabledButton: false,
    drawBoard: function () {
        ctx.beginPath();

        ctx.moveTo(this.cellSize, 10);
        ctx.lineTo(this.cellSize, canvas.height - 10);
        ctx.moveTo(this.cellSize * 2, 10);
        ctx.lineTo(this.cellSize * 2, canvas.height - 10);

        ctx.moveTo(10, this.cellSize);
        ctx.lineTo(canvas.width - 10, this.cellSize);
        ctx.moveTo(10, this.cellSize * 2);
        ctx.lineTo(canvas.width - 10, this.cellSize * 2);

        ctx.strokeStyle = 'rgb(0,0,0,0.2)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
    },
    drawDagger: function (x, y) {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineCap = 'round';
        ctx.lineWidth = 10;

        ctx.moveTo(x - 65, y - 65);
        ctx.lineTo(x + 65, y + 65);
        ctx.moveTo(x + 65, y - 65);
        ctx.lineTo(x - 65, y + 65);

        ctx.stroke();
        ctx.closePath();
    },
    drawCircle: (x, y) => {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 10;

        ctx.arc(x, y, 80, Math.PI * 2, 0, false);

        ctx.stroke();
        ctx.closePath();
    },
    nextButton: function () {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(200, 400, 200, 50);

        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 4;
        ctx.strokeRect(202, 402, 200 - 4, 50 - 4);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Играть снова', 300, 425);
    },
    quitButton: function () {
        ctx.fillStyle = '#53595d';
        ctx.fillRect(200, 470, 200, 50);

        ctx.strokeStyle = '#8f989b';
        ctx.lineWidth = 4;
        ctx.strokeRect(202, 472, 200 - 4, 50 - 4);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Завершить игру', 300, 495);
    },
    leadersButton: function () {
        ctx.fillStyle = '#2C5776';
        ctx.fillRect(70, 70, 40, 5);
        ctx.fillRect(70, 80, 40, 5);
        ctx.fillRect(70, 90, 40, 5);
    },
    drawModal: function (table) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.shadowBlur = 35;
        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.strokeStyle = '#fff';

        ctx.beginPath();
        ctx.moveTo(50, 58);
        ctx.lineTo(50, 544);
        ctx.arcTo(50, 550, 58, 550, 10);
        ctx.lineTo(544, 550);
        ctx.arcTo(550, 550, 550, 544, 10);
        ctx.lineTo(550, 510);
        ctx.arcTo(550, 50, 544, 50, 10);
        ctx.lineTo(510, 50);
        ctx.arcTo(50, 50, 50, 60, 10);

        ctx.stroke();
        ctx.fill();

        this.nextButton();
        this.quitButton();

        if (!table) {
            this.leadersButton();
        }

        ctx.restore();
    },
    drawWinLine: function (combination) {
        ctx.strokeStyle = 'rgb(203,59,59)';
        ctx.lineWidth = 15;
        ctx.lineCap = "round";
        ctx.beginPath();

        for (const [row, col] of combination) {
            const x = col * 200 + 100;
            const y = row * 200 + 100;
            ctx.lineTo(x, y);
        }

        ctx.stroke();
    },
    drawText: function (marginTop, color, colorBlur, sizeBlur, fontWeight, fontSize, fontType, text) {
        ctx.save();
        ctx.lineWidth = 5;
        ctx.shadowColor = colorBlur;
        ctx.shadowBlur = sizeBlur;
        ctx.fillStyle = color;
        ctx.font = `${fontWeight} ${fontSize} ${fontType}`;

        let textWidth = ctx.measureText(text).width;
        let x = (canvas.width - textWidth) / 2;
        let y = canvas.height / 2 + marginTop;

        ctx.fillText(text, x, y);
        ctx.restore();
    },
    drawStatus: function (message) {
        if (message === 'Ничья') {
            this.drawText(-150, '#FFC107', "#FFEB3B", 12, 'bold', '45px', 'Arial', message);
            this.drawText(-110, '#2C5776', "#577593", 2, 'bold', '35px', 'Arial', 'Попробуйте снова');
            this.drawScores();
        } else {
            this.drawText(-150, '#FFC107', "#FFEB3B", 12, 'bold', '45px', 'Arial', 'Победитель');
            this.drawText(-110, '#2C5776', "#577593", 2, 'bold', '35px', 'Arial', message);
            this.drawScores();
        }
    },
    drawScores: function () {
        this.drawText(10, '#2C5776', "#577593", 2, 'bold', '30px', 'Arial', `${ticTacToeApp.playerOne.username} - ${ticTacToeApp.playerOne.score}`);
        this.drawText(50, '#2C5776', "#577593", 2, 'bold', '30px', 'Arial', `${ticTacToeApp.playerTwo.username} - ${ticTacToeApp.playerTwo.score}`);
    },
    drawLeaderboard: function () {
        this.topWinners.sort((a, b) => b.score - a.score);

        this.drawText(-200, '#FFC107', "#FFEB3B", 12, 'bold', '35px', 'Arial', 'Таблица лидеров');
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';

        if (this.topWinners.length >= 1) {
            for (let i = 0; i < 10; i++) {
                const player = this.topWinners[i];
                if (player !== undefined) {
                    const rowY = 150 + i * 25;

                    ctx.fillText(`${i + 1}.${player.username}`, 80, rowY);
                    ctx.fillText(player.score, canvas.width - 100, rowY);
                }
            }
        } else {
            this.drawText(-150, '#2C5776', "#577593", 2, 'bold', '25px', 'Arial', 'Таблица пустая');
        }
    },
    checkLine: function (a, b, c) {
        return a !== '' && a === b && b === c;
    },
    checkWinner: function () {
        for (let i = 0; i < 3; i++) {
            if (this.checkLine(this.board[i][0], this.board[i][1], this.board[i][2])) {
                return {winner: this.board[i][0], combination: [[i, 0], [i, 1], [i, 2]]};
            }

            if (this.checkLine(this.board[0][i], this.board[1][i], this.board[2][i])) {
                return {winner: this.board[0][i], combination: [[0, i], [1, i], [2, i]]};
            }
        }

        if (this.checkLine(this.board[0][0], this.board[1][1], this.board[2][2])) {
            return {winner: this.board[0][0], combination: [[0, 0], [1, 1], [2, 2]]};
        }

        if (this.checkLine(this.board[0][2], this.board[1][1], this.board[2][0])) {
            return {winner: this.board[0][2], combination: [[0, 2], [1, 1], [2, 0]]};
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (ticTacToeApp.board[i][j] === '') {
                    return null;
                }
            }
        }

        return 'Ничья';
    },
    resetGame: function () {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.gameOver = false;
        this.disabledButton = false;
        this.currentPlayer = 1;
        ctx.clearRect(0, 0, 600, 600);
    },
    resetPlayers: function () {
        this.playerOne = {
            username: '',
            symbol: 'x',
            score: 0,
        };

        this.playerTwo = {
            username: '',
            symbol: 'o',
            score: 0,
        };
    },
    endGame: function (winner, username) {
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ticTacToeApp.drawModal(false);
            ticTacToeApp.drawStatus(`${username} - ${winner}`);
            ticTacToeApp.disabledButton = true;
        }, 1000);
    }
};

const endGame = (winner, username) => {
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ticTacToeApp.drawModal(false);
        ticTacToeApp.drawStatus(`${username} - ${winner}`);
        ticTacToeApp.disabledButton = true;
    }, 1000);
};

handleMouseClick = (event) => {
    const x = event.clientX - ticTacToeApp.rect.left;
    const y = event.clientY - ticTacToeApp.rect.top;

    const row = Math.floor(y / ticTacToeApp.cellSize);
    const col = Math.floor(x / ticTacToeApp.cellSize);

    const cellCenterX = col * ticTacToeApp.cellSize + ticTacToeApp.cellSize / 2;
    const cellCenterY = row * ticTacToeApp.cellSize + ticTacToeApp.cellSize / 2;


    if (ticTacToeApp.board[row][col] === '' && !ticTacToeApp.gameOver) {
        if (ticTacToeApp.currentPlayer === 1) {
            ticTacToeApp.board[row][col] = 'x';
            ticTacToeApp.drawDagger(cellCenterX, cellCenterY);
            ticTacToeApp.currentPlayer = 2;
        } else {
            ticTacToeApp.board[row][col] = 'o';
            ticTacToeApp.drawCircle(cellCenterX, cellCenterY);
            ticTacToeApp.currentPlayer = 1;
        }
    }

    const winner = ticTacToeApp.checkWinner();

    if (winner && !ticTacToeApp.gameOver) {
        ticTacToeApp.gameOver = true;

        if (winner === 'Ничья') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ticTacToeApp.drawModal();
            ticTacToeApp.drawStatus(winner);
            ticTacToeApp.disabledButton = true;
        } else {
            if (winner.winner === 'x') {
                ticTacToeApp.playerOne.score++;
                ticTacToeApp.drawWinLine(winner.combination);

                ticTacToeApp.endGame(winner.winner, ticTacToeApp.playerOne.username);
            } else {
                ticTacToeApp.playerTwo.score++;
                ticTacToeApp.drawWinLine(winner.combination);

                ticTacToeApp.endGame(winner.winner, ticTacToeApp.playerTwo.username);
            }
        }
    }

    if (x >= 200 && x <= 400 && y >= 400 && y <= 450 && ticTacToeApp.disabledButton) {
        ticTacToeApp.resetGame();
        ticTacToeApp.drawBoard();
    }

    if (x >= 200 && x <= 400 && y >= 470 && y <= 520 && ticTacToeApp.disabledButton) {
        ticTacToeApp.topWinners.push(ticTacToeApp.playerOne, ticTacToeApp.playerTwo);
        ticTacToeApp.resetGame();
        ticTacToeApp.resetPlayers()
        modal.style.display = 'block';
        backdrop.style.display = 'block';
    }

    if (x >= 70 && x <= 110 && y >= 70 && y <= 110 && ticTacToeApp.disabledButton) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ticTacToeApp.drawModal(true);
        ticTacToeApp.drawLeaderboard();
    }
};

canvas.addEventListener('click', handleMouseClick);
window.addEventListener('resize', () => {
    ticTacToeApp.rect = canvas.getBoundingClientRect();
});
