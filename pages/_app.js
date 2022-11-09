import "../styles/globals.css";
import { RobinhoodProvider } from "../context/RobinhoodContext";
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      serverUrl="https://xow3thaq55fa.usemoralis.com:2053/server"
      appId="toOMA4mEdPVZWYVBdNe7eN5wLuDvPZfTkdbClyw1"
    >
      <RobinhoodProvider>
        <Component {...pageProps} />
      </RobinhoodProvider>
    </MoralisProvider>
  );
}

export default MyApp;
