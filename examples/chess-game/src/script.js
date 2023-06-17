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

let draggedPiece = null, positionPiece = null

function createBoard () {
  pieces.forEach((piece, index) => {
    const square = document.createElement('div')
    const isWhite = (Math.floor(index / boardSize) + index) % 2 === 0

    // Add piece to square and add classes
    square.innerHTML = piece
    square.classList.add('square')
    square.classList.add(isWhite ? 'light' : 'dark')

    // Add square index and draggable attribute
    square.setAttribute('square-index', index)
    square.querySelector('div')?.setAttribute('draggable', true)

    // Add black and white classes to the first and last 16 squares
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

function dragStart (event) {
  draggedPiece = event.target
  positionPiece = event.target.parentElement.getAttribute('square-index')
}

function dragOver (event) {
  event.preventDefault()
}

function dragDrop (event) {
  event.stopPropagation()

  const target = event.target
  target.parentNode.append(draggedPiece)
  target.remove()
  // target.append(draggedPiece)
}

const squares = document.querySelectorAll('#gameboard .square')
squares.forEach((square) => {
  square.addEventListener('dragstart', dragStart)
  square.addEventListener('dragover', dragOver)
  square.addEventListener('drop', dragDrop)
})
