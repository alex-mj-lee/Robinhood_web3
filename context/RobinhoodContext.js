import { createContext, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import {
  dogeAbi,
  bitcoinAbi,
  solanaAbi,
  usdcAbi,
  etherAbi,
  dogeAddress,
  bitcoinAddress,
  solanaAddress,
  usdcAddress,
  etherAddress,
} from "../lib/constants";

export const RobinhoodContext = createContext();

export const RobinhoodProvider = (props) => {
  const [formattedAccount, setFormattedAccount] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [coinSelect, setCoinSelect] = useState("DOGE");
  const [toCoin, setToCoin] = useState("");
  const [balance, setBalance] = useState("");
  const [amount, setAmount] = useState("");

  const { authenticate, isAuthenticated, user, logout, Moralis, enableWeb3 } =
    useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        const account = user.get("ethAddress");
        let formatAccount = account.slice(0, 4) + "..." + account.slice(-4);
        setFormattedAccount(formatAccount);
        setCurrentAccount(account);
        const currentBalance = await Moralis.Web3API.account.getNativeBalance({
          chain: "goerli",
          address: currentAccount,
        });
        const balancToETH = Moralis.Units.FromWei(currentBalance.balance);
        const formattedBalance = parseFloat(balancToETH).toFixed(3);
        setBalance(formattedBalance);
      };
      fetchData().catch(console.error);
    }
  }, [isAuthenticated, enableWeb3]);

  useEffect(() => {
    if (!currentAccount) return;
    (async () => {
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: currentAccount,
        }),
      });
      const data = await response.json();
    })();
  }, [currentAccount]);

  const getContractAddress = () => {
    if (coinSelect === "BTC") return bitcoinAddress;
    if (coinSelect === "DOGE") return dogeAddress;
    if (coinSelect === "SOL") return solanaAddress;
    if (coinSelect === "USDC") return usdcAddress;
    if (coinSelect === "ETH") return etherAddress;
  };

  const getToAddress = () => {
    if (toCoin === "BTC") return bitcoinAddress;
    if (toCoin === "DOGE") return dogeAddress;
    if (toCoin === "SOL") return solanaAddress;
    if (toCoin === "USDC") return usdcAddress;
    if (toCoin === "ETH") return etherAddress;
  };

  const getToAbi = () => {
    if (toCoin === "BTC") return bitcoinAbi;
    if (toCoin === "DOGE") return dogeAbi;
    if (toCoin === "SOL") return solanaAbi;
    if (toCoin === "USDC") return usdcAbi;
    if (toCoin === "ETH") return etherAbi;
  };

  const mint = async () => {
    try {
      if (coinSelect === "ETH") {
        if (!isAuthenticated) return;
        await Moralis.enableWeb3();
        const contractAddress = getToAddress();
        const abi = getToAbi();

        let options = {
          contractAddress: contractAddress,
          functionName: "mint",
          abi: abi,
          params: {
            to: currentAccount,
            amount: Moralis.Units.Token("50", "18"),
          },
        };
        sendEth();
        const transaction = await Moralis.executeFunction(options);
        const receipt = await transaction.wait(4);
        console.log(receipt);
        saveTransaction(receipt.transactionHash, amount, receipt.to);
      } else {
        swapTokens();
        saveTransaction(receipt.transactionHash, amount, receipt.to);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const swapTokens = async () => {
    try {
      if (!isAuthenticated) return;

      await Moralis.enableWeb3();

      if (coinSelect === toCoin) return;

      const fromOptions = {
        type: "erc20",
        amount: Moralis.Units.Token(amount, "18"),
        receiver: getContractAddress(),
        contractAddress: getContractAddress(),
      };

      const toMintOptions = {
        contractAddress: getToAddress(),
        functionName: "mint",
        abi: getToAbi(),
        params: {
          to: currentAccount,
          amount: Moralis.Units.Token(amount, "18"),
        },
      };

      let fromTransaction = await Moralis.transfer(fromOptions);
      let toMintTransaction = await Moralis.executeFunction(toMintOptions);
      let fromReceipt = await fromTransaction.wait();
      let toReceip = await toMintTransaction.wait();
    } catch (error) {
      console.error(error.message);
    }
  };

  const sendEth = async () => {
    if (!isAuthenticated) return;

    const contractAddress = getToAddress();

    let options = {
      type: "native",
      amount: Moralis.Units.ETH("0.01"),
      receiver: contractAddress,
    };

    const transaction = await Moralis.transfer(options);
    const receipt = await transaction.wait();
    console.log(receipt);
    saveTransaction(receipt.transactionHash, "0.01", receipt.to);
  };

  const saveTransaction = async (txHash, amount, toAddress) => {
    await fetch("/api/swapTokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        txHash: txHash,
        fromAddress: currentAccount,
        toAddress: toAddress,
        amount: parseFloat(amount),
      }),
    });
  };
  const connectWallet = () => {
    authenticate();
  };

  // const connectWallet = async () => {
  //   if (!isAuthenticated) {
  //     await authenticate()
  //       .then(function (user) {
  //         console.log(user.get("ethAddress"));
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }
  // };

  const signOut = () => {
    logout();
  };

  return (
    <RobinhoodContext.Provider
      value={{
        connectWallet,
        signOut,
        currentAccount,
        isAuthenticated,
        formattedAccount,
        coinSelect,
        setCoinSelect,
        toCoin,
        setToCoin,
        balance,
        setBalance,
        amount,
        setAmount,
        swapTokens,
        mint,
      }}
    >
      {props.children}
    </RobinhoodContext.Provider>
  );
};
