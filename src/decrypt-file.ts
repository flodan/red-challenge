import {} from 'buffer'
import { createDecipheriv } from 'crypto'
import { createReadStream, createWriteStream } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { createGunzip } from 'zlib'

readFile(__dirname + '/../assets/secret.key').then(async(value) => {
  try {
    const key = Buffer.from(value.toString(), 'hex')
    console.log('KEY:', key, 'Length:', key.length)
    const encrypted = await readFile(__dirname + '/../assets/secret.enc')
    console.log('Read encrypted file', encrypted.length)
    const iv = await readFile(__dirname + '/../assets/iv.txt')
    console.log('Read IV', iv.length)
    const authTag = await readFile(__dirname + '/../assets/auth.txt')
    console.log('Read Auth Tag', authTag.length)

    const decipher = createDecipheriv('aes-256-gcm', key, iv)
    console.log('Created decipher IV')
    decipher.setAuthTag(authTag)
    console.log('Set Auth Tag')
    // let str = decipher.update(encrypted)
    // console.log('Updated decipher', str.length)

    // await writeFile(__dirname + '/output.zip', str)
    // const readStream = createReadStream(__dirname + '/output.zip')
    // const writeStream = createWriteStream(__dirname + '/output.txt')
    // const unzip = createGunzip()
    // readStream.pipe(unzip).pipe(writeStream)

    const str = Buffer.concat([decipher.update(encrypted), decipher.final()])
    console.log('Decrypted')
  } catch (error) {
    console.log('Error', error.message)
  }
})
