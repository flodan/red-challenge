import { createServer, ServerOptions } from 'https'
import { readFileSync } from 'fs'
import { IncomingMessage, RequestListener, ServerResponse } from 'http'
import { readFile } from 'fs/promises'
import decryptFile from './decrypt-file'


/**
 * Challenge No. 1
 */
// Call decryptFile method from './decrypt-file.ts' here
const decryptedFilePath = __dirname + '/../assets/clear_smaller.txt'

const main = async() => {
  const fileContent = (await readFile(decryptedFilePath)).toString()

  /**
   * Challenge No. 2
   */
  console.log(`Adding all numbers that occur in file '${decryptedFilePath}'...`)
  const sumNumbers = addNumbersInString(fileContent)
  console.log(`Sum of all numbers in file: ${sumNumbers}`)

  /**
   * Challenge No. 3
   */
  console.log(`Adding all vowels that occur in file '${decryptedFilePath}'...`)
  const sumVowels = addVowelsInString(fileContent)
  console.log(`Sum of all numbers and weighted vowels in file: ${sumNumbers + sumVowels}`)

  /**
   * Challenge No. 4
   */
  console.log('Starting https server...')
  startHTTPSServer()
}


const addNumbersInString = (text: string): number => {
  let sum = 0

  for (let i = 0; i < text.length; i++) {
    const parsedInt = parseInt(text[i])
    if (!isNaN(parsedInt)) sum += parsedInt
  }

  return sum
}

const addVowelsInString = (text: string): number => {
  let sum = 0
  const vowelWeights = {
    a: 2,
    e: 4,
    i: 8,
    o: 16,
    u: 32,
  }
  const vowelList = Object.keys(vowelWeights)

  for (let i = 0; i < text.length; i++) {
    if (vowelList.includes(text[i])) sum += vowelWeights[text[i]]
  }

  return sum
}

const startHTTPSServer = () => {
  const host = 'localhost'
  const port = 8000

  const requestListener: RequestListener = async(req: IncomingMessage, res: ServerResponse) => {
    const sumOfNumbersPerSentenceList = await sumOfNumbersPerSentence(decryptedFilePath)
    const tenBiggestNumbers = sumOfNumbersPerSentenceList.sort((a, b) => a.sum - b.sum).slice(sumOfNumbersPerSentenceList.length - 10)
    console.log(tenBiggestNumbers)
    const orderedByIndex = tenBiggestNumbers.sort((a, b) => a.index - b.index)
    const minusIndex = orderedByIndex.map(v => v.sum - v.index)

    const solution = minusIndex.map(v => String.fromCharCode(v)).join('')

    res.writeHead(200)
    res.end(solution)
  }
  const httpsOptions: ServerOptions = {
    key: readFileSync(__dirname + '/../assets/localhost.key'),
    cert: readFileSync(__dirname + '/../assets/localhost.crt'),
  }
  const server = createServer(httpsOptions, requestListener)
  server.listen(port, host, () => {
    console.log(`Server running on https://${host}:${port}`)
  })
}

const sumOfNumbersPerSentence = async(filePath: string): Promise<{index: number, sum: number}[]> => {
  const fileContent = (await readFile(filePath)).toString()
  const listSumOfNumbersPerSentence = []

  const splitContent = fileContent.split(/[.!?]+\s/)

  for (let i = 0; i < splitContent.length; i++) {
    const sum = await addNumbersInString(splitContent[i])
    listSumOfNumbersPerSentence.push({ index: i, sum })
  }

  return listSumOfNumbersPerSentence
}

main().then(_ => console.log('Started')).catch(e => console.error(e.message || e))
