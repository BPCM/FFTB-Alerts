// ==UserScript==
// @name         FFTBattleground Alerts
// @namespace    fota.run
// @version      .2
// @description  Alert player when things happen.
// @include      https://www.twitch.tv/fftbattleground
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict'
    var broadcasterAccount = "FFTBattleground";
    var audioCtx = new(window.AudioContext || window.webkitAudioContext || window.audioContext);

    /*
    FFTBattleground: The green team was victorious! Next match starting soon...
    FFTBattleground: {name}, you advanced to Level {level}! Your gil floor has increased to {floor}!
    FFTBattleground: Betting is open for {team1} vs {team2}. Use !bet [amount] [team] to place a wager!
    FFTBattleground: Betting is closed: Final Bets: white - 27 bets for 12,393G; brown - 20 bets for 19,880G... Good luck!
    FFTBattleground: You may now !fight to enter the tournament! This tournament's Skill Drop is: Jump. One random user using !fight (or !dontfight) will receive this skill. Alternately, you can buy the skill for 1,000G.
    FFTBattleground: Betting is closed: Final Bets: white - 21 bets for 12,035G; black - 27 bets for 16,497G... Good luck!
     */

    //duration of the tone in milliseconds. Default is 500
    //frequency of the tone in hertz. default is 440
    //volume of the tone. Default is 1, off is 0.
    //type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
    //callback to use on end of tone
    function beep(duration, frequency, volume, type, callback) {
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        if (volume) {
            gainNode.gain.value = volume;
        }
        if (frequency) {
            oscillator.frequency.value = frequency;
        }
        if (type) {
            oscillator.type = type;
        }
        if (callback) {
            oscillator.onended = callback;
        }
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
    };

    function parseHTMLElement(htmlElement) {
        var message = new Message(htmlElement.children[1], htmlElement.children[3]); //todo Fix hard coded array ref
        if (message.username === broadcasterAccount) {
            if (message.text.includes('You may now !fight to enter the tournament!')) {
                beep();
            } else if (message.text.includes('Betting is open for')) {
                beep();
                setTimeout(function () {
                    beep();
                }, 55500);
                setTimeout(function () {
                    beep();
                }, 56500);
                setTimeout(function () {
                    beep();
                }, 57500);
                setTimeout(function () {
                    beep();
                }, 58500);
                setTimeout(function () {
                    beep(1500);
                }, 59500);
            }
        }
    }

    function Message(usernameHTMLSpanElement, textHTMLSpanElement) {
        this.text = textHTMLSpanElement.innerText;
        this.username = usernameHTMLSpanElement.innerText;
    }

    new MutationObserver(mutationList => {
        mutationList.forEach(mutation => {
            Array.from(mutation.addedNodes).forEach(htmlElement => {
                switch (htmlElement.className) {
                case 'chat-line__message':
                    parseHTMLElement(htmlElement);
                    break
                }
            })
        })
    }).observe(document, {
        childList: true,
        subtree: true
    });
  	beep();
    console.log('start');
})()
