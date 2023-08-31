import React, { useState, useEffect } from 'react'
import './App.css'
import EvaluatePokeData from './Pages/evaluatePokeData'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [nameGuess, setNameGuess] = useState('')
  const [numCorrect, setNumCorrect] = useState(0)
  const [winning, setWinning] = useState(true)

  // fetch('/new-table').then((res) => res.json()).then((data) => console.log(data))

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
    // let pokeId = Math.floor(Math.random() * 100)
    let pokeId = 1
    // let pokeId = Math.floor(3)
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)
      .then((response) => {
        // console.log(response)
        return response.json()
      })
      .then(function (pokeData) {
        // console.log(pokeData)
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
    const rgbValues = []
    for (let i = 0; i < imageData.length; i += 4) {
      if (imageData[i + 3] > 0) {
        const rgb = {
          r: imageData[i],
          g: imageData[i + 1],
          b: imageData[i + 2]
        }
        rgbValues.push(rgb)
      }
    }
    return rgbValues
  }

  const findBiggestColorRange = (rgbValues) => {
    let rMin = Number.MAX_VALUE //start min at greatest possible number
    let gMin = Number.MAX_VALUE
    let bMin = Number.MAX_VALUE

    let rMax = Number.MIN_VALUE //start max at tiniest possible number
    let gMax = Number.MIN_VALUE
    let bMax = Number.MIN_VALUE

    rgbValues.forEach((pixel) => {
      rMin = Math.min(rMin, pixel.r)
      gMin = Math.min(gMin, pixel.g)
      bMin = Math.min(bMin, pixel.b)

      rMax = Math.max(rMax, pixel.r)
      gMax = Math.max(gMax, pixel.g)
      bMax = Math.max(bMax, pixel.b)
    })

    const rRange = rMax - rMin
    const gRange = gMax - gMin
    const bRange = bMax - bMin

    const biggestRange = Math.max(rRange, gRange, bRange)
    if (biggestRange === rRange) {
      return 'r'
    } else if (biggestRange === gRange) {
      return 'g'
    } else {
      return 'b'
    }
  }

  const quantization = (rgbValues, depth) => {
    //base code
    const MAX_DEPTH = 2
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
      const color = rgbValues.reduce(
        (prev, curr) => {
          prev.r += curr.r
          prev.g += curr.g
          prev.b += curr.b

          return prev
        },
        {
          r: 0,
          g: 0,
          b: 0
        }
      )

      color.r = Math.round(color.r / rgbValues.length)
      color.g = Math.round(color.g / rgbValues.length)
      color.b = Math.round(color.b / rgbValues.length)
      return [color]
    }

    //recursion code
    const componentToSortBy = findBiggestColorRange(rgbValues)
    rgbValues.sort((p1, p2) => {
      return p1[componentToSortBy] - p2[componentToSortBy]
    })

    let avg =
      rgbValues.reduce((a, b) => a + b[componentToSortBy], 0) / rgbValues.length
    let index = rgbValues.findIndex((value) => value[componentToSortBy] >= avg)
    // console.log(avg, index)
    // const mid = rgbValues.length / 2
    return [
      ...quantization(rgbValues.slice(0, index), depth + 1),
      ...quantization(rgbValues.slice(index + 1), depth + 1)
    ]
    // return [
    //   ...quantization(rgbValues.slice(0, mid), depth + 1),
    //   ...quantization(rgbValues.slice(mid + 1), depth + 1)
    // ]
  }
  const [rgbPalette, setRgbPalette] = useState(null)
  const [hsvPalette, setHsvPalette] = useState(null);
  const [type, setType] = useState(null);

  const rgbToHsv = (item) => {
    let { r, g, b } = item
    // R, G, B values are divided by 255
    // to change the range from 0..255 to 0..1
    r = r / 255.0
    g = g / 255.0
    b = b / 255.0

    // h, s, v = hue, saturation, value
    var cmax = Math.max(r, Math.max(g, b)) // maximum of r, g, b
    var cmin = Math.min(r, Math.min(g, b)) // minimum of r, g, b
    var diff = cmax - cmin // diff of cmax and cmin.
    var h = -1,
      s = -1

    // if cmax and cmin are equal then h = 0
    if (cmax == cmin) h = 0
    // if cmax equal r then compute h
    else if (cmax == r) h = (60 * ((g - b) / diff) + 360) % 360
    // if cmax equal g then compute h
    else if (cmax == g) h = (60 * ((b - r) / diff) + 120) % 360
    // if cmax equal b then compute h
    else if (cmax == b) h = (60 * ((r - g) / diff) + 240) % 360

    // if cmax equal zero
    if (cmax == 0) s = 0
    else s = (diff / cmax) * 100

    // compute v
    var v = cmax * 100
    return { h: Math.round(h), s: Math.round(s), v: Math.round(v) }
  }

  const getType = (values) => {
    let hMin = Number.MAX_VALUE //start min at greatest possible number

    let hMax = Number.MIN_VALUE //start max at tiniest possible number


    values.forEach((obj) => {
      hMin = Math.min(hMin, obj.h)
      hMax = Math.max(hMax, obj.h)

    })
    const range = hMax - hMin
    return range
  }
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
      let rgbValues = buildRgb(imageData.data)
      let newValues = quantization(rgbValues, 0)
      setRgbPalette(newValues)
      let tmp = []
      newValues.forEach((color) => {
       let converted = rgbToHsv(color)
       tmp.push(converted)
      })
      console.log(tmp)
      setHsvPalette(tmp)
      let range = getType(tmp)
      if (range > 160) {
        setType('complementary')
      } else if (range > 100) {
        setType('analogous')
      } else if (range > 10) {
        setType('monochrome')
      }
    }
    // }
  }

  const sendIt = () => {
    console.log(pokemon.id, pokemon.name, rgbPalette, hsvPalette, type)
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
        <EvaluatePokeData />
        {!pokemon ? (
          'loading'
        ) : winning ? (
          <>
            <div>
              {/* <p>{pokemon.name}</p> */}
              {/* <img
                id='imgfile'
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt='Girl in a jacket'
                width='100'
                height='100'
              ></img> */}
            </div>
            <canvas
              id='canvas'
              width='600'
              height='600'
              style={{ border: 'solid 1px black' }}
            ></canvas>
            {rgbPalette ? (
              <div style={{ display: 'flex' }}>
                {rgbPalette.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`
                    }}
                  ></div>
                ))}
              </div>
            ) : (
              <></>
            )}
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
        <button onClick={() => sendIt()}>SEND IT!</button>
        {/* <p>{!data ? 'loading...' : data}</p> */}
      </header>
    </div>
  )
}

export default App
