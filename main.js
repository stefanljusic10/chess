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

// GENERATE CHESS TABLE WITH PIECES ---------------------------------------------------------
function generateChessboard(fen){
    const fenCopy = fen.slice(0, fen.indexOf(' ')).split('/')

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piecePath = piecesImagePath[fenCopy[i][j]]
            const square = document.createElement('div')
            const pieceImg = document.createElement('img')
            square.className = 'square'
            square.id = `${i}-${j}`
            // square.setAttribute('draggable', true)

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
// GENERATING DATA FOR EACH SQUARE ON TABLE -------------------------------------------------
function getSquareData(fen){
    let temp = []
    let fenCopy = fen.slice(0, fen.indexOf(' ')).split('/')
    
    for (let i = 0; i < fenCopy.length; i++) {
        temp[i] = []
        for (let j = 0; j < fenCopy[i].length; j++) {
            let square = fenCopy[i][j]
            let color
            // check if there is a piece and if it is white or black
            if(isNaN(square) && square === square.toUpperCase()){
                color = 'white'
                temp[i].push({ square, color })
            }
            if(isNaN(square) && square === square.toLowerCase()){
                color = 'black'
                temp[i].push({ square, color })
            }
            if(!isNaN(square)) {
                let emptySquare = Number(square)
                temp[i] = new Array(emptySquare).fill({})
            }
        }
    }
    return temp
}

// FUNCTION CALLS ---------------------------------------------------------------------------
generateChessboard(FEN)
const squaresData = getSquareData(FEN)
console.log(squaresData);


// MOVE PIECES ------------------------------------------------------------------------------
// validation
table.addEventListener('click', (e) => {
    if(e.target.tagName === 'IMG'){
        // let square = e.target.parentNode
        let [x, y] = e.target.parentNode.id.split('-')
        selectedPiece.from = { row: Number(x), col: Number(y) }
        pieceIsSelected = !pieceIsSelected
        // if(pieceIsSelected)
        //     square.style.filter = 'brightness(90%)'
        // else square.style.filter = null
    }
    if(pieceIsSelected && e.target.tagName === 'DIV'){
        // generate new fen and the call generateChessboard()
        let fenCopy = FEN.slice(0, FEN.indexOf(' ')).split('/').map(e => [...e])
        // pomeranje figura
        // piece move needs to be vaildated
        let [x, y] = e.target.id.split('-')
        selectedPiece.to = { row: Number(x), col: Number(y) }
        let pieceFrom = document.getElementById(`${selectedPiece.from.row}-${selectedPiece.from.col}`)
        let getPieceFrom = pieceFrom.firstChild
        pieceFrom.removeChild(getPieceFrom)
        let pieceTo = document.getElementById(`${selectedPiece.to.row}-${selectedPiece.to.col}`)
        pieceTo.appendChild(getPieceFrom)
        isWhiteMove = !isWhiteMove
        pieceIsSelected = false
    }
})