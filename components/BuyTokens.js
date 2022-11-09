import React, { useContext } from "react";
import { RobinhoodContext } from "../context/RobinhoodContext";

const styles = {
  formContainer: `flex items-center`,
  subContainer: "flex h-full w-full flex-col items-center",
  select:
    "w-1/2 flex flex-center justify-center border border-white rounded-lg p-2 bg-transparent text-white mt-6 placeholder:text-white",
  options:
    "w-1/2 flex flex-center justify-center border border-white rounded-lg p-2 bg-black text-white mt-6 placeholder:text-white",
  noticeCTA: "font-bold text-green-500 cursor-pointer mt-5",
  inputAmount:
    "w-1/2 flex items-center justify-center border border-white rounded-lg p-2 bg-transparent mt-6 text-white placeholder:text-white",
};
const BuyTokens = () => {
  const {
    isAuthenticated,
    setAmount,
    mint,
    coinSelect,
    setCoinSelect,
    toCoin,
    setToCoin,
    amount,
  } = useContext(RobinhoodContext);

  return (
    <form className={styles.formContainer}>
      <div className={styles.subContainer}>
        <select
          className={styles.select}
          value={coinSelect}
          onChange={(e) => setCoinSelect(e.target.value)}
        >
          <option className={styles.options}>BTC</option>
          <option className={styles.options}>ETH</option>
          <option className={styles.options}>SOL</option>
          <option className={styles.options}>USDC</option>
          <option className={styles.options}>DOGE</option>
        </select>
        <select
          className={styles.select}
          value={toCoin}
          onChange={(e) => setToCoin(e.target.value)}
        >
          <option className={styles.options}>BTC</option>
          <option className={styles.options}>ETH</option>
          <option className={styles.options}>SOL</option>
          <option className={styles.options}>USDC</option>
          <option className={styles.options}>DOGE</option>
        </select>
        <input
          className={styles.inputAmount}
          placeholder="Amount..."
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className={styles.noticeCTA}
          type="button"
          disabled={!isAuthenticated}
          onClick={() => mint()}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default BuyTokens;
