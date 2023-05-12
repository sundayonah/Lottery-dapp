import { createContext, useState, useEffect, useContext } from "react"
import Web3 from "web3"
import createLotteryContract from "../utils/LotteryContract"

export const appContext = createContext()

export const AppProvider = ({ children }) => {
    const [address, setAddress] = useState("")
    const [web3, setWeb3] = useState("")
    const [lotteryContract, setLotteryContract] = useState()

    const connectWallet = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                //request wallet connection
                await window.ethereum.request({ method: "eth_requestAccoounts" })
                //Create a web3 instance
                const web3 = new Web3(window.ethereum)
                setWeb3(web3)
                const accounts = await web3.getAccount()
                setAddress(accounts[0])
                setLotteryContract(createLotteryContract(web3))

                window.ethereum.on("accountsChanged", async () => {
                    const accounts = await web3.eth.getAccounts()
                    setAddress(accounts[0])
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    return <appContext.Provider value={{ connectWallet, address }}>{children}</appContext.Provider>
}

export const useAppContext = () => {
    return useContext(appContext)
}
