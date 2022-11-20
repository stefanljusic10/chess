# chess from scratch

### Steps:
1. Generate 8x8 global matrix where every element represents a square on a chessboard. Every element(square) is an object which contains different properties according if square is empty or have a piece on it.
2. Generate a chessboard based on the previously generated matrix
3. addEventListener on chessboard which catches clicked square. It is necessary to first click the figure, then click the field where we want to move a piece
4. Validating moves for each clicked piece.
5. If move is valid, the global matrix is updated and new chessboard is generated based on updated matrix