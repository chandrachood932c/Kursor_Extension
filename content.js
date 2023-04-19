// Create and Display Modal

function showModal(text) {
  // Create modal element
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.right = "0";
  modal.style.bottom = "0";
  modal.style.left = "0";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.padding="200px";
  
  // Create text element inside modal
  const modalText = document.createElement("div");
  modalText.textContent = text;
  modalText.style.backgroundColor = "grey";
  modalText.style.color = "black";
  modalText.style.padding = "1em";
  modalText.style.borderRadius = "10px";
  modalText.style.boxShadow = "0px 0px 10px 0px rgba(0,0,0,0.5)"; 
  modalText.style.width = "400px";
  modalText.style.maxWidth = "80vw";
  modalText.style.position = "relative"; 

  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.borderRadius = "10px"; 
  closeButton.style.top = "0.25em";
  closeButton.style.right = "0.25em";
  closeButton.style.border = "none";
  closeButton.style.backgroundColor = "grey";
  closeButton.style.fontSize = "1.5em";
  closeButton.style.cursor = "pointer";

  const buttonContainer = document.createElement("div");
buttonContainer.style.display = "flex";
buttonContainer.style.justifyContent = "flex-end";
buttonContainer.style.marginBottom = "1em";

const copyButton = document.createElement("button");
copyButton.textContent = "Copy";
copyButton.style.marginRight = "0.5em";

const shareButton = document.createElement("button");
shareButton.textContent = "Share";
shareButton.style.marginRight = "0.5em";

const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.style.marginRight = "0.5em";

const cancelButton = document.createElement("button");
cancelButton.textContent = "Cancel";
cancelButton.style.marginRight = "0.5em";

cancelButton.addEventListener("click", () => {
  modal.style.display = "none";
});

buttonContainer.appendChild(copyButton);
buttonContainer.appendChild(shareButton);
buttonContainer.appendChild(editButton);
buttonContainer.appendChild(cancelButton);

modalText.appendChild(buttonContainer);
  
  // Event listener to remove modal when close button is clicked
  closeButton.addEventListener("click", () => {
    modal.remove();
  });
  
  // Event listener to share selected text
  shareButton.addEventListener("click", () => {
    navigator.share({
      title: "Selected Text",
      text: text,
      url: window.location.href
    });
  });
  
  // Event listener to copy selected text
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(text);
  });

  // Event listener to edit selected text
  editButton.addEventListener("click", () => {
    const editableText = document.createElement("textarea");
    editableText.value = text;
    editableText.style.width = "100%";
    editableText.style.height = "100px";
    modalText.innerHTML = "";
    modalText.appendChild(editableText);

    // Event listener to cancel editing and return to original text
    cancelButton.addEventListener("click", () => {
      modalText.textContent = text;
    });
    
    // Append buttons to edit modal text element
    modalText.appendChild(shareButton);
    modalText.appendChild(copyButton);
    modalText.appendChild(cancelButton);
    modalText.appendChild(editButton);
    modalText.appendChild(closeButton);

  });

  // Append close button to modal text element
  modalText.appendChild(closeButton);
  
  // Append modal text element to modal
  modal.appendChild(modalText);
  
  // Append modal to body
  document.body.appendChild(modal);

  
}

// ////////////////////////////////////////////////////////////////////////////////////////

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ASK_KURSOR") {
    let originalActiveElement;
    let text;

    // If there's an active text input
    if (
      document.activeElement &&
      (document.activeElement.isContentEditable ||
        document.activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
        document.activeElement.nodeName.toUpperCase() === "INPUT")
    ) {
      // Set as original for later
      originalActiveElement = document.activeElement;
      // Use selected text or all text in the input
      text =
        document.getSelection().toString().trim() ||
        document.activeElement.textContent.trim();
    } else {
      // If no active text input use any selected text on page
      text = document.getSelection().toString().trim();
    }

    //Display Modal
    if (!text) {
      showModal("No text found.");
      return;
    }

    showModal("\"" + text + "\"");
    return;
  }
});
