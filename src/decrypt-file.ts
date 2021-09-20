import { createDecipheriv } from 'crypto'
import { readFile } from 'fs/promises'

const decryptFile = async(): Promise<void> => {
  try {
    const secretKey = await readFile(__dirname + '/../assets/secret.key', 'utf8')
    const key = Buffer.from(secretKey.toString(), 'hex')
    console.log('KEY:', key, 'Length:', key.length)

    const encrypted = await readFile(__dirname + '/../assets/secret.enc', 'base64')
    console.log('Read encrypted file', encrypted.length)

    const iv = await readFile(__dirname + '/../assets/iv.txt')
    console.log('Read IV', iv, 'Length:', iv.length)

    const authTag = await readFile(__dirname + '/../assets/auth.txt')
    console.log('Read Auth Tag', authTag, 'Length:', authTag.length)

    let decipher = createDecipheriv('aes-256-gcm', key, iv)
    console.log('Created decipher IV')
    decipher = decipher.setAuthTag(authTag)
    console.log('Set Auth Tag')

    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    console.log('Updated decipher', decrypted.length)

    // TODO: this currently throws an error
    decrypted += decipher.final('utf8')
    console.log('Decrypted', decrypted.length)
  } catch (error) {
    console.log('Error', error)
  }
}

export default decryptFile
