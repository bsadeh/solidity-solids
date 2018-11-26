function bless(patches) {
  patches.forEach(([thing, name, content]) => {
    if (thing[name]) throw new Error(`function ${name} is already defined!`)
    thing[name] = content
  })
}


module.exports = {bless}