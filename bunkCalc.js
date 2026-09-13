function bunksAvailable(P, C) {
  return Math.floor((P - 0.75 * C) / 0.75);
}

function lecturesNeeded(P, C) {
  return (3 * C) - (4 * P);
}

module.exports = { bunksAvailable, lecturesNeeded };
