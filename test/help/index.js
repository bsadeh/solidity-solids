const sleep = (milliseconds) => {
  const end = new Date().getTime() + milliseconds
  while (new Date().getTime() < end) { }
  return
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))


module.exports = Object.assign({},
  {sleep, delay},
  require('./secrets'),
)
