//  CHECK : if any data field is empty
const isValid = function (value) {
  if (typeof (value) === 'undefined' || typeof (value) === 'null') {
    return false
  }
  if (typeof (value) === 'string' && value.trim().length > 0) {
    return true
  }
}


const isUrl = function (url) {
  if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url)) {
    return true
  }
  else {
    return false
  }
}

module.exports.isValid = isValid
module.exports.isUrl = isUrl