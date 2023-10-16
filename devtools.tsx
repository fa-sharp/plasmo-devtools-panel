// Add the devtools storage panel if we're not in production
if (process.env.NODE_ENV !== "production")
  chrome.devtools.panels.create(
    "Storage devtools", // This should ideally be the displayName of the extension
    null,
    "tabs/storagePanel.html"
  )

function IndexPopup() {
  return (
    <h2>
      Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
    </h2>
  )
}

export default IndexPopup
