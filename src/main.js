const table = document.querySelector('.table')
const modalPickPiece = document.querySelector('.modal')
const piecesBox = document.querySelector('.pieces-box')
// FEN -> string with pieces starting position 
// lowercase characters -> black pieces
// uppercase characters -> white pieces
const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const selected = { from: null, to: null }
let isWhiteMove = true
let pieceIsSelected = false
const piecesImagePath = {
    P: './src/assets/whitepawn.svg',
    N: './src/assets/whitenight.svg',
    B: './src/assets/whitebishop.svg',
    R: './src/assets/whiterook.svg',
    K: './src/assets/whiteking.svg',
    Q: './src/assets/whitequeen.svg',
    p: './src/assets/blackpawn.svg',
    n: './src/assets/blacknight.svg',
    b: './src/assets/blackbishop.svg',
    r: './src/assets/blackrook.svg',
    k: './src/assets/blackking.svg',
    q: './src/assets/blackqueen.svg'
}
const availablePieces = [
    { piece: 'r', color: 'black', isMoved: true },
    { piece: 'n', color: 'black', isMoved: true },
    { piece: 'b', color: 'black', isMoved: true },
    { piece: 'q', color: 'black', isMoved: true },
    { piece: 'R', color: 'white', isMoved: true },
    { piece: 'N', color: 'white', isMoved: true },
    { piece: 'B', color: 'white', isMoved: true },
    { piece: 'Q', color: 'white', isMoved: true },
]

// ------------> FUNCTION DEFINITIONS <--------------
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

    for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp[i].length; j++) {
            temp[i][j] = { ...temp[i][j], num: i*8 + j, row: i, col: j }
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
            square.id = `${i}-${j}-${squares[i][j].num}`
            square.className = 'square'
            square.style.backgroundColor = ((i + j) % 2 === 0) ? '#DEE3E6' : '#8CA2AD'
            pieceImg.className = 'pieceImg'

            if(piecePath){
                pieceImg.src = `${piecePath}`
                square.appendChild(pieceImg)
            }

            table.appendChild(square)
        }
    }
}
// RESET CHESSBOAR --------------------------------------------------------------------------------------------------
function resetChessboard(){
    table.innerHTML = ''
}
// RESET PIECES BOX -------------------------------------------------------------------------------------------------
function resetPiecesBox(){
    piecesBox.innerHTML = ''
}
// IF THERE IS NO PIECE ON THE SQUARE -------------------------------------------------------------------------------
function isEmpty(square){
    // if(Object.keys(square).length === 0)
    if(square.hasOwnProperty('piece'))
        return false
    else return true
}
// CHECK VALID PAWN MOVES -------------------------------------------------------------------------------------------
function isValidPawnMove(piece, from, to){
    const [fromRow, fromCol, toRow, toCol] = [from.row, from.col, to.row, to.col].map((num) => Number(num))
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)
    const isEmptySquare = isEmpty(squaresData[toRow][toCol])

    if(piece.color === 'white' && toRow < fromRow){
        if(rowDiff === 1 && colDiff <= 1 && toRow === 0)
            toggleModal(piece)
        if(piece.isMoved === false && rowDiff <= 2 && colDiff === 0 && isEmptySquare)
            return true
        if(piece.isMoved === true && rowDiff === 1 && colDiff === 0 && isEmptySquare)
            return true
        if(rowDiff === 1 && colDiff === 1 && !isEmptySquare)
            return true
        // an passant - to do
    }

    if(piece.color === 'black' && toRow > fromRow){
        if(rowDiff === 1 && colDiff <= 1 && toRow === 7)
            toggleModal(piece)
        if(piece.isMoved === false && rowDiff <= 2 && colDiff === 0 && isEmptySquare)
            return true
        if(piece.isMoved === true && rowDiff === 1 && colDiff === 0 && isEmptySquare)
            return true
        if(rowDiff === 1 && colDiff === 1 && !isEmpty(squaresData[toRow][toCol]))
            return true
        // an passant - to do
    }

    return false
}
// CHECK VALID KNIGHT MOVES -----------------------------------------------------------------------------------------
function isValidKnightMove(piece, from, to){
    const [fromRow, fromCol, toRow, toCol] = [from.row, from.col, to.row, to.col].map((num) => Number(num))
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)

    if(rowDiff + colDiff === 3 && squaresData[toRow, toCol].color !== piece.color)
        return true
}
// CHECK VALID BISHOP MOVES -----------------------------------------------------------------------------------------
function isValidBishopMove(piece, from, to){
    const [fromRow, fromCol, fromNum, toRow, toCol, toNum] = [from.row, from.col, from.num, to.row, to.col, to.num].map((num) => Number(num))
    let flag = false

    // up left direction - diff 9
    if(fromRow > toRow && fromCol > toCol){
        for (let i = fromNum - 9; i >= toNum; i-=9) {
            let nextSquare = squaresData.find(row => row.find(e => e.num === i)).filter(e => e.num === i)[0]
            if(squaresData[nextSquare.row][nextSquare.col].color === piece.color)
                return false
            else flag = true
        }
        return flag
    }
    
    // up right direction - diff 7
    if(fromRow > toRow && fromCol < toCol){
        for (let i = fromNum - 7; i >= toNum; i-=7) {
            let nextSquare = squaresData.find(row => row.find(e => e.num === i)).filter(e => e.num === i)[0]
            if(squaresData[nextSquare.row][nextSquare.col].color === piece.color)
                return false
            else flag = true
        }
        return flag
    }

    // bottom left direction - diff 7
    if(fromRow < toRow && fromCol > toCol){
        for (let i = fromNum + 7; i <= toNum; i+=7) {
            let nextSquare = squaresData.find(row => row.find(e => e.num === i)).filter(e => e.num === i)[0]
            if(squaresData[nextSquare.row][nextSquare.col].color === piece.color)
                return false
            else flag = true
        }
        return flag
    }

    // bottom right direction - diff 9
    if(fromRow < toRow && fromCol < toCol){
        for (let i = fromNum + 9; i <= toNum; i+=9) {
            let nextSquare = squaresData.find(row => row.find(e => e.num === i)).filter(e => e.num === i)[0]
            if(squaresData[nextSquare.row][nextSquare.col].color === piece.color)
                return false
            else flag = true
        }
        return flag
    }

    //     for (let i = 0; i < 8; i++) {
    //         for (let j = 0; j < 8; j++) {
    //             // generating all possible squares for bishop
    //             if(
    //                 ((i + j === fromRow + fromCol)
    //                 ||
    //                 (Math.abs(i - j) === Math.abs(fromRow - fromCol) && fromRow - i === fromCol - j))
    //                 &&
    //                 i !== fromRow
    //                 &&
    //                 j !== fromCol
    //             )
    //                 bishopMoves.push([i, j])
    //         }
    //     }
    //    console.log(bishopMoves);
    // }

    // return flag
}
// CHECK VALID ROOK MOVES -------------------------------------------------------------------------------------------
function isValidRookMove(piece, from, to){
    let [fromRow, fromCol, fromNum, toRow, toCol, toNum] = [from.row, from.col, from.num, to.row, to.col, to.num].map((num) => Number(num))
    let flag = false

    // rook moves left - diff 1
    if(fromRow === toRow && fromCol > toCol){
        for (let i = fromNum - 1; i >= toNum; i--){
            let nextSquare = squaresData.find(row => row.find(e => e.num === i)).filter(e => e.num === i)[0]
            if(squaresData[nextSquare.row][nextSquare.col].color === piece.color)
                return false
            else flag = true
        }
        return flag
    }

    // rook moves right - diff 1
    if(fromRow === toRow && fromCol < toCol){
        for (let i = fromNum + 1; i <= toNum; i++){
            let nextSquare = squaresData.find(row => row.find(e => e.num === i)).filter(e => e.num === i)[0]
            if(squaresData[nextSquare.row][nextSquare.col].color === piece.color)
                return false
            else flag = true
        }
        return flag
    }

    // rook moves up - diff 8
    if(fromRow > toRow && fromCol === toCol){
        for (let i = fromNum - 8; i >= toNum; i-=8){
            let nextSquare = squaresData.find(row => row.find(e => e.num === i)).filter(e => e.num === i)[0]
            if(squaresData[nextSquare.row][nextSquare.col].color === piece.color)
                return false
            else flag = true
        }
        return flag
    }

    // rook moves down - diff 8
    if(fromRow < toRow && fromCol === toCol){
        for (let i = fromNum + 8; i <= toNum; i+=8){
            let nextSquare = squaresData.find(row => row.find(e => e.num === i)).filter(e => e.num === i)[0]
            if(squaresData[nextSquare.row][nextSquare.col].color === piece.color)
                return false
            else flag = true
        }
        return flag
    }
}
// CHECK VALID QUEEN MOVE -------------------------------------------------------------------------------------------
function isValidQueenMove(piece, from, to){
    if(isValidBishopMove(piece, from, to) || isValidRookMove(piece, from, to))
        return true
    else return false
}
// CHECK VALID King MOVE -------------------------------------------------------------------------------------------
function isValidKingMove(piece, from, to){
    const [fromRow, fromCol, toRow, toCol] = [from.row, from.col, to.row, to.col].map((num) => Number(num))
    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)


    // check if square is attacked by other pieces
    if(isValidQueenMove(piece, from, to) && rowDiff <= 1 && colDiff <= 1)
        return true
    else return false
}
// CHECK ALL PIECES MOVES -------------------------------------------------------------------------------------------
function isValidMove(piece, from, to){
    let pieceName = piece.piece.toLowerCase()

    // pawn
    if(pieceName === 'p') 
        return isValidPawnMove(piece, from, to)
    // knight
    if(pieceName === 'n')
        return isValidKnightMove(piece, from, to)
    // bishop
    if(pieceName === 'b')
        return isValidBishopMove(piece, from, to)
    // rook
    if(pieceName === 'r')
        return isValidRookMove(piece, from, to)
    // queen
    if(pieceName === 'q')
        return isValidQueenMove(piece, from, to)
    // king
    if(pieceName === 'k')
        return isValidKingMove(piece, from, to)
}
// IS KING CHECKED
function isKingChecked(){

}
// MOVE PIECES ------------------------------------------------------------------------------------------------------
function movePiece(e){
    let clickedPiece = (e.target.tagName === 'IMG')

    // piece is clicked
    if(clickedPiece){
        // check is white or black move
        if(isWhiteMove){
            let [row, col, num] = e.target.parentNode.id.split('-')
            // get position of selected white piece and assign to global variable -> selected
            if(squaresData[row][col].color === 'white'){
                selected.from = { row, col, num }
                pieceIsSelected = true
            }
        }
        else{
            let [row, col, num] = e.target.parentNode.id.split('-')
            // get position of selected black piece
            if(squaresData[row][col].color === 'black'){
                selected.from = { row, col, num }
                pieceIsSelected = true
            }
        }
    }
    // click square where we want to move a piece
    if(pieceIsSelected){
        // get coordinates of clicked piece or square and assign to global variable -> selected
        let [row, col, num] = (clickedPiece) ? e.target.parentElement.id.split('-') : e.target.id.split('-')
        selected.to = { row, col, num }
        let pieceToMove = squaresData[selected.from.row][selected.from.col]

        // validating piece move, isValidMove() return true or false
        if(isValidMove(pieceToMove, selected.from, selected.to)){
            let fromRow = Number(selected.from.row)
            let fromCol = Number(selected.from.col)
            let toRow = Number(selected.to.row)
            let toCol = Number(selected.to.col)
            let numTo = squaresData[selected.to.row][selected.to.col].num
            let numFrom = squaresData[selected.from.row][selected.from.col].num

            // moving piece, updating squareData objects
            squaresData[selected.to.row][selected.to.col] = { ...pieceToMove, isMoved: true, row: toRow, col: toCol, num: numTo }
            squaresData[selected.from.row][selected.from.col] = { row: fromRow, col: fromCol, num: numFrom }
    
            // generate new chessboard after piece is moved
            resetChessboard();
            generateChessboard(squaresData);
            isWhiteMove = !isWhiteMove
            pieceIsSelected = false
        }
    }
}
// SHOW MODAL, PICK PIECES AFTER PAWN REACHES LAST ROW --------------------------------------------------------------
function toggleModal(piece){
    // generating available pieces images
    let piecesByColor = availablePieces.filter(e => e.color === piece.color)
    for (let i = 0; i < piecesByColor.length; i++) {
        piecesBox.innerHTML += `<img id=${piecesByColor[i].piece} class='available-piece' src=${piecesImagePath[piecesByColor[i].piece]}>`
    }
    modalPickPiece.classList.remove('modal-closed')
}
// PICK PIECE AFTER PAWN REACHES LAST ROW ---------------------------------------------------------------------------
function pickPiece(e){
    let pickedPiece = availablePieces.filter(element => element.piece === e.target.id)[0]
    squaresData[selected.to.row][selected.to.col] = pickedPiece
    modalPickPiece.classList.add('modal-closed')
    pickedPiece = null
    resetPiecesBox()
    resetChessboard()
    generateChessboard(squaresData)
}



// ------------> FUNCTION CALLS <--------------
let squaresData = getSquareData(FEN)
generateChessboard(squaresData)
// EVENT LISTENER - MOVE PIECES -------------------------------------------------------------------------------------
table.addEventListener('click', movePiece)
piecesBox.addEventListener('click', pickPiece)