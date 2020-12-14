// import axios from 'axios'

const BASE_URL = 'https://vinoshipper.com/json-api/v2'

const getSettings = () => {
  try {
    const producer = document.querySelector('#vsProducer')
    return producer.dataset
  } catch (error) {
    console.error(error)
  }
}

const getProducts = async(producerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/wine-list?id=${producerId}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

const getClub = async(producerId) => {
  console.info('no api available')
}

const createStateLi = data => {
  const li = document.createElement('li')
  li.appendChild(document.createTextNode(data.abbr))
  li.setAttribute('title', data.state)
  return li
}

const createSpecialLi = data => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(data.state))
  li.setAttribute('title', data.state)
  return li
}

const createProducts = data => {
  const productCard = document.createElement('div')
  productCard.setAttribute('class', 'vs-card')
  const productLabel = document.createElement('div')
  const productImg = document.createElement('img')
  console.log(data.img)
  productImg.src = data.img
  productLabel.appendChild(productImg)

  const productInfo = document.createElement('div')
  const productName = document.createElement('h2')
  productName.appendChild(document.createTextNode(data.name))
  const appellation = document.createElement('caption')
  appellation.appendChild(document.createTextNode(data.appellation))
  const priceUnit = document.createElement('dd')
  const price = document.createElement('span')
  price.appendChild(document.createTextNode(data.price))
  priceUnit.appendChild(price)
  if (data.bottleSize) {
    const volume = document.createElement('span')
    volume.appendChild(document.createTextNode(`/ ${data.bottleSize.description}`))
    priceUnit.appendChild(volume)
  }
  const detail = document.createElement('p')
  detail.appendChild(document.createTextNode(data.description))
  const abv = document.createElement('p')
  abv.appendChild(document.createTextNode(`Alcohol ${data.abv}%`))
  productInfo.appendChild(productName)
  productInfo.appendChild(appellation)
  productInfo.appendChild(priceUnit)
  productInfo.appendChild(detail)
  productInfo.appendChild(abv)

  const productSelect = document.createElement('div')
  const productQty = document.createElement('select')
  const select = document.createElement('button')

  productCard.appendChild(productLabel)
  productCard.appendChild(productInfo)

  return productCard
}

const addStatesToDom = (stateData, specialShipping) => {
  const statesDiv = document.createElement('div')
  const statesTitle = document.createElement('h2')
  statesTitle.appendChild(document.createTextNode('Ships To'))

  const ulStates = document.createElement('ul')
  ulStates.setAttribute('class', 'vs-state')
  if (Array.isArray(stateData) && stateData.length > 0) {
    stateData.map(state => {
      ulStates.appendChild(createStateLi(state))
    });
  } else if(stateData) {
    ulStates.appendChild(createStateLi(stateData))
  }

  statesDiv.appendChild(statesTitle)
  statesDiv.appendChild(ulStates)
  if(specialShipping.length > 0){
    const ulSpecial = document.createElement('ul')
    ulSpecial.setAttribute('class', 'vs-special')
    if (Array.isArray(specialShipping) && specialShipping.length > 0) {
      specialShipping.map(state => {
        ulSpecial.appendChild(createSpecialLi(state))
      })
    } else if(specialShipping) {
      ulStates.appendChild(createStateLi(specialShipping))
    }
    statesDiv.appendChild(ulSpecial)
  }

  document.getElementById('vsProducer').appendChild(statesDiv)
}

const addProductsToDom = (productData) => {
  console.log(productData)
  const productsDiv = document.createElement('div')

  if (Array.isArray(productData)) {
    productData.map(product => {
      productsDiv.appendChild(createProducts(product))
    })
  }

  document.getElementById('vsProducer').appendChild(productsDiv)
}

const addProducerToDom = shopData => {
  switch(shopData.type){
    case 'shop':
      getProducts(shopData.producerId).then(productsData => {
        addStatesToDom(productsData.shipsTo, productsData.specialShipping)
        addProductsToDom(productsData.wines)
      })
      break
    case 'club':
    default:
      console.log('club')
      getClub(shopData.producerId)
      break
  }
}

addProducerToDom(getSettings())
