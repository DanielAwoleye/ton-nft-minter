// Function to load the TonConnect SDK with error handling
function loadTonConnectSDK() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof TonConnect !== 'undefined') {
      resolve();
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect.umd.min.js';
    script.onload = () => {
      // Check if SDK loaded correctly
      if (typeof TonConnect === 'undefined') {
        reject(new Error('SDK loaded but TonConnect object not found'));
      } else {
        resolve();
      }
    };
    script.onerror = () => reject(new Error('Failed to load SDK'));
    
    // Add to document
    document.head.appendChild(script);
  });
}

// Main application function
async function initApp() {
  const connectBtn = document.getElementById('connectBtn');
  const statusText = document.getElementById('status');
  const retryBtn = document.getElementById('retryBtn');
  
  // Disable buttons until SDK is loaded
  connectBtn.disabled = true;
  retryBtn.style.display = 'none';
  
  try {
    // Try to load the SDK
    statusText.innerHTML = '<span class="loading"></span>Loading TonConnect SDK...';
    await loadTonConnectSDK();
    
    // SDK loaded successfully
    statusText.textContent = 'SDK loaded. Click "Connect Wallet" to continue.';
    statusText.className = 'disconnected';
    connectBtn.disabled = false;
    
    // Initialize TonConnect
    let tonConnect;
    try {
      tonConnect = new TonConnect({
        manifestUrl: 'https://ton-nft-minter-nine.vercel.app/tonconnect-manifest.json'
      });
      
      // Check if already connected
      await tonConnect.restoreConnection();
      if (tonConnect.connected) {
        updateUI(tonConnect.account.address);
      }
    } catch (error) {
      console.error('Error initializing TonConnect:', error);
      statusText.textContent = 'Initialization error: ' + error.message;
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
    
  } catch (error) {
    console.error('Failed to load TonConnect SDK:', error);
    statusText.textContent = 'Error: Failed to load TonConnect SDK';
    retryBtn.style.display = 'block';
  }
  
  // Retry button handler
  retryBtn.addEventListener('click', () => {
    initApp();
  });
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', initApp);
