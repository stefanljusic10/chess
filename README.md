# chess from scratch

### Steps:
1. Generate 8x8 global matrix where every element represents a square on a chessboard. Every element(square) is an object which contains different properties according if square is empty or have a piece on it.
2. Generate a chessboard based on the previously generated matrix
3. addEventListener on chessboard which catches clicked square. It is necessary to first click the figure, then click the field where we want to move a piece. There are some important global variables such as: isPieceSelected, isWhiteMove and selected which contains coordinates of clicked piece and coordinates of square where piece should move
4. Validating moves for each clicked piece.
5. If move is valid, the global matrix is updated and new chessboard is generated based on updated matrix

### Ideas to implement
1. Chess clock
2. Showing taken pieces next to the chessboard
3. Drag and drop