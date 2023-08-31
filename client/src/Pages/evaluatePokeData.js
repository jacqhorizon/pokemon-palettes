import React, { useState, useEffect } from 'react'

const EvaluatePokeData = () => {
  //let's start by fetching 151 pokemon,
  //evaluating their color palette,
  //and sending it to the sql database
  const [pokemon, setPokemon] = useState(null)

  useEffect(() => {
    fetchPokemon()
  }, [])
  console.log(pokemon)
  function fetchPokemon() {
    fetch(`https://pokeapi.co/api/v2/pokemon/1`)
      .then((response) => {
        return response.json()
      })
      .then(function (pokeData) {
        setPokemon(pokeData)
      })
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
  const [stuff, setStuff] = useState('');
  const getPalette = () => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let rgbValues = buildRgb(imageData.data)
      let newValues = quantization(rgbValues, 0)
      //   setRgbPalette(newValues)
      let tmp = []
      newValues.forEach((color) => {
        let converted = rgbToHsv(color)
        tmp.push(converted)
      })
      console.log(tmp)
      //   setHsvPalette(tmp)
      let range = getType(tmp)
      //   if (range > 160) {
      //     setType('complementary')
      //   } else if (range > 100) {
      //     setType('analogous')
      //   } else if (range > 10) {
      //     setType('monochrome')
      //   }
      setStuff('hello')
    }
  }
  console.log(stuff)

  useEffect(() => {
    if (pokemon) {
      getPalette()
      // pixelate()
    }
  }, [pokemon])

  return (
    <div>
      Evaluating...
      {/* <canvas
        id='canvas'
        width='200'
        height='200'
        style={{ border: 'solid 1px black' }}
      ></canvas> */}
    </div>
  )
}

export default EvaluatePokeData
