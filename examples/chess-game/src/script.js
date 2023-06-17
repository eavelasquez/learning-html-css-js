import { rook, knight, bishop, queen, king, pawn } from './pieces.js'

const gameboard = document.querySelector('#gameboard')
const player = document.querySelector('#player-display')
const info = document.querySelector('#info-display')

const boardSize = 8
const pieces = [
  rook, knight, bishop, queen, king, bishop, knight, rook,
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
  rook, knight, bishop, queen, king, bishop, knight, rook
]

function createBoard () {
  pieces.forEach((piece, index) => {
    const square = document.createElement('div')
    const isWhite = (Math.floor(index / boardSize) + index) % 2 === 0

    square.innerHTML = piece
    square.classList.add('square')
    square.classList.add(isWhite ? 'light' : 'dark')
    square.setAttribute('square-index', index)

    if (index <= 15) {
      square.querySelector('svg').classList.add('black')
    }

    if (index >= 48) {
      square.querySelector('svg').classList.add('white')
    }

    gameboard.appendChild(square)
  })
}

createBoard()
