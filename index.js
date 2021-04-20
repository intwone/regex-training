const textBox = document.querySelector('#input-text')
const regexBox = document.querySelector('#input-regex')
const alertBox = document.querySelector('#alert-box')
const resultsBox = document.querySelector('#results-box')
const testButton = document.querySelector('#test-button')

const clickFunction = () => {
  clearResultsAndErrors()

  const textBoxValue = textBox.value
  const regexBoxValue = regexBox.value.trim()
  let regex = ''

  console.log(regexBoxValue);

  if(textBoxValue.length === 0 || regexBoxValue.length === 0) {
    return err('Please, fill in all fields.')
  }

  regex = createRegex(regexBoxValue)

  if(!regex) return

  const resultsOfMatch = getMatches(regex, textBoxValue)

  if(resultsOfMatch.length > 0 && resultsOfMatch[0] !== null) {
    let html = getMatchsCountString(resultsOfMatch)
    html += getResultsString(resultsOfMatch, textBoxValue)
    return resultsBox.innerHTML = html
  }

  return resultsBox.innerHTML = 'There were no matches.'
}

const clearResultsAndErrors = () => {
  alertBox.classList.add('hide')
  resultsBox.innerHTML = ''
}

const err = errorMessage => {
  alertBox.classList.remove('hide')
  alertBox.innerHTML = errorMessage
}

const createRegex = regex => {
  try {
    if(regex.charAt(0) === '/') {
      regex = regex.split('/')
      regex.shift()

      const flags = regex.pop()
      regex = regex.join('')
      
      return new RegExp(regex, flags)
    }

    return new RegExp(regex, 'g')
  } catch (error) {
    return err('The Regular Expression is invalid.')
  }
}

const getMatches = (regex, text) => {
  const results = []
  let result

  if(regex.global) {
    while ((result = regex.exec(text)) !== null) {
      results.push(result)
    }
    return results
  }

  results.push(regex.exec(text))

  return results
}

const getMatchsCountString = results => {
  if(results.length !== 1) {
    return `<p>There are ${results.length} matches.</p>`
  }

  return '<p>There was one match.</p>'
}

const getResultsString = (results, text) => {
  for(let i = results.length-1; i >= 0; i--) {
    const result = results[i]
    const match = result.toString();
    const prefix = text.substr(0, result.index);
    const suffix = text.substr(result.index + match.length);
    text = `${prefix}<span class="label label-info">${match}</span>${suffix}`
  }

  return `<h4>${text}</h4>`
}
