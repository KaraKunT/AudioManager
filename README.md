# AudioManager

`AudioManager` is a flexible and powerful JavaScript class developed to manage audio files. This class provides individual volume levels for each sound, a master volume level, mute/unmute features, and playback controls. You can use the same audio file with different tags at different volume levels.

## Features
- **Load and Play Sounds**: Load audio files and play them at specified volume levels.
- **Tagging**: Use the same audio file with different tags at different volume levels.
- **Master Volume**: Set a global volume level for all sounds.
- **Temporary Volume**: Specify a temporary volume level for a one-time play.
- **Mute and Unmute**: Mute or unmute all sounds.
- **Stopping a Sound**: You can instantly stop a sound that is currently playing.

## Installation

1. Add the `AudioManager.js` file to your project, or include the code in your own script.
2. Initialize the audio manager by creating a new instance of `AudioManager`.

## Usage

### Global Audio Manager Example

Below is an example demonstrating how to use `AudioManager` as a global audio manager, including loading sounds and tagging.

```javascript
let audioManager = null;

// Initialize the audio manager once the page is loaded
document.addEventListener("DOMContentLoaded", async function () {
  // Define a global path for the sounds
  const globalSoundPath = "https://www.example.com/sounds/";

  // Start the AudioManager
  audioManager = new AudioManager(globalSoundPath);

  // Load different sounds
  await audioManager.loadSound("menuClick", "menu_click.wav", 100); // Load at 100% volume
  await audioManager.loadSound("itemSelect", "item_select.wav", 80); // Load at 80% volume

  // Tag an existing sound with different names
  audioManager.tagSound("openTab", "menuClick", 70);    // Use "menuClick" at 70% volume
  audioManager.tagSound("clickItem", "itemSelect", 60); // Use "itemSelect" at 60% volume

  // Test sounds
  audioManager.menuClick();  // Plays at 100% volume
  audioManager.itemSelect(); // Plays at 80% volume
  audioManager.openTab();    // Plays at 70% volume
  audioManager.clickItem();  // Plays at 60% volume

  audioManager.play("menuClick");  // Plays at 100% volume
  audioManager.play("itemSelect"); // Plays at 80% volume
  audioManager.play("openTab");    // Plays at 70% volume
  audioManager.play("clickItem");  // Plays at 60% volume

  // Set a master volume
  audioManager.setMasterVolume(50); // Sets the master volume to 50%
});
```

### Example Use Cases

- **Loading and Playing Sounds**:
  ```javascript
  audioManager.loadSound("clickSound", "button_click.wav", 90); // Load at 90% volume
  audioManager.clickSound(); // Plays at 90% volume
  ```

- **Tagging**:
  ```javascript
  audioManager.tagSound("secondaryClick", "clickSound", 60); // Tag with 60% volume
  audioManager.secondaryClick();       // Plays at 60% volume
  audioManager.play("secondaryClick"); // Plays at 60% volume
  ```

- **Playing with a Temporary Volume**:
  ```javascript
  audioManager.clickSound(30);         // Plays once at 30% volume
  audioManager.play("clickSound", 30); // Plays once at 30% volume
  ```
  
- **Stopping a Sound**:
  ```javascript
  audioManager.stop("clickSound"); // The sound stops immediately
  ```

- **Setting Master Volume**:
  ```javascript
  audioManager.setMasterVolume(40); // Sets the master volume to 40%, affecting all sounds proportionally
  ```

- **Muting and Unmuting**:
  ```javascript
  audioManager.mute();   // Mutes all sounds
  audioManager.unmute(); // Unmutes all sounds
  ```
