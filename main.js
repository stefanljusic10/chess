const table = document.querySelector('.table')
const piecesImagePath = {
    P: './assets/whitepawn.svg',
    N: './assets/whitenight.svg',
    B: './assets/whitebishop.svg',
    R: './assets/whiterook.svg',
    K: './assets/whiteking.svg',
    Q: './assets/whitequeen.svg',
    p: './assets/blackpawn.svg',
    n: './assets/blacknight.svg',
    b: './assets/blackbishop.svg',
    r: './assets/blackrook.svg',
    k: './assets/blackking.svg',
    q: './assets/blackqueen.svg'
}
// FEN - default position of pieces
const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
let isWhiteMove = true
let selectedPiece = { from: null, to: null }
let pieceIsSelected = false



// GENERATING DATA OBJECT FOR EACH SQUARE ON TABLE ------------------------------------------
function getSquareData(fen){
    let temp = []
    let fenCopy = fen.slice(0, fen.indexOf(' ')).split('/')
    
    for (let i = 0; i < fenCopy.length; i++) {
        temp[i] = []
        for (let j = 0; j < fenCopy[i].length; j++) {
            let piece = fenCopy[i][j]
            let color
            // check if there is a piece and if it is white or black
            if(isNaN(piece) && piece === piece.toUpperCase()){
                color = 'white'
                temp[i].push({ piece, color, isMoved: false })
            }
            if(isNaN(piece) && piece === piece.toLowerCase()){
                color = 'black'
                temp[i].push({ piece, color, isMoved: false })
            }
            if(!isNaN(piece)) {
                let emptySquare = Number(piece)
                temp[i] = new Array(emptySquare).fill({})
            }
        }
    }
    return temp
}
// PASS SQUARES AND GENERATE CHESSBOARD -----------------------------------------------------
function generateChessboard(squares){
    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares[i].length; j++) {
            const piecePath = (isEmpty(squares[i][j])) ? null : piecesImagePath[squares[i][j].piece]
            const square = document.createElement('div')
            const pieceImg = document.createElement('img')
            square.className = 'square'
            square.id = `${i}-${j}`

            if((i + j) % 2 === 1)
                square.style.backgroundColor = '#DEE3E6'
            else square.style.backgroundColor = '#8CA2AD'

            if(piecePath){
                pieceImg.src = `${piecePath}`
                square.appendChild(pieceImg)
            }

            table.appendChild(square)
        }
    }
}
// MOVE PIECES ------------------------------------------------------------------------------
function movePieces(e, squares){
    if(e.target.tagName === 'IMG'){
        let [x, y] = e.target.parentNode.id.split('-')
        selectedPiece.from = { row: Number(x), col: Number(y) }
        pieceIsSelected = !pieceIsSelected
    }
    if(pieceIsSelected && e.target.tagName === 'DIV'){
        // pomeranje figura
        // piece move needs to be vaildated
        let [x, y] = e.target.id.split('-')
        selectedPiece.to = { row: Number(x), col: Number(y) }
        let pieceToMove = squares[selectedPiece.from.row][selectedPiece.from.col]
        squares[selectedPiece.to.row][selectedPiece.to.col] = { ...pieceToMove, isMoved: true }
        squares[selectedPiece.from.row][selectedPiece.from.col] = {}
        resetChessBoard();
        generateChessboard(squares);

        // reseting default values after piece was moved
        selectedPiece.from = null
        selectedPiece.to = null
        isWhiteMove = !isWhiteMove
        pieceIsSelected = false
    }
}
// IF SQUARE IS EMPTY
function isEmpty(square){
    if(Object.keys(square).length === 0)
        return true
    else return false
}
// RESET CHESSBOAR
function resetChessBoard(){
    table.innerHTML = ''
}

// FUNCTION CALLS ---------------------------------------------------------------------------
let squaresData = getSquareData(FEN)
generateChessboard(squaresData)

// EVENT LISTENER - MOVE PIECES -------------------------------------------------------------
table.addEventListener('click', (e) => { movePieces(e, squaresData) })