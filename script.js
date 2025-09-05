const connectBtn = document.getElementById('connectBtn');
const mintBtn = document.getElementById('mintBtn');
const statusText = document.getElementById('status');

let tonConnect;
let connectedWallet;

connectBtn.addEventListener('click', async () => {
  tonConnect = new TON_CONNECT.TonConnect({
    manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react/tonconnect-manifest.json'
  });

  try {
    await tonConnect.restoreConnection();
    const connected = await tonConnect.connect();
    connectedWallet = connected.account.address;

    statusText.textContent = `Connected: ${connectedWallet}`;
    mintBtn.disabled = false;
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
        address: 'kQC7Oyt8E5I3U6bB5CBRStZAWZMYbs2wSCpgEkMM9-6To-1L', // dummy testnet address
        amount: '1000000000', // 1 TON in nanotons
        payload: ''
      }
    ]
  };

  try {
    const result = await tonConnect.sendTransaction(tx);
    statusText.textContent = 'Transaction sent (simulated)!';
    console.log('TX Result:', result);
  } catch (e) {
    console.error(e);
    statusText.textContent = 'Minting failed or cancelled.';
  }
});
