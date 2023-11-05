# typescript-chess

A chess engine written in pure typescript (Work in progress)

## TODO
- [x] Base Data Structures
- [x] GameState
- [x] Fen serialize/deserialize
- [x] Print utils
  - [x] Unicode
  - [ ] ASCII
- [x] Move Handling
  - [x] Normal Moves
  - [x] EnPassant
  - [x] Castling
- [x] Move Validation
  - [x] Normal Moves
  - [x] EnPassant
  - [x] Castling
- [x] Check/CheckMate identification
- [x] Detect Draw
- [x] Detect Stalemate
- [ ] Clean up tests (use multiple describes)
- [x] CLI Example
- [ ] Cleanup/Organize
- [x] Add helper for testing/simulating moves instead of mutating the game state and rolling back
- [ ] Add simple bot that tries to win based on n move look ahead results
- [X] Add PGN parser (simple)
- [ ] Store game state as PGN
