import { Bech32Address } from "@keplr-wallet/cosmos";

const ChainInfo = {
  chainId: "theta-testnet-001",
  chainName: "theta-testnet-001",
  // rpc: "https://rpc.one.theta-devnet.polypore.xyz",
  // rest: "https://rest.one.theta-devnet.polypore.xyz",
  // rpc: "https://rpc.sentry-01.theta-testnet.polypore.xyz/",
  // rest: "https://rest.sentry-01.theta-testnet.polypore.xyz/",
  rpc: "https://rpc.cosmos.directory/theta",
  rest: "https://rest.cosmos.directory/theta",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "cosmos",
    bech32PrefixAccPub: "cosmos" + "pub",
    bech32PrefixValAddr: "cosmos" + "valoper",
    bech32PrefixValPub: "cosmos" + "valoperpub",
    bech32PrefixConsAddr: "cosmos" + "valcons",
    bech32PrefixConsPub: "cosmos" + "valconspub",
  },
  currencies: [
    {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos",
    },
    {
      coinDenom: "THETA",
      coinMinimalDenom: "theta",
      coinDecimals: 0,
    },
    {
      coinDenom: "LAMBDA",
      coinMinimalDenom: "lambda",
      coinDecimals: 0,
    },
    {
      coinDenom: "RHO",
      coinMinimalDenom: "rho",
      coinDecimals: 0,
    },
    {
      coinDenom: "EPSILON",
      coinMinimalDenom: "epsilon",
      coinDecimals: 0,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos",
    },
  ],
  stakeCurrency: {
    coinDenom: "ATOM",
    coinMinimalDenom: "uatom",
    coinDecimals: 6,
    coinGeckoId: "cosmos",
  },
  coinType: 118,
  gasPriceStep: {
    low: 1,
    average: 1,
    high: 1,
  },
  features: ["stargate", "ibc-transfer", "no-legacy-stdTx"],
};

export default ChainInfo;