const connectBtn = document.getElementById('connectBtn');
const statusText = document.getElementById('status');

let tonConnect;

connectBtn.addEventListener('click', async () => {
  tonConnect = new TonConnect({
    manifestUrl: 'https://ton-nft-minter-nine.vercel.app/tonconnect-manifest.json'
  });

  try {
    await tonConnect.connect();
    const wallet = tonConnect.account?.address;
    if (wallet) {
      statusText.textContent = `Connected: ${wallet}`;
    } else {
      statusText.textContent = 'Failed to connect wallet';
    }
    console.log('Connected wallet:', wallet);
  } catch (error) {
    console.error('Error connecting wallet:', error);
    statusText.textContent = 'Connection failed';
  }
});
