const img = document.querySelector('img')
const svg = document.querySelector('svg')

img.addEventListener('dblclick', () => {
  svg.classList.add('love-it')
  setTimeout(() => svg.classList.remove('love-it'), 1000)
})
