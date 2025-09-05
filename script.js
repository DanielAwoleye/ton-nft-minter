// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const connectBtn = document.getElementById('connectBtn');
  const statusText = document.getElementById('status');
  
  // Check if TonConnect is available
  if (typeof TonConnect === 'undefined') {
    statusText.textContent = 'Error: TonConnect SDK failed to load';
    statusText.className = 'disconnected';
    connectBtn.disabled = true;
    return;
  }
  
  let tonConnect;
  
  // Initialize TonConnect
  try {
    tonConnect = new TonConnect({
      manifestUrl: 'https://ton-nft-minter-nine.vercel.app/tonconnect-manifest.json'
    });
    
    // Check if already connected
    tonConnect.restoreConnection().then(() => {
      if (tonConnect.connected) {
        updateUI(tonConnect.account.address);
      }
    });
  } catch (error) {
    console.error('Error initializing TonConnect:', error);
    statusText.textContent = 'Initialization error';
    connectBtn.disabled = true;
  }
  
  // Connect button handler
  connectBtn.addEventListener('click', async () => {
    try {
      connectBtn.disabled = true;
      statusText.innerHTML = '<span class="loading"></span>Connecting...';
      
      // Open modal for wallet selection
      await tonConnect.connect();
      
      // Check connection status after a brief delay
      setTimeout(() => {
        if (tonConnect.connected) {
          updateUI(tonConnect.account.address);
        } else {
          statusText.textContent = 'Connection failed or was cancelled';
          statusText.className = 'disconnected';
          connectBtn.disabled = false;
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      statusText.textContent = 'Connection failed: ' + error.message;
      statusText.className = 'disconnected';
      connectBtn.disabled = false;
    }
  });
  
  // Update UI with wallet info
  function updateUI(walletAddress) {
    const shortAddress = walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4);
    statusText.innerHTML = `<span class="connected">Connected</span>
                            <span class="wallet-address">${shortAddress}</span>`;
    connectBtn.textContent = 'Disconnect';
    
    // Change button to disconnect functionality
    connectBtn.onclick = async () => {
      try {
        await tonConnect.disconnect();
        statusText.textContent = 'Disconnected';
        statusText.className = 'disconnected';
        connectBtn.textContent = 'Connect Wallet';
        connectBtn.onclick = connectBtn.originalOnClick;
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
      }
    };
  }
  
  // Store original click handler
  connectBtn.originalOnClick = connectBtn.onclick;
});
