import * as bip39 from "bip39"
import * as blake2b from "blake2b"
import * as crypto from "crypto"
import * as fs from "fs-extra"
import { } from "jasmine"
import secp256k1 = require("secp256k1")
import { HDKey } from "wallet.ts"
import { Address } from "../src/common/address"
import { PrivateKey } from "../src/common/privateKey"
import { PublicKey } from "../src/common/publicKey"
import { SignedTx } from "../src/common/txSigned"
import { Wallet } from "../src/wallet/wallet"
import { testAsync } from "./async"

describe("Wallet test", () => {
    let wallet: Wallet
    beforeEach(testAsync(async () => {
        try { wallet = await Wallet.walletInit() } catch (e) { }
        spyOn(fs, "readFile").and.returnValue(Promise.resolve(crypto.randomBytes(32)))
        spyOn(fs, "writeFile").and.returnValue(Promise.resolve(undefined))
    }))

    it("walletInit():should create privateKey publicKey instance", () => {
        expect(wallet.privKey).toBeDefined()
        expect(wallet.pubKey).toBeDefined()
    })

    it("generate(wallet) : createWallet with default language when there are not any parameter", () => {
        spyOn(Wallet, "generateKey")
        Wallet.generate()
        expect(Wallet.generateKey).toHaveBeenCalled()
    })

    it("generate(wallet) : createWallet with wallet info", () => {
        spyOn(Wallet, "generateKeyWithMnemonic")
        const walletInfo = { name: "test", password: "password", mnemonic: "string", language: "english", hint: "hint" }
        Wallet.generate(walletInfo)
        expect(Wallet.generateKeyWithMnemonic).toHaveBeenCalled()
    })

    it("generateKey(): should get randomMnemonic with english", () => {
        const getRandomMnemonicSpy = spyOn(Wallet, "getRandomMnemonic")
        const generateKeySpy = spyOn(Wallet, "generateKeyWithMnemonic")
        Wallet.generateKey()
        expect(getRandomMnemonicSpy).toHaveBeenCalledBefore(generateKeySpy)
    })

    it("validateMnemonic(mnemonic, language): should check validation of mnemonic", () => {
        const validateMnemonicSpy = spyOn(bip39, "validateMnemonic").and.returnValue(true)
        const getWordListSpy = spyOn(Wallet, "getWordList").and.returnValue([])
        Wallet.validateMnemonic("TestMnemonic", "english")
        expect(getWordListSpy).toHaveBeenCalledBefore(validateMnemonicSpy)
    })

    it("generateKeyWithMnemonic(mnemonic, language, passphrase):should generate key using mnemonic", () => {
        const keyBuffer = new Buffer(32)
        keyBuffer.fill(1)
        const masterHDKey = new HDKey({ privateKey: keyBuffer, publicKey: keyBuffer, chainCode: new Buffer(32), depth: 0, index: 0, parentFingerprint: undefined, version: { bip32: { public: 76067358, private: 76066276 }, public: 0 } })
        const childHDKey = new HDKey({ privateKey: keyBuffer, publicKey: keyBuffer, chainCode: new Buffer(32), depth: 4, index: 0, parentFingerprint: new Buffer(4), version: { bip32: { public: 76067358, private: 76066276 }, public: 0 } })
        const validateMnemonicSpy = spyOn(Wallet, "validateMnemonic").and.returnValue(true)
        const mnemonicToSeedSpy = spyOn(bip39, "mnemonicToSeed").and.returnValue(new Buffer(24))
        const parseMasterKeySpy = spyOn(HDKey, "parseMasterSeed").and.returnValue(masterHDKey)
        const parseExKeySpy = spyOn(HDKey, "parseExtendedKey").and.returnValue(masterHDKey)
        const deriveSpy = spyOn(HDKey.prototype, "derive").and.returnValue(childHDKey)
        const privateVerifySpy = spyOn(secp256k1, "privateKeyVerify").and.returnValue(true)
        const checkPublicSpy = spyOn(Wallet, "checkPublicKey").and.returnValue(true)
        Wallet.generateKeyWithMnemonic("testMnemonic", "english", "password")
        expect(validateMnemonicSpy).toHaveBeenCalledBefore(mnemonicToSeedSpy)
        expect(parseMasterKeySpy).toHaveBeenCalled()
        expect(deriveSpy).toHaveBeenCalledTimes(3)
        expect(privateVerifySpy).toHaveBeenCalledTimes(2)
        expect(checkPublicSpy).toHaveBeenCalledTimes(2)
    })

    it("checkPublicKey(publicKey, privateKey):Check public key that made by bip44 logic through secp256k1", () => {
        const buffer = new Buffer(32)
        buffer.fill(1)
        const publicKeyCreateSpy = spyOn(secp256k1, "publicKeyCreate").and.returnValue(buffer)
        const checkPublicKey = Wallet.checkPublicKey(buffer, buffer)
        expect(publicKeyCreateSpy).toHaveBeenCalledWith(buffer)
        expect(checkPublicKey).toBeTruthy()
    })

    it("checkPublicKey(publicKey, privateKey):If not equal with publicKey that generated with secp256k1, return false", () => {
        const buffer = new Buffer(32)
        buffer.fill(1)
        const buffer2 = new Buffer(32)
        buffer2.fill(2)
        const publicKeyCreateSpy = spyOn(secp256k1, "publicKeyCreate").and.returnValue(buffer2)
        const checkPublicKey = Wallet.checkPublicKey(buffer, buffer)
        expect(publicKeyCreateSpy).toHaveBeenCalledWith(buffer)
        expect(checkPublicKey).toBeFalsy()
    })

    it("getRandomMnemonic(language) : should get random mnemonic using worldList", () => {
        const getWordListSpy = spyOn(Wallet, "getWordList").and.returnValue([])
        const bip39Spy = spyOn(bip39, "generateMnemonic")
        Wallet.getRandomMnemonic("korean")
        expect(getWordListSpy).toHaveBeenCalledBefore(bip39Spy)
    })

    it("getWordList(language) : should return wordList using language", () => {
        const englishWords = Wallet.getWordList("english")
        const koreanWords = Wallet.getWordList("korean")
        const chinese_simplifiedWords = Wallet.getWordList("chinese_simplified")
        const chinese_traditionalWords = Wallet.getWordList("chinese_traditional")
        const frenchWords = Wallet.getWordList("french")
        const italianWords = Wallet.getWordList("italian")
        const japaneseWords = Wallet.getWordList("japanese")
        const spanishWords = Wallet.getWordList("spanish")
        expect(englishWords[0]).toBe(require(`${process.cwd()}/src/mnemonic/english.json`)[0])
        expect(koreanWords[0]).toBe(require(`${process.cwd()}/src/mnemonic/korean.json`)[0])
        expect(chinese_simplifiedWords[0]).toBe(require(`${process.cwd()}/src/mnemonic/chinese_simplified.json`)[0])
        expect(chinese_traditionalWords[0]).toBe(require(`${process.cwd()}/src/mnemonic/chinese_traditional.json`)[0])
        expect(frenchWords[0]).toBe(require(`${process.cwd()}/src/mnemonic/french.json`)[0])
        expect(italianWords[0]).toBe(require(`${process.cwd()}/src/mnemonic/italian.json`)[0])
        expect(japaneseWords[0]).toBe(require(`${process.cwd()}/src/mnemonic/japanese.json`)[0])
        expect(spanishWords[0]).toBe(require(`${process.cwd()}/src/mnemonic/spanish.json`)[0])
    })

    it("getWordList(language) : If receive a language that is not in the list, it will return the default value.", () => {
        const words = Wallet.getWordList("notInListLanguage")
        expect(words[0]).toBe(require(`${process.cwd()}/src/mnemonic/english.json`)[0])
    })

    it("encryptAES(password, data):encrypt data using key", () => {
        // TODO : Spy blake2b hash and cipher method(update, final)
        const randomBytesSpy = spyOn(crypto, "randomBytes").and.returnValue(new Buffer("88e039eb3ae9d0c167543d9d7bec43b7", "hex"))
        const createCipherivSpy = spyOn(crypto, "createCipheriv").and.callThrough()
        const encryptedData = Wallet.encryptAES("password", "dataString")
        expect(encryptedData.split(":").length).toBe(2)
        expect(encryptedData).toBe("88e039eb3ae9d0c167543d9d7bec43b7:03b46e415a9be62ede3fedd9cd4236ba")
    })

    it("decryptAES(password, rawBufferData): return decryptedData with representIndex of wallet", () => {
        // TODO : Spy blake2b hash and cipher method(update, final)
        const splitSpy = spyOn(String.prototype, "split").and.returnValue(["0", "88e039eb3ae9d0c167543d9d7bec43b7", "03b46e415a9be62ede3fedd9cd4236ba"])
        const decryptedResult = Wallet.decryptAES("password", new Buffer(32))
        expect(splitSpy).toHaveBeenCalled()
        expect(decryptedResult).toBe("dataString")
    })

    it("loadKeys(name,password):Spy on readFile, and readFile function must be called", testAsync(async () => {
        const keyBuffer = new Buffer(32)
        keyBuffer.fill(1)
        const masterHDKey = new HDKey({ privateKey: keyBuffer, publicKey: keyBuffer, chainCode: new Buffer(32), depth: 0, index: 0, parentFingerprint: undefined, version: { bip32: { public: 76067358, private: 76066276 }, public: 0 } })
        const childHDKey = new HDKey({ privateKey: keyBuffer, publicKey: keyBuffer, chainCode: new Buffer(32), depth: 4, index: 0, parentFingerprint: new Buffer(4), version: { bip32: { public: 76067358, private: 76066276 }, public: 0 } })
        const childIndexHDKey = new HDKey({ privateKey: keyBuffer, publicKey: keyBuffer, chainCode: new Buffer(32), depth: 5, index: 0, parentFingerprint: new Buffer(4), version: { bip32: { public: 76067358, private: 76066276 }, public: 0 } })
        const decryptSpy = spyOn(Wallet, "decryptAES").and.returnValue({ representIndex: 0, originalData: "originalData" })
        const parseExKeySpy = spyOn(HDKey, "parseExtendedKey").and.returnValue(masterHDKey)
        const deriveSpy = spyOn(HDKey.prototype, "derive").and.returnValue(childHDKey)
        try { await Wallet.loadKeys("jimin", "password") } catch (e) { }
        expect(fs.readFile).toHaveBeenCalledBefore(decryptSpy)
        expect(parseExKeySpy).toHaveBeenCalled()
        expect(deriveSpy).toHaveBeenCalledTimes(2)
    }))

    it("getAddress(name): return address of wallet", testAsync(async () => {
        const bufferToStringSpy = spyOn(Buffer.prototype, "toString").and.returnValue("0:88e039eb3ae9d0c167543d9d7bec43b7:03b46e415a9be62ede3fedd9cd4236ba")
        const splitSpy = spyOn(String.prototype, "split").and.returnValue(["0", "88e039eb3ae9d0c167543d9d7bec43b7", "03b46e415a9be62ede3fedd9cd4236ba"])
        const getAllPublicSpy = spyOn(Wallet, "getAllPubliclist").and.returnValue(Promise.resolve([{ name: "test0", index: 0, address: "address1" }, { name: "walletName", index: 0, address: "address2" }, { name: "test1", index: 0, address: "address3" }]))
        try { await Wallet.getAddress("walletName") } catch (e) { }
        expect(fs.readFile).toHaveBeenCalledBefore(bufferToStringSpy)
        expect(splitSpy).toHaveBeenCalledBefore(getAllPublicSpy)
    }))

    it("recoverWallet(wallet) : recover wallet using wallet information", testAsync(async () => {
        const walletInfo = { name: "test", password: "password", mnemonic: "string", language: "english", hint: "hint" }
        spyOn(fs, "pathExists").and.returnValue(Promise.resolve(false))
        const generateSpy = spyOn(Wallet, "generate")
        const saveSpy = spyOn(wallet, "save").and.returnValue(Promise.resolve(undefined))
        const getAddressSpy = spyOn(Wallet, "getAddress").and.returnValue(new Address(0))
        let addressString = ""
        try { addressString = await Wallet.recoverWallet(walletInfo) } catch (e) { }
        expect(fs.pathExists).toHaveBeenCalled()
        expect(generateSpy).toHaveBeenCalledBefore(saveSpy)
        expect(getAddressSpy).toHaveBeenCalledWith("test")
        expect(addressString).not.toBe("")
    }))

    it("recoverWallet(wallet) : When there is already wallet info return Error", testAsync(async () => {
        const walletInfo = { name: "test", password: "password", mnemonic: "string", language: "english", hint: "hint" }
        spyOn(fs, "pathExists").and.returnValue(Promise.resolve(true))
        const generateSpy = spyOn(Wallet, "generate")
        const saveSpy = spyOn(wallet, "save").and.returnValue(Promise.resolve(undefined))
        const getAddressSpy = spyOn(Wallet, "getAddress").and.returnValue(new Address(0))
        let isDuple = false
        try { await Wallet.recoverWallet(walletInfo) } catch (e) { isDuple = true }
        expect(fs.pathExists).toHaveBeenCalled()
        expect(generateSpy).not.toHaveBeenCalled()
        expect(saveSpy).not.toHaveBeenCalled()
        expect(getAddressSpy).not.toHaveBeenCalled()
        expect(isDuple).toBeTruthy()
    }))

    it("save(name,password):Spy on writefile, and writeFile function must be called", testAsync(async () => {
        const encryptSpy = spyOn(Wallet, "encryptAES").and.returnValue("encryptString")
        const getAllPublicSpy = spyOn(Wallet, "getAllPubliclist").and.returnValue(Promise.resolve([{ name: "test0", index: 0, address: "address1" }, { name: "walletName", index: 0, address: "address2" }, { name: "test1", index: 0, address: "address3" }]))
        const listSortSpy = spyOn(Array.prototype, "sort")
        spyOn(fs, "ensureFile").and.returnValue(Promise.resolve(undefined))
        try { await wallet.save("saveTestWallet", "password") } catch (e) { }
        expect(fs.writeFile).toHaveBeenCalledTimes(2)
        expect(fs.ensureFile).toHaveBeenCalledWith("./wallet/public")
        expect(encryptSpy).toHaveBeenCalledBefore(getAllPublicSpy)
        expect(listSortSpy).toHaveBeenCalled()
    }))

    it("getAllPubliclist() : return all public list", testAsync(async () => {
        spyOn(fs, "ensureFile").and.returnValue(Promise.resolve(undefined))
        const bufferToStringSpy = spyOn(Buffer.prototype, "toString").and.returnValue("test:0:H42S2UKt5L7s1N3VZDit6mk7FQdsD88gW,test:1:H3ZCiXrtzY9BTg14Akng24MskaQFhDjet,")
        let listOfPublic: Array<{ name: string, address: string }> = []
        try { listOfPublic = await Wallet.getAllPubliclist() } catch (e) { }
        expect(fs.ensureFile).toHaveBeenCalled()
        expect(fs.readFile).toHaveBeenCalled()
        expect(bufferToStringSpy).toHaveBeenCalled()
        expect(listOfPublic.length).toBe(2)
    }))

    it("walletList() : return all of wallet data", testAsync(async () => {
        spyOn(fs, "readdir").and.returnValue(["testWallet0", "testWallet1", "testWallet2", "testWallet3"])
        const getAddressSpy = spyOn(Wallet, "getAddress").and.returnValue(new Address(0))
        let walletList: Array<{ name: string, address: string }> = []
        try { walletList = await Wallet.walletList() } catch (e) { }
        expect(fs.readdir).toHaveBeenCalled()
        expect(getAddressSpy).toHaveBeenCalled()
        expect(walletList.length).toBe(4)
    }))

    it("getLang() : Returns the languages in which support is available.", testAsync(async () => {
        spyOn(fs, "readdir").and.returnValue(["english.json", "korean.json"])
        const searchSpy = spyOn(String.prototype, "search").and.callThrough()
        const replaceSpy = spyOn(String.prototype, "replace").and.callThrough()
        let languageList: string[] = []
        try { languageList = await Wallet.getLang() } catch (e) { }
        expect(fs.readdir).toHaveBeenCalled()
        expect(searchSpy).toHaveBeenCalledTimes(2)
        expect(replaceSpy).toHaveBeenCalledTimes(2)
        expect(languageList.length).toBe(2)
    }))

    it("delete(name): Should remove the named rootKey file and public info", testAsync(async () => {
        spyOn(fs, "pathExists").and.returnValue(Promise.resolve(true))
        spyOn(fs, "unlink").and.returnValue(Promise.resolve(undefined))
        const getAllPublicSpy = spyOn(Wallet, "getAllPubliclist").and.returnValue(Promise.resolve([{ name: "test0", index: 0, address: "address1" }, { name: "test1", index: 0, address: "address2" }, { name: "walletName", index: 0, address: "address3" }]))
        try { await Wallet.delete("walletName") } catch (e) { }
        expect(fs.pathExists).toHaveBeenCalledWith("./wallet/rootKey/walletName")
        expect(getAllPublicSpy).toHaveBeenCalled()
        expect(fs.unlink).toHaveBeenCalled()
        expect(fs.writeFile).toHaveBeenCalled()
    }))

    it("send(to, amount, nonce, fee):create transactions", () => {
        const pubAddressSpy = spyOn(PublicKey.prototype, "address").and.returnValue(new Address(0))
        const signSpy = spyOn(PrivateKey.prototype, "sign").and.returnValue(new SignedTx())
        wallet.send(new Address(1), 1000, 0, 10)
        expect(pubAddressSpy).toHaveBeenCalledBefore(signSpy)
    })
})
