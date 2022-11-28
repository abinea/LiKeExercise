export function shuffle(source: any[]) {
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

export function getRandomInt(max: any) {
  return Math.floor(Math.random() * max + 1)
}

export function getRandom(min: any, max: any) {
  return Math.floor(Math.random() * (max - min) + 1) + min
}

function swap(arr: any, i: any, j: any) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}