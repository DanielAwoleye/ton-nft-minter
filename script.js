const connectBtn = document.getElementById('connectBtn');
const mintBtn = document.getElementById('mintBtn');
const statusText = document.getElementById('status');

let tonConnect;
let connectedWallet;

connectBtn.addEventListener('click', async () => {
  tonConnect = new TON_CONNECT.TonConnect({
    manifestUrl: 'https://ton-nft-minter-nine.vercel.app/tonconnect-manifest.json'
  });

  try {
    await tonConnect.restoreConnection();

    if (!tonConnect.connected) {
      await tonConnect.connect();
    }

    connectedWallet = tonConnect.account?.address;

    if (connectedWallet) {
      statusText.textContent = `Connected: ${connectedWallet}`;
      mintBtn.disabled = false;
    } else {
      statusText.textContent = 'Wallet connection failed';
    }
  } catch (e) {
    console.error(e);
    statusText.textContent = 'Connection failed';
  }
});

mintBtn.addEventListener('click', async () => {
  if (!connectedWallet) {
    statusText.textContent = 'Please connect your wallet first.';
    return;
  }

  const tx = {
    validUntil: Math.floor(Date.now() / 1000) + 60,
    messages: [
      {
        address: 'kQC7Oyt8E5I3U6bB5CBRStZAWZMYbs2wSCpgEkMM9-6To-1L', // Dummy testnet contract address
        amount: '1000000000', // 1 TON in nanotons
        payload: ''
      }
    ]
  };

  try {
    await tonConnect.sendTransaction(tx);
    statusText.textContent = 'Transaction sent (simulated)!';
  } catch (e) {
    console.error(e);
    statusText.textContent = 'Minting failed or cancelled.';
  }
});
