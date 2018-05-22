// @OnlyCurrentDoc

var replacementText = "Were no strangers to love, You know the rules and so do I. A full commitments what Im thinking of, You wouldnt get this from any other guy. I just wanna tell you how Im feeling, Gotta make you understand, Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you. Weve known each other for so long, Your hearts been aching but youre too shy to say it. Inside we both know whats been going on, We know the game and were gonna play it. And if you ask me how Im feeling, Dont tell me youre too blind to see, Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you. Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you. Never gonna give, never gonna give. Never gonna give, never gonna give. Weve known each other for so long. Your hearts been aching but youre too shy to say it. Inside we both know whats been going on, We know the game and were gonna play it. I just wanna tell you how Im feeling, Gotta make you understand. Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you. Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry, Never gonna say goodbye, Never gonna tell a lie and hurt you. Never gonna give you up, Never gonna let you down, Never gonna run around and desert you. Never gonna make you cry.";

function onOpen(e) {
  DocumentApp.getUi().createMenu("Subtle Rick Roll")
     .addItem("do sneaky things ;D", "hideText")
     .addItem("reveal sneaky things :o", "revealText")
     .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

/**
 * Changes the color of each character in the source document that matches with the
 * lyrics to "Never Gonna Give You Up" by Rick Astley.
 */        
function hideText() {
  var pos = 0;
  var body = DocumentApp.getActiveDocument().getBody().editAsText();
  var text = body.getText();
  
  var style = {};
  style[DocumentApp.Attribute.FOREGROUND_COLOR] = "#3c3c3c";
  
  for (var i = 0; i < text.length; i++) {
    if (text.charAt(i).toLowerCase() === replacementText.charAt(pos).toLowerCase()) {
      body.setAttributes(i, i, style);
      pos++;
    }
  }
}

/**
 * Removes every character that isn't colored "#3c3c3c", which is used to
 * indicate the character was colored as part of the song lyrics.
 * After execution, the document should only contain the lyrics that were hidden.
 */
function revealText() {
  var text = DocumentApp.getActiveDocument().getBody().editAsText();
  var indices;

  for (var i = 0; i < text.getTextAttributeIndices().length - 1; i++) {
    indices = text.getTextAttributeIndices();
    
    if (text.getForegroundColor(indices[i]) === "#3c3c3c") {
      Logger.log(indices[i] + " : should be chillin");
    }
    else if (text.getForegroundColor(indices[i]) !== "#3c3c3c") {
      text.deleteText(indices[i], indices[i + 1] - 1);
      Logger.log("deleted : " + text.getForegroundColor(indices[i]));
      i--;
    }
  }
  text.deleteText(text.getTextAttributeIndices()[text.getTextAttributeIndices().length - 1], text.getText().length - 1);
}