const table = document.querySelector('.table')
// FEN -> string with pieces starting position 
// lowercase characters -> black pieces
// uppercase characters -> white pieces
const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const selected = { from: null, to: null }
let isWhiteMove = true
let pieceIsSelected = false
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


// GENERATING 8x8 MATRIX - OBJECT FOR EACH SQUARE ON TABLE ----------------------------------------------------------
function getSquareData(fen){
    // temp is 8x8 matrix which contains object data for each square
    let temp = []
    let fenCopy = fen.slice(0, fen.indexOf(' ')).split('/')
    
    for (let i = 0; i < fenCopy.length; i++) {
        temp[i] = []
        for (let j = 0; j < fenCopy[i].length; j++) {
            let piece = fenCopy[i][j]
            // uppercase indicates white pieces, lowercase black pieces, number empty square without piece
            if(isNaN(piece) && piece === piece.toUpperCase())
                temp[i].push({ piece, color: 'white', isMoved: false })
            if(isNaN(piece) && piece === piece.toLowerCase())
                temp[i].push({ piece, color: 'black', isMoved: false })
            if(!isNaN(piece)) 
                temp[i] = new Array(Number(piece)).fill({})
        }
    }
    return temp
}
// PASS MATRIX WITH SQUARE OBJECTS AND GENERATE CHESSBOARD ----------------------------------------------------------
function generateChessboard(squares){
    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares[i].length; j++) {
            const piecePath = (isEmpty(squares[i][j])) ? null : piecesImagePath[squares[i][j].piece]
            const square = document.createElement('div')
            const pieceImg = document.createElement('img')
            // each div id contains i-j coordinate
            square.id = `${i}-${j}`
            square.className = 'square'
            square.style.backgroundColor = ((i + j) % 2 === 0) ? '#DEE3E6' : '#8CA2AD'

            if(piecePath){
                pieceImg.src = `${piecePath}`
                square.appendChild(pieceImg)
            }

            table.appendChild(square)
        }
    }
}
// RESET CHESSBOAR --------------------------------------------------------------------------------------------------
function resetChessBoard(){
    table.innerHTML = ''
}
// IF THERE IS NO PIECE ON THE SQUARE -------------------------------------------------------------------------------
function isEmpty(square){
    if(Object.keys(square).length === 0)
        return true
    else return false
}
// CHECK VALID PIECE MOVES ------------------------------------------------------------------------------------------
function isValidPawnMove(piece, from, to){
    let [fromRow, fromCol, toRow, toCol] = [from.row, from.col, to.row, to.col].map((num) => Number(num))
    let rowDiff = Math.abs(toRow - fromRow)
    let colDiff = Math.abs(toCol - fromCol)
    // console.log(isEmpty(squaresData[toRow][toCol]));

    if(piece.color === 'white' && toRow < fromRow){
        if(piece.isMoved === false && rowDiff <= 2 && colDiff === 0)
            return true
        if(piece.isMoved === true && rowDiff === 1 && colDiff === 0)
            return true
        if(rowDiff === 1 && colDiff === 1 && !isEmpty(squaresData[toRow][toCol]))
            return true
    }

    if(piece.color === 'black' && toRow > fromRow){
        if(piece.isMoved === false && rowDiff <= 2 && colDiff === 0)
            return true
        if(piece.isMoved === true && rowDiff === 1 && colDiff === 0)
            return true
        if(rowDiff === 1 && colDiff === 1 && !isEmpty(squaresData[toRow][toCol]))
            return true
    }

    return false
}
function isValidMove(piece, from, to){
    let pieceName = piece.piece.toLowerCase()

    // pawn
    if(pieceName === 'p') 
        return isValidPawnMove(piece, from, to)
}
// MOVE PIECES ------------------------------------------------------------------------------------------------------
function movePiece(e){
    let clickedPiece = (e.target.tagName === 'IMG')
    let clickedSquare = (e.target.tagName === 'DIV')

    // piece is clicked
    if(clickedPiece){
        // check is white or black move
        if(isWhiteMove){
            let [row, col] = e.target.parentNode.id.split('-')
            // get position of selected white piece and assign to global variable -> selected
            if(squaresData[row][col].color === 'white'){
                selected.from = { row, col }
                pieceIsSelected = true
            }
        }
        else{
            let [row, col] = e.target.parentNode.id.split('-')
            // get position of selected black piece
            if(squaresData[row][col].color === 'black'){
                selected.from = { row, col }
                pieceIsSelected = true
            }
        }
    }
    // click square where we want to move a piece
    if(pieceIsSelected){
        // get coordinates of clicked piece or square and assign to global variable -> selected
        let [row, col] = (clickedPiece) ? e.target.parentElement.id.split('-') : e.target.id.split('-')
        selected.to = { row, col }
        let pieceToMove = squaresData[selected.from.row][selected.from.col]

        // validating piece move, isValidMove() return true or false
        if(isValidMove(pieceToMove, selected.from, selected.to)){
            squaresData[selected.to.row][selected.to.col] = { ...pieceToMove, isMoved: true }
            squaresData[selected.from.row][selected.from.col] = {}
            // console.log(squaresData);
        
            resetChessBoard();
            generateChessboard(squaresData);
        
            isWhiteMove = !isWhiteMove
            pieceIsSelected = false
        }
    }
}


// FUNCTION CALLS ---------------------------------------------------------------------------------------------------
let squaresData = getSquareData(FEN)
generateChessboard(squaresData)
// EVENT LISTENER - MOVE PIECES -------------------------------------------------------------------------------------
table.addEventListener('click', movePiece)