const { Transfer } = require("../database/models");
const trunks = require("trunks-log");
const { ethers } = require("hardhat");
const { Bech32Address } = require("@keplr-wallet/cosmos");
const { chains } = require("chain-registry");
const { getOfflineSignerProto } = require("osmojs");
const { SigningCosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { Decimal } = require("@cosmjs/math");

const log = new trunks("TRANSFERS");

const transferKeplrToMetamask = async (req, res) => {
  const transfer = new Transfer(req.body);
  let file = require("../data/secret.json");

  let receiverAddress = transfer.metamaskAddress;
  let TokenJson = require("../artifacts/contracts/Token.sol/Token.json");
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth.bd.evmos.org:8545"
  );
  var validator = new ethers.Wallet(file.privateKey, provider);

  let Token = new ethers.Contract(file.tokenAddress, TokenJson.abi, provider);
  let tx = {
    gasPrice: ethers.utils.parseUnits("1", "gwei"),
    gasLimit: 1000000,
  };
  await Token.connect(validator)
    .transfer(receiverAddress, String(ethers.utils.parseEther(transfer.amount)))
    .then(function (txObj) {
      tx = txObj;
    });
  await tx.wait();
  // console.log(tx.hash);
  transfer.metamaskExplorer = tx.hash

  try {
    const createdTransfer = await transfer.save();

    res.status(200).json({ transfer: createdTransfer });
  } catch (error) {
    log.error(error, "Error creating transfer: {}", transfer.email);
    let errStatus = error.name === "ValidationError" ? 400 : 500;
    res.status(errStatus).json({ error });
  }
};

const transferMetamaskToKeplr = async (req, res) => {
  const transfer = new Transfer(req.body);
  let file = require("../data/secret.json");

  const ChainInfo = {
    rpc: "https://rpc-osmosis.blockapsis.com",
    rest: "https://lcd-osmosis.blockapsis.com",
    chainId: "osmosis-1",
    chainName: "Osmosis",
    stakeCurrency: {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
      coinGeckoId: "osmosis",
      // coinImageUrl: window.location.origin + "/public/assets/tokens/osmosis.svg",
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config("osmo"),
    currencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        coinGeckoId: "osmosis",
        // coinImageUrl:
        // window.location.origin + "/public/assets/tokens/osmosis.svg",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        coinGeckoId: "osmosis",
        // coinImageUrl:
        // window.location.origin + "/public/assets/tokens/osmosis.svg",
      },
    ],
    features: ["stargate", "ibc-transfer", "no-legacy-stdTx", "ibc-go"],
    explorerUrlToTx: "https://www.mintscan.io/osmosis/txs/{txHash}",
  };

  const mnemonic = file.mnemonic;
  const chain = chains.find(({ chain_name }) => chain_name === "osmosis");
  const signer = await getOfflineSignerProto({
    mnemonic,
    chain,
  });

  CosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
    ChainInfo.rpc,
    signer,
    {
      gasPrice: {
        amount: Decimal.fromAtomics("50", 4),
        denom: ChainInfo.currencies[0].coinMinimalDenom,
      },
    }
  );
  let publicOsmoAddress = file.publicOsmoAddress;

  let osmoAmount = String(Number(transfer.amount) * 10 ** 6);
  try {
    let deliverTxResponse = await CosmWasmClient.sendTokens(
      publicOsmoAddress,
      transfer.keplrAddress,
      [
        {
          denom: ChainInfo.currencies[0].coinMinimalDenom,
          amount: osmoAmount,
        },
      ],
      "auto",
      "transferring from metamask to keplr"
    );
    // console.log("Transaction Response", {
    //   tx: deliverTxResponse,
    // });
    transfer.keplrExplorer = deliverTxResponse.transactionHash
  } catch (e) {
    console.warn("Error sending tokens", [e, transfer.keplrAddress]);
  }

  try {
    const createdTransfer = await transfer.save();

    res.status(200).json({ transfer: createdTransfer });
  } catch (error) {
    log.error(error, "Error creating transfer: {}", transfer.email);
    let errStatus = error.name === "ValidationError" ? 400 : 500;
    res.status(errStatus).json({ error });
  }
};

const indexByID = async (req, res) => {
  try {
    const transfer = await Transfer.findOne({
      transferID: req.params.transferID,
    }).exec();

    res.status(200).json({ transfer });
  } catch (error) {
    log.error(error, "Could not find transfer: {}", req.params.transferID);
    res.status(500).json({ error });
  }
};

const index = async (_req, res) => {
  try {
    const transfers = await Transfer.find().sort({ createdAt: -1 }).exec();

    res.json({ transfers });
  } catch (error) {
    log.error(error, "Could not retrieve transfers: {}", error.message);
    res
      .json({ error: error, message: "Could not retrieve transfers" })
      .status(500);
  }
};

const show = async (req, res) => {
  try {
    console.log("request to show");
    const transfer = await Transfer.findById(req.params.id).exec();

    res.status(200).json({ transfer });
  } catch (error) {
    log.error(error, "Could not find transfer: {}", req.params.id);
    res.status(500).json({ error });
  }
};

module.exports = {
  transferMetamaskToKeplr,
  transferKeplrToMetamask,
  indexByID,
  index,
  show,
};
