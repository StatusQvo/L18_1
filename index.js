const urlData = 'https://jsonplaceholder.typicode.com/users'

const getUserList = () => {
  toggleLoader()
  setTimeout(() => {
    fetch(urlData)
      .then((response) => {
        try {
          response.ok === true
        } catch (error) {
          console.error('Ошибка данных')
        }

        return response.json()
      })

      .then((data) => {
        const userList = new CreateUsersList(data)
      })

      .catch((error) => {
        console.error(error)
      })

      .finally(() => {
        toggleLoader()
      })
  }, 2000)
}

getUserList()

function toggleLoader() {
  const loaderHTML = document.querySelector('#loader')
  const isHidden = loaderHTML.getAttribute('hidden') !== null
  if (isHidden) {
    loaderHTML.removeAttribute('hidden')
  } else {
    loaderHTML.setAttribute('hidden', '')
  }
}

class CreateUsersList {
  constructor(data) {
    this.dataDOM = this._fillDOMData()
    this._infoObj = this._createUserList(data)
  }

  _fillDOMData() {
    const container = document.querySelector('#data-container')
    const loader = container.querySelector('#loader')
    return { container, loader }
  }

  _createNewElement(username, id) {
    const $newUser = document.createElement('li')
    const $userInfo = document.createElement('a')
    $userInfo.setAttribute('href', '#')
    $userInfo.dataset.id = id
    $userInfo.innerText = username
    $newUser.append($userInfo)
    this.dataDOM.container.append($newUser)

    $userInfo.addEventListener('click', this._ConsoleUserInfo.bind(this))
  }

  _ConsoleUserInfo(event) {
    event.preventDefault()
    const { target } = event
    const userId = target.attributes[1].value
    const userList = this._infoObj
    let userInfoObj = null

    userList.forEach(({ id, container }) => {
      if (id.toString() === userId) {
        userInfoObj = container
        console.log(container)
      }
    })

    Object.entries(userInfoObj).forEach(([key, val]) => {
      if (key === 'address' || key === 'company') {
        const Adress = Object.entries(val).reduce((acc, [aKey, aVal]) => {
          if (aKey === 'geo') {
            const { lat, lng } = aVal
            aVal = '(lat: ' + lat + ', lng: ' + lng + ')'
          }

          acc.push(' ' + aKey + ': ' + aVal)
          return acc
        }, [])
        console.log(Adress.toString())
      } else {
        console.log('' + key + ': ' + val)
      }
    })
  }

  _createUserList(data) {
    const allData = []
    for (let i = 0; i < data.length; i++) {
      let objElt = data[i]
      const { id, name, username, ...rest } = objElt
      allData.push({ id, container: objElt })
      this._createNewElement(username, id)
    }
    return allData
  }
}
