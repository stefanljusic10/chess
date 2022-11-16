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


// GENERATING OBJECT FOR EACH SQUARE ON TABLE -----------------------------------------------------------------------
function getSquareData(fen){
    // temp is 8x8 matrix which contains object data for each square
    let temp = []
    let fenCopy = fen.slice(0, fen.indexOf(' ')).split('/')
    
    for (let i = 0; i < fenCopy.length; i++) {
        temp[i] = []
        for (let j = 0; j < fenCopy[i].length; j++) {
            let piece = fenCopy[i][j]
            let color
            // uppercase indicates white pieces, lowercase -> black pieces
            if(isNaN(piece) && piece === piece.toUpperCase()){
                color = 'white'
                temp[i].push({ piece, color, isMoved: false })
            }
            if(isNaN(piece) && piece === piece.toLowerCase()){
                color = 'black'
                temp[i].push({ piece, color, isMoved: false })
            }
            // if there is no piece, push empty object into matrix
            if(!isNaN(piece)) {
                let emptySquare = Number(piece)
                temp[i] = new Array(emptySquare).fill({})
            }
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
            square.className = 'square'
            // each div id contains i-j coordinate
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
    let [fromRow, fromCol, toRow, toCol] = [from.row, from.col, to.row, to.col].map((e) => Number(e))
    console.log(isEmpty(squaresData[fromRow + 1][fromCol]));
    let rowMove = Math.abs(to.row - from.row)
    let colMove = Math.abs(to.col - from.col)
    let whiteCanGoForward = (to.row - from.row > 0) ? true : false
    let blackCanGoForward = (to.row - from.row > 0) ? false : true

    if(piece.color === 'white' && to.row > 0){
        
    }
    if(piece.color === 'black' && to.row < 7){
        
    }
}
function isValidMove(piece, from, to){
    let pieceName = piece.piece.toLowerCase()

    // pawn
    if(pieceName === 'p') 
        return isValidPawnMove(piece, from, to)
}
// MOVE PIECES ------------------------------------------------------------------------------------------------------
function movePiece(e){
    // piece is clicked
    if(e.target.tagName === 'IMG'){
        // check is white or black move
        if(isWhiteMove){
            let [row, col] = e.target.parentNode.id.split('-')
            // get position of selected white piece and assign to global variable -> selected
            if(squaresData[row][col].color === 'white'){
                selected.from = { row, col }
                pieceIsSelected = !pieceIsSelected
            }
        }
        else{
            let [row, col] = e.target.parentNode.id.split('-')
            // get position of selected black piece
            if(squaresData[row][col].color === 'black'){
                selected.from = { row, col }
                pieceIsSelected = !pieceIsSelected
            }
        }
    }
    // click square where we want to move a piece
    if(pieceIsSelected && e.target.tagName === 'DIV'){
        // get coordinates of selected square and assign to global variable -> selected
        let [row, col] = e.target.id.split('-')
        selected.to = { row, col }
        let pieceToMove = squaresData[selected.from.row][selected.from.col]

        // moving pieces without validation
        squaresData[selected.to.row][selected.to.col] = { ...pieceToMove, isMoved: true }
        squaresData[selected.from.row][selected.from.col] = {}
    
        resetChessBoard();
        generateChessboard(squaresData);

        isWhiteMove = !isWhiteMove
        pieceIsSelected = false

        // validating piece move, isValidMove() return true or false
        // if(isValidMove(pieceToMove, selected.from, selected.to)){
        //     squaresData[selected.to.row][selected.to.col] = { ...pieceToMove, isMoved: true }
        //     squaresData[selected.from.row][selected.from.col] = {}
    
        //     resetChessBoard();
        //     generateChessboard(squaresData);
    
        //     isWhiteMove = !isWhiteMove
        //     pieceIsSelected = false
        // }
    }
}


// FUNCTION CALLS ---------------------------------------------------------------------------------------------------
let squaresData = getSquareData(FEN)
generateChessboard(squaresData)
// EVENT LISTENER - MOVE PIECES -------------------------------------------------------------------------------------
table.addEventListener('click', movePiece)