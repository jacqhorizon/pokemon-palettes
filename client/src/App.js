import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [nameGuess, setNameGuess] = useState('')
  const [numCorrect, setNumCorrect] = useState(0)
  const [winning, setWinning] = useState(true)

  useEffect(() => {
    fetchKantoPokemon()
    // async function handleAsync() {
    //   let resp = await
    //   console.log(pokemon)
    // }
    // handleAsync()
    // console.log(pokemon)
    // fetch('/api')
    //   .then((res) => res.json())
    //   .then((data) => setData(data.message))
  }, [numCorrect])

  // function fetchPokemonData(pokemon) {
  //   let url = pokemon.url // <--- this is saving the pokemon url to a      variable to us in a fetch.(Ex: https://pokeapi.co/api/v2/pokemon/1/)
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then(function (pokeData) {
  //       console.log(pokeData)

  //     })
  // }

  const handleCheckGuess = () => {
    // if (nameGuess == pokemon.name) {
    setNameGuess('')
    setNumCorrect((prev) => prev + 1)
    // console.log(nameGuess, pokemon.name)
    // } else {
    //   setNumCorrect(0)
    //   setNameGuess('')
    //   setWinning(false)
    // }
  }

  const handleReset = () => {
    setWinning(true)
  }

  function fetchKantoPokemon() {
    let pokeId = Math.floor(Math.random() * 100)
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then(function (pokeData) {
        console.log(pokeData)
        setPokemon(pokeData)
        // allpokemon.results.forEach(function (pokemon) {
        //   fetchPokemonData(pokemon)
        // })
      })
  }

  const pixelate = () => {
    let canvas = document.getElementById('canvas')
    console.log(canvas)
    let ctx
    if (canvas) {
      ctx = canvas.getContext('2d')
      console.log(ctx)
    }
    // Create an image element
    var img = new Image()

    window.onload = firstDraw()

    function firstDraw() {
      var initialImageURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
      draw(initialImageURL)
    }

    //takes any image URL and creates an un pixelated image /4 the orginal size of the image
    function draw(imgURL) {
      // Specify the src to load the image
      img.crossOrigin = 'anonymous'
      img.src = imgURL

      img.onload = function () {
        canvas.height = img.height / 4
        canvas.width = img.width / 4
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        console.log('image draw')
        // pixelate()
        //dynamically adjust canvas size to the size of the uploaded image
        canvas.height = img.height
        canvas.width = img.width

        /// if in play mode use that value, else use slider value
        var size = 4 * 0.01,
          /// cache scaled width and height
          w = canvas.width * size,
          h = canvas.height * size
        // let w = 2
        // let h = 2

        /// draw original image to the scaled size
        ctx.drawImage(img, 0, 0, w, h)

        /// then draw that scaled image thumb back to fill canvas
        /// As smoothing is off the result will be pixelated
        ctx.mozImageSmoothingEnabled = false
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height)
      }
    }
  }

  const buildRgb = (imageData) => {
    const rgbValues = [];
    for (let i = 0; i < imageData.length; i += 4) {
      const rgb = {
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2],
      };
      rgbValues.push(rgb);
    }
    return rgbValues;
  };

  const getPalette = () => {
    // const imgFile = document.getElementById('imgfile')
    const image = new Image()
    // const file = imgFile.files[0]
    // const fileReader = new FileReader()

    image.crossOrigin = 'anonymous'
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    // fileReader.onload = () => {
    image.onload = () => {
      const canvas = document.getElementById('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      console.log(imageData)
      let rgbValues = buildRgb(imageData.data)
      console.log(rgbValues)
    }
    // }
  }

  useEffect(() => {
    if (pokemon) {
      getPalette()
      // pixelate()
    }
  }, [pokemon])

  // pixelate()
  return (
    <div className='App'>
      <header className='App-header'>
        {!pokemon ? (
          'loading'
        ) : winning ? (
          <>
            <div>
              {/* <p>{pokemon.name}</p> */}
              <img
                id='imgfile'
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt='Girl in a jacket'
                width='100'
                height='100'
              ></img>
            </div>
            <canvas
              id='canvas'
              width='200'
              height='200'
              style={{ border: 'solid 1px black' }}
            ></canvas>
            <div>
              <label htmlFor='pokeName'>Name</label>
              <input
                type='text'
                id='pokeName'
                value={nameGuess}
                onChange={(e) => setNameGuess(e.target.value)}
              ></input>
              <button onClick={() => handleCheckGuess()}>Check?</button>
            </div>
          </>
        ) : (
          <>
            <h1>You lose!!!!</h1>
            <p>You got {numCorrect.toString()} correct.</p>
            <button onClick={() => handleReset()}>Try Again</button>
          </>
        )}
        {/* <p>{!data ? 'loading...' : data}</p> */}
      </header>
    </div>
  )
}

export default App
