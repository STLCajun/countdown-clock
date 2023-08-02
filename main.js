// Function to play a sound asynchronously
function playSound(soundFile) {
    return new Promise((resolve, reject) => {
        let audio = new Audio('/assets/' + soundFile);

        // When the sound ends, resolve the promise
        audio.addEventListener('ended', () => {
            resolve();
        });

        // If there's an error loading the sound, reject the promise
        audio.addEventListener('error', () => {
            reject(new Error('Error loading sound.'));
        });

        // Play the sound
        audio.play()
            .then(() => resolve()) // Resolves the promise once the sound starts playing
            .catch(error => reject(error)); // Rejects the promise if there's an error starting the playback
    });
}

function updateClock() {
    let currentDate = new Date();
    let targetDate = new Date('2023-08-03T10:00:00-05:00'); // Replace this with your target date and time

    let timeRemaining = targetDate.getTime() - currentDate.getTime();

    if (timeRemaining <= 0) {
        // Timer has passed the target date and time
        document.getElementById('clock').innerHTML = '00:00:00';
        clearInterval(timer);
        clearInterval(soundTimer);
        return;
    }

    let hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Format the time with leading zeros
    document.getElementById('clock').innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

let playFirstSound = false; // Variable to keep track of which sound to play next

// Function to play sound
function playAndToggleSound() {
    // Alternate between the two sounds
    let soundFile = playFirstSound ? '24-pong.mp3' : '24-ping.mp3';

    playSound(soundFile)
        .then(() => {
            // Toggle the state to play the other sound next time
            playFirstSound = !playFirstSound;
        })
        .catch((error) => {
            console.error(error);
        });
}

// Add event listener to start audio playback on the first user interaction
document.addEventListener('click', () => {
    // Ensure we only trigger the audio playback once
    if (!audioPlaybackStarted) {
        audioPlaybackStarted = true;
        // Trigger the first sound on user interaction
        playSound('24-pong.mp3')
            .then(() => {
                // Start the countdown after playing the first sound
                timer = setInterval(updateClock, 1000);
                soundTimer = setInterval(playAndToggleSound, 1000); // Play sound every second
            })
            .catch((error) => {
                console.error(error);
                // Start the countdown even if there's an error with the first sound
                timer = setInterval(updateClock, 1000);
            });
    }
});

// Variable to keep track of audio playback start
let audioPlaybackStarted = false;

// Update the clock every second
let timer = setInterval(updateClock, 1000);

