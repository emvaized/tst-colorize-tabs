// Load saved options when the page is opened
function loadOptions() {
  browser.storage.sync.get({
    colorScheme: "auto",
    keyboardBehavior: "stop"
  }).then((result) => {
    const colorScheme = result.colorScheme;
    const keyboardBehavior = result.keyboardBehavior;

    // Set the radio inputs according to the loaded options
    document.querySelector(`input[name="colorScheme"][value="${colorScheme}"]`).checked = true;
    document.querySelector(`input[name="keyboardBehavior"][value="${keyboardBehavior}"]`).checked = true;

    // Toggle dark mode class if dark color scheme is selected
    setColorSchemeForPage(colorScheme)

    // Log the loaded options to the console
    console.log("Options loaded successfully:");
    console.log("  Color scheme:", colorScheme);
    console.log("  Keyboard behavior:", keyboardBehavior);
  }).catch((error) => {
    console.log("Error loading options:");
    console.log(error);
  });
  setFooterButtons();
  setTranslations();
}

// Save options when changes occur
function saveOptions() {
  const selectedColorScheme = document.querySelector('input[name="colorScheme"]:checked').value;
  const selectedKeyboardBehavior = document.querySelector('input[name="keyboardBehavior"]:checked').value;
  browser.storage.sync.set({ colorScheme: selectedColorScheme, keyboardBehavior: selectedKeyboardBehavior });

  // Toggle dark mode class if dark color scheme is selected
  setColorSchemeForPage(selectedColorScheme)

  // Log the selected options to the console
  console.log("Options saved successfully:");
  console.log("  Color scheme:", selectedColorScheme);
  console.log("  Keyboard behavior:", selectedKeyboardBehavior);
}

// Apply the selected color scheme to options page
function setColorSchemeForPage(scheme) {
  if (scheme === "dark") {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("auto");
  } else if (scheme == "auto") {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("auto");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.remove("auto");
  }
}

// Add on click listeners to footer buttons
function setFooterButtons(){
  document.querySelector("#githubButton").addEventListener("click", function (val) {
      window.open('https://github.com/emvaized/tst-colorize-tabs', '_blank');
  });
  document.querySelector("#writeAReviewButton").addEventListener("click", function (val) {
      window.open('https://addons.mozilla.org/firefox/addon/tst-colorize-tabs/reviews/', '_blank');
  });
}

function setTranslations(){
  document.querySelectorAll('*[i18n]').forEach(el => {
    const key = el.getAttribute('i18n');
    if (key){
      const translatedLabel = chrome.i18n.getMessage(key);
      if (translatedLabel){
        el.innerText = translatedLabel;
      }
    }
  })
}

// Load options when the page is opened
document.addEventListener("DOMContentLoaded", loadOptions);

// Listen for changes in form inputs and save options automatically
const inputs = document.querySelectorAll('input[type="radio"]');
inputs.forEach(input => {
  input.addEventListener("change", saveOptions);
});
