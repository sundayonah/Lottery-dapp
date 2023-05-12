import { createContext, useState, useEffect, useContext } from "react"
import Web3 from "web3"
import createLotteryContract from "../utils/LotteryContract"

export const appContext = createContext()

export const AppProvider = ({ children }) => {
    const [address, setAddress] = useState("")
    const [web3, setWeb3] = useState("")
    const [lotteryContract, setLotteryContract] = useState()
    const [lotteryPot, setLotteryPot] = useState()
    const [lotteryPlayers, setLotteryPlayers] = useState([])
    const [lastWinner, setLastWinner] = useState()
    const [lotteryId, setLotteryId] = useState()

    const connectWallet = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                // Request wallet connection
                await window.ethereum.request({ method: "eth_requestAccounts" })
                // Create a web3 instance
                const web3 = new Web3(window.ethereum)
                setWeb3(web3)
                const accounts = await window.ethereum.request({ method: "eth_accounts" })
                setAddress(accounts[0])
                setLotteryContract(createLotteryContract(web3))

                window.ethereum.on("accountsChanged", async () => {
                    const accounts = await window.ethereum.request({ method: "eth_accounts" })
                    setAddress(accounts[0])
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Please install MetaMask")
        }
    }

    //EnterLOttery
    const enterLottery = async () => {
        try {
            await lotteryContract.methods.enter().send({
                from: address,
                value: web3.utils.toWei("0.1", "ether"),
                gas: 300000,
                gasPrice: null,
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <appContext.Provider value={{ connectWallet, address, enterLottery }}>
            {children}
        </appContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(appContext)
}
