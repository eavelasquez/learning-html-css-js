// Get the elements we need from the DOM
const dropzone = document.querySelector('#dropzone')
const preview = document.querySelector('#preview')

// Prevent default drag behaviors
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault()
})

// Handle dropped files
dropzone.addEventListener('drop', (e) => {
  e.preventDefault()

  // Get the files from the event
  const file = e.dataTransfer.files[0]

  // Check if the file is an image
  if (file.type.match('image.*')) {
    const reader = new FileReader()

    // Read the file as a data URL
    reader.readAsDataURL(file)

    // When the file is loaded
    reader.onload = (e) => {
      // Show the preview image
      const img = document.createElement('img')
      img.src = e.target.result
      preview.appendChild(img)
    }
  } else {
    alert('The file is not an image')
  }
})
