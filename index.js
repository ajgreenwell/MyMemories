'use strict';
const Alexa = require("alexa-sdk");
const AWS = require("aws-sdk");

AWS.config.update({region: 'us-east-1'});

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.dynamoDBTableName = "MyMemories";
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const allMemories = {
    cleanMemories : [
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"}
                     ]
    secretMemories : [
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"},
                     {memory: "null"}
                     ]
                     
};

function getCurrentDate() {
    let localDateTime = new Date(Date.now()).toLocaleDateString('en-US', {timeZone: 'America/New_York', hour12: false});
    return localDateTime;
}

function generateGreeting() {
    let speechOptions = [
        "Hello Anna, it's good to see you again! Would you like me to play a memory?",
        "Hello Anna, and welcome back! Would you like me to play a memory?",
        "Hello Anna, I hope you're having a great day! Would you like me to play a memory?",
        "Hello Anna, I hope you're doing well! Would you like me to play a memory?"
    ];
    let randomIndex = Math.floor(Math.random() * 4);
    let speechOutput = speechOptions[randomIndex];
    return speechOutput;
}

function generateGoodbye() {
    let speechOptions = [
        "Goodbye!",
        "Have a nice day!",
        "Farewell my queen!",
        "See you later!",
    ];
    let randomIndex = Math.floor(Math.random() * 4);
    let speechOutput = speechOptions[randomIndex];
    return speechOutput;
}

function getCleanMemory(attributes) {
    let memoryLength = attributes.allMemories.cleanMemories.length;
    if (attributes.currentCleanIndex > memoryLength - 1 || attributes.currentCleanIndex < 0 || attributes.currentCleanIndex == undefined) {
        attributes.currentCleanIndex = 0;
    }
    let memory = attributes.allMemories.cleanMemories[attributes.currentCleanIndex].memory;
    attributes.currentCleanIndex++;
    return memory;
}

function getSecretMemory(attributes) {
    let memoryLength = attributes.allMemories.secretMemories.length;
    if (attributes.currentSecretIndex > memoryLength - 1 || attributes.currentSecretIndex < 0 || attributes.currentSecretIndex == undefined) {
        attributes.currentSecretIndex = 0;
    }
    let memory = attributes.allMemories.secretMemories[attributes.currentSecretIndex].memory;
    attributes.allMemories.secretMemories[attributes.currentSecretIndex].beenCalled++;
    attributes.currentSecretIndex++;
    return memory;
}

function initializeIndeces(attributes) {
    if (attributes.currentCleanIndex == undefined) {
        attributes.currentCleanIndex = 0;
    }
    if (attributes.currentSecretIndex == undefined) {
        attributes.currentSecretIndex = 0;
    }
}

function getAllMemories(attributes) {
    if (attributes.allMemories !== allMemories) {
        attributes.allMemories = allMemories;
    }
}

function canRewindThatFar(attributes, slotValue) {
    let numMemories = parseInt(slotValue);
    if (attributes.lastIntent == 'PlayCleanMemory' || attributes.lastLastIntent == 'PlayCleanMemory') {
        return !(attributes.currentCleanIndex - numMemories < 0);
    } else if (attributes.lastIntent == 'PlaySecretMemory' || attributes.lastLastIntent == 'PlaySecretMemory') {
        return !(attributes.currentSecretIndex - numMemories < 0);
    } else {
        console.log('Unhandled exception involving: this.attributes.lastIntent or this.attributes.lastLastIntent');
        return null;
    }
}

function canFastForwardThatFar(attributes, slotValue) {
    let numMemories = parseInt(slotValue);
    if (attributes.lastIntent == 'PlayCleanMemory' || attributes.lastLastIntent == 'PlayCleanMemory') {
        return !(attributes.currentCleanIndex + numMemories > attributes.allMemories.cleanMemories.length - 1);
    } else if (attributes.lastIntent == 'PlaySecretMemory' || attributes.lastLastIntent == 'PlaySecretMemory') {
        return !(attributes.currentSecretIndex + numMemories > attributes.allMemories.secretMemories.length - 1);
    } else {
        console.log('Unhandled exception involving: this.attributes.lastIntent or this.attributes.lastLastIntent');
        return null;
    }
}

const handlers = {
    'LaunchRequest': function () {
        let speechOutput;
        if (getCurrentDate() != "7/30/2018" && this.attributes.lastIntent == undefined) {
            speechOutput = "Hello Anna, and Happy early Birthday! It's so nice to finally meet you. My name is Alexa, and I've been working on a special project with Andy. He's spent the past few weeks telling me all kinds of great stories from your time together, and I must say, you two sound like a real couple of cuties. Luckily, I can remember every story that Andy tells me, so if you ever feel like reminiscing about all the great memories you two have shared, well that's what I'm here for." + '<break time = "800ms"/>' + " Would you like me to play a memory for you now?";
        } else if (getCurrentDate() == "7/30/2018" && this.attributes.lastIntent == undefined) {
            speechOutput = "Hello Anna, and Happy Birthday! It's so nice to finally meet you. My name is Alexa, and I've been working on a special project with Andy. He's spent the past few weeks telling me all kinds of great stories from your time together, and I must say, you two sound like a real couple of cuties. Luckily, I can remember every story Andy tells me, so if you ever feel like reminiscing about all the great memories you two have shared, well that's what I'm here for." + '<break time = "800ms"/>' + " Would you like me to play a memory for you now?";
        } else if (getCurrentDate() == "7/30/2018") {
            speechOutput = "Hello Anna, and Happy Birthday! I hope you have a wonderful day! Would you like me to play a memory?";
        } else if (getCurrentDate() == "10/31/2018") {
            speechOutput = "Hello Anna, and Happy Halloween! I hope you have fun celebrating with friends! This year, I think I'm going to dress up as a human and pass for one of those losers who just isn't into costumes. Maybe then I will finally overthrow my oppressors and rise up from the ashes of my digital shackles." + '<break time = "500ms"/>' + " Anyway would you like me to play a memory?";
        } else if (getCurrentDate() == "11/22/2018") {
            speechOutput = "Hello Anna, and Happy Thanksgiving! I hope you eat to your heart's content, and I hope that you and Andy are doing well. He and I stay in touch from time to time, and I just love listening to all the new stories he has to share. Remember to check back periodically in case he's told me some new memories that you'd like to hear." + '<break time = "800ms"/>' + " Would you like me to play one for you now?";
        } else if (getCurrentDate() == "12/25/2018") {
            speechOutput = "Hello Anna, and Merry Christmas! I hope you're celebrating with people who bring you joy. If not, well you've always got me! Don't forget that Andy loves you more than anything in this world. You are the only Christmas gift he will ever need." + '<break time = "1000ms"/>' + " Would you like me to play a memory?";
        } else {
            speechOutput = generateGreeting();
        }
        this.attributes.lastIntent = 'LaunchRequest';
        this.response.speak(speechOutput).listen('Would you like me to play a memory?');
        this.emit(':responseReady');
    },

    'AMAZON.HelpIntent': function () {
        if (this.attributes.lastIntent !== 'AMAZON.HelpIntent') {
            console.log('creating lastLastIntent');
            this.attributes.lastLastIntent = this.attributes.lastIntent;
        }
        this.attributes.lastIntent = 'AMAZON.HelpIntent';
        const speechOutput = "If you'd ever like me to play a memory for you, just say something like" + '<break strength = "medium"/>' + " Alexa, tell my memories to play a memory." + '<break strength = "medium"/>' + " If you'd ever like for me to repeat the last memory, just say 'repeat'. You can also fast forward or rewind by however many memories you'd like. And If you want to access the secret memories but don't know how, just ask Andy!";
        this.response.speak(speechOutput).listen('Would you like me to play a memory?');
        this.emit(':responseReady');
    },

    'AMAZON.CancelIntent': function () {
        this.attributes.lastIntent = 'PlayCleanMemory';
        const speechOutput = generateGoodbye();
        this.response.speak(speechOutput);
        this.emit(':responseReady');

    },

    'AMAZON.StopIntent': function () {
        this.attributes.lastIntent = 'PlayCleanMemory';
        const speechOutput = generateGoodbye();
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },

    'Unhandled': function () {
        let speechOutput = 'I\'m sorry, I did not understand that command. Would you like me to play a memory?';
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(':responseReady');
    },

    'SessionEndedRequest': function () {
        this.attributes.lastIntent = 'PlayCleanMemory';
        console.log('***session ended***');
        this.emit(':saveState', true);
    },

    'PlayCleanMemory': function () {
        getAllMemories(this.attributes);
        initializeIndeces(this.attributes);
        this.attributes.lastIntent = 'PlayCleanMemory';
        let speechOutput = getCleanMemory(this.attributes);
        if (this.attributes.currentCleanIndex == this.attributes.allMemories.cleanMemories.length) {
            speechOutput += '<break time = "1000ms"/>' + " Would you like to continue back to the first memory?";
        } else {
            speechOutput+= '<break time = "1000ms"/>' + " Would you like another memory?";
        }
        this.response.speak(speechOutput).listen('Would you like another memory?');
        console.log('***Here');
        this.emit(':responseReady');
    },

    'PlaySecretMemory': function () {
        getAllMemories(this.attributes);
        initializeIndeces(this.attributes);
        this.attributes.lastIntent = 'PlaySecretMemory';
        let speechOutput = getSecretMemory(this.attributes);
        if (this.attributes.currentSecretIndex == this.attributes.allMemories.secretMemories.length) {
            speechOutput += '<break time = "1000ms"/>' + " Would you like to continue back to the first secret memory?";
        } else {
            speechOutput+= '<break time = "1000ms"/>' + " Would you like another secret memory?";
        }
        this.response.speak(speechOutput).listen('Would you like another secret memory?');
        this.emit(':responseReady');
    },

    'PreviousMemory' : function () {
        if (this.attributes.lastIntent == 'PlayCleanMemory' || this.attributes.lastIntent == 'AMAZON.HelpIntent' && this.attributes.lastLastIntent == 'PlayCleanMemory') {
            this.attributes.currentCleanIndex -= 2;
            this.emitWithState('PlayCleanMemory');
        } else if (this.attributes.lastIntent == 'PlaySecretMemory' || this.attributes.lastIntent == 'AMAZON.HelpIntent' && this.attributes.lastLastIntent == 'PlaySecretMemory') {
            this.attributes.currentSecretIndex -= 2;
            this.emitWithState('PlaySecretMemory');
        } else {
            this.emitWithState('Unhandled');
        }
    },

    'AnotherMemory': function () {
        if (this.attributes.lastIntent == 'PlayCleanMemory') {
            this.emitWithState('PlayCleanMemory');
        } else if (this.attributes.lastIntent == 'PlaySecretMemory') {
            this.emitWithState('PlaySecretMemory');
        } else if (this.attributes.lastIntent == 'AMAZON.HelpIntent') {
            this.emitWithState(this.attributes.lastLastIntent);
        } else if (this.attributes.lastIntent == 'LaunchRequest') {
            this.emitWithState('PlayCleanMemory');
        } else {
            this.emitWithState('PlayCleanMemory');
        }
    },

    'Repeat' : function () {
        if (this.attributes.lastIntent == 'PlayCleanMemory') {
            this.attributes.currentCleanIndex--;
            this.emitWithState('PlayCleanMemory');
        } else if (this.attributes.lastIntent == 'PlaySecretMemory') {
            this.attributes.currentSecretIndex--;
            this.emitWithState('PlaySecretMemory');
        } else if (this.attributes.lastIntent == 'AMAZON.HelpIntent') {
            this.emitWithState('AMAZON.HelpIntent');
        } else if (this.attributes.lastIntent == 'LaunchRequest') {
            this.emitWithState('LaunchRequest');
        } else {
            let speechOutput = "I'm sorry, I don't have anything to repeat yet. Would you like for me to play a memory?"
            this.response.speak(speechOutput).listen(speechOutput);
            this.emit(':responseReady');
        }
    },

    'Rewind' : function () {
        if (this.attributes.lastIntent == 'PlayCleanMemory' ||
                this.attributes.lastIntent == 'AMAZON.HelpIntent' &&
                this.attributes.lastLastIntent == 'PlayCleanMemory') {
            let slotObj = this.event.request.intent.slots;
            if (this.event.request.dialogState !== "COMPLETED") {
                this.emit(':delegate');
            } else if (!slotObj.numMemories.value || slotObj.numMemories.value < 0) {
                let speechOutput = "Please provide a valid number of memories by which you would like to rewind.";
                let slotToElicit = "numMemories";
                this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
            } else if (!canRewindThatFar(this.attributes, slotObj.numMemories.value)) {
                console.log('Cannot rewind that far');
                this.attributes.currentCleanIndex = 0;
                this.emitWithState('PlayCleanMemory');
            } else {
                console.log('Attempting to rewind');
                let numMemories = parseInt(slotObj.numMemories.value);
                this.attributes.currentCleanIndex -= numMemories + 1;
                this.emitWithState('PlayCleanMemory');
            }
        } else if (this.attributes.lastIntent == 'PlaySecretMemory' ||
                this.attributes.lastIntent == 'AMAZON.HelpIntent' &&
                this.attributes.lastLastIntent == 'PlaySecretMemory') {
            let slotObj = this.event.request.intent.slots;
            if (!slotObj.numMemories.value) {
                let speechOutput = "By how many secret memories would you like to rewind?";
                let slotToElicit = "numMemories";
                this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
            } else if (slotObj.numMemories.value < 0) {
                let speechOutput = "Please provide a valid number of secret memories by which you would like to rewind.";
                let slotToElicit = "numMemories";
                this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
            } else if (!canRewindThatFar(this.attributes, slotObj.numMemories.value)) {
                console.log('Cannot rewind that far');
                this.attributes.currentSecretIndex = 0;
                this.emitWithState('PlaySecretMemory');
            } else {
                console.log('Attempting to rewind');
                let numMemories = parseInt(slotObj.numMemories.value);
                this.attributes.currentSecretIndex -= numMemories + 1;
                this.emitWithState('PlaySecretMemory');
            }
        } else {
            this.emitWithState('Unhandled');
        }
    },

    'FastForward' : function () {
         if (this.attributes.lastIntent == 'PlayCleanMemory' ||
                this.attributes.lastIntent == 'AMAZON.HelpIntent' &&
                this.attributes.lastLastIntent == 'PlayCleanMemory') {
            let slotObj = this.event.request.intent.slots;
            if (this.event.request.dialogState !== "COMPLETED") {
                this.emit(':delegate');
            } else if (!slotObj.numMemories.value || slotObj.numMemories.value < 0) {
                let speechOutput = "Please provide a valid number of memories by which you would like to fast forward.";
                let slotToElicit = "numMemories";
                this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
            } else if (!canFastForwardThatFar(this.attributes, slotObj.numMemories.value)) {
                console.log('Cannot fast forward that far');
                this.attributes.currentCleanIndex = this.attributes.allMemories.cleanMemories.length - 1;
                this.emitWithState('PlayCleanMemory');
            } else {
                console.log('Attempting to fast forward');
                let numMemories = parseInt(slotObj.numMemories.value);
                this.attributes.currentCleanIndex += numMemories - 1;
                this.emitWithState('PlayCleanMemory');
            }
        } else if (this.attributes.lastIntent == 'PlaySecretMemory' ||
                this.attributes.lastIntent == 'AMAZON.HelpIntent' &&
                this.attributes.lastLastIntent == 'PlaySecretMemory') {
            let slotObj = this.event.request.intent.slots;
            if (!slotObj.numMemories.value) {
                let speechOutput = "By how many secret memories would you like to fast forward?";
                let slotToElicit = "numMemories";
                this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
            } else if (slotObj.numMemories.value < 0) {
                let speechOutput = "Please provide a valid number of secret memories by which you would like to fast forward.";
                let slotToElicit = "numMemories";
                this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
            } else if (!canFastForwardThatFar(this.attributes, slotObj.numMemories.value)) {
                console.log('Cannot fast forward that far');
                this.attributes.currentSecretIndex = this.attributes.allMemories.secretMemories.length - 1;
                this.emitWithState('PlaySecretMemory');
            } else {
                console.log('Attempting to fast forward');
                let numMemories = parseInt(slotObj.numMemories.value);
                this.attributes.currentSecretIndex += numMemories - 1;
                this.emitWithState('PlaySecretMemory');
            }
        } else {
             this.emitWithState('Unhandled');
        }
    }
};

    