/**
 * @OnlyCurrentDoc
 *
 * When the document is opened, create menu items and initialize settings if needed.
 */
function onOpen(e) {
  var ui = DocumentApp.getUi();
  ui.createMenu("Subtle Rick Roll")
     .addSubMenu(ui.createMenu("Embed text")
        .addItem("do sneaky things ;D", "embedText")
        .addItem("reveal sneaky things :o", "revealText"))
     .addItem("Change links", "changeLinks")
     .addSeparator()
     .addItem("Settings", "showSidebar")
     .addToUi();
  
  var userProperties = PropertiesService.getUserProperties();
  
  if (userProperties.getProperty("textToEmbed") === null) {
    setSettings(getInitialSettings()["textToEmbed"], null, null, null);
  }
  if (userProperties.getProperty("replacementLink") === null) {
    setSettings(null, getInitialSettings()["replacementLink"], null, null);
  }
  if (userProperties.getProperty("isLoopingAllowed") === null) {
    setSettings(null, null, getInitialSettings()["isLoopingAllowed"]); 
  }
  if (userProperties.getProperty("isCaseSensitive") === null) {
    setSettings(null, null, null, getInitialSettings()["isCaseSensitive"]);   
  }
}

function onInstall(e) {
  onOpen(e);
}

/**
 * Changes the color of each character in the source document that matches with the text specified by the user.
 */        
function embedText() {
  var settings = getSettings();
  var newText = settings["textToEmbed"];
  var caseSensitive = (settings["isCaseSensitive"] === "true");
  var looping = (settings["isLoopingAllowed"] === "true");
  
  var pos = 0;
  var body = DocumentApp.getActiveDocument().getBody().editAsText();
  var text = body.getText();
  
  var style = {};
  style[DocumentApp.Attribute.FOREGROUND_COLOR] = "#3c3c3c";
  
  for (var i = 0; i < text.length; i++) {
    if (!caseSensitive && text.charAt(i).toLowerCase() === newText.charAt(pos % newText.length).toLowerCase()) {
      body.setAttributes(i, i, style);
      pos++;
    }
    else if (caseSensitive && text.charAt(i) === newText.charAt(pos)) {
      body.setAttributes(i, i, style);
      pos++;
    }
    
    if (!looping && pos === newText.length) {
      break;
    }
  }
}

/**
 * Removes every character that isn't colored "#3c3c3c", which is used to indicate that the character was a part of the embedded text.
 * After execution, the document should only contain the text that was embedded.
 */
function revealText() {
  var text = DocumentApp.getActiveDocument().getBody().editAsText();
  var indices = text.getTextAttributeIndices();

  for (var i = 0; i < indices.length; i++) {    
    if (text.getForegroundColor(indices[i]) !== "#3c3c3c") {
      text.deleteText(indices[i], i === indices.length - 1 ? text.getText().length - 1 : indices[i + 1] - 1);
      i--;
    }
    indices = text.getTextAttributeIndices();
  }
}

/**
 * Replaces the link url for every link in the document with the link specified by the user.
 */
function changeLinks() {
  var text = DocumentApp.getActiveDocument().getBody().editAsText();
  var indices = text.getTextAttributeIndices();
  
  var style = {};
  style[DocumentApp.Attribute.LINK_URL] = getSettings()["replacementLink"];
  style[DocumentApp.Attribute.UNDERLINE] = false;
  
  for (var i = 0; i < indices.length; i++) {
    if (text.getLinkUrl(indices[i]) != null) {
      text.setAttributes(indices[i],  i === indices.length - 1 ? text.getText().length - 1 : indices[i + 1] - 1, style);
    }
  }
}

/**
 * Shows the settings sidebar.
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile("sidebar").setTitle("Settings");
  DocumentApp.getUi().showSidebar(ui);
}

/**
 * Gets the current settings.
 *
 * @returns {Object} The current settings
 */
function getSettings() {
  var userProperties = PropertiesService.getUserProperties();
  
  return {
    textToEmbed: userProperties.getProperty("textToEmbed"),
    replacementLink: userProperties.getProperty("replacementLink"),
    isLoopingAllowed: userProperties.getProperty("isLoopingAllowed"),
    isCaseSensitive: userProperties.getProperty("isCaseSensitive")
  };
}

/**
 * Updates settings to the provided values. If null is provided as a parameter, that setting won't be changed.
 *
 * @param {String} textToEmbed - Text embedded in the document
 * @param {String} replacementLink - Link to replace all other links in the document with
 * @param {String} isLoopingAllowed - Whether or not to loop back to the beginning if all textToEmbed can be embedded in the document
 * @param {String} isCaseSensitive - Whether or not to match casing when embedding text
 *
 * @returns {Object} The new settings
 */
function setSettings(textToEmbed, replacementLink, isLoopingAllowed, isCaseSensitive) {
  var userProperties = PropertiesService.getUserProperties();
  
  if (textToEmbed !== null) {
    userProperties.setProperty("textToEmbed", textToEmbed);
  }
  if (replacementLink !== null) {
    userProperties.setProperty("replacementLink", replacementLink);
  }
  if (isLoopingAllowed !== null) {
    userProperties.setProperty("isLoopingAllowed", isLoopingAllowed);
  }
  if (isCaseSensitive !== null) {
    userProperties.setProperty("isCaseSensitive", isCaseSensitive);
  }
  
  return getSettings();
}

/**
 * Gets the default settings.
 *
 * @returns {Object} The default settings
 */
function getInitialSettings() {
  return {
    textToEmbed: "Were no strangers to love, You know the rules and so do I. A full commitments what Im thinking of, You wouldnt get this from any other guy. I just wanna tell you how Im feeling, Gotta make you understand, Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you. Weve known each other for so long, Your hearts been aching but youre too shy to say it. Inside we both know whats been going on, We know the game and were gonna play it. And if you ask me how Im feeling, Dont tell me youre too blind to see, Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you. Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you. Never gonna give, never gonna give. Never gonna give, never gonna give. Weve known each other for so long. Your hearts been aching but youre too shy to say it. Inside we both know whats been going on, We know the game and were gonna play it. I just wanna tell you how Im feeling, Gotta make you understand. Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you. Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you. Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry.",
    replacementLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    isLoopingAllowed: "true",
    isCaseSensitive: "false"
  };
}
