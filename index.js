require('dotenv').config();
const tmi = require('tmi.js');

const options = {
  options: {
    debug: true,
  },
  connection: {
    cluster: 'aws',
    reconnect:true,
  },
  identity: {
    username:'footmenhaubot',
    password: process.env["OAUTH"]
  },
  channels: ['slothxy'],
};

const client = new tmi.client(options)

client.connect();

client.on('connected', (address, port) => {
  client.action('slothxy', 'Hello, I am connected')
})
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === '!left'){
    const direction = moveLeft();
    client.say(target, `You moved ${direction}`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === '!right'){
    const direction = moveRight();
    client.say(target, `You moved ${direction}`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === '!id') {
      let id = context['user-id'];
      client.say(target, `You're ID is ${id}`);
  } else if (commandName === "!apime") {
      client.api({
          url: `https://api.twitch.tv/kraken/users/${context['user-id']}`,
          headers: {
            "Client-ID": process.env["CLIENT_ID"],
            "Accept": "application/vnd.twitchtv.v5+json",
          }
      }, (err, res, body) => {
          console.log(body);
      });
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

function moveLeft () {
  return 'left!'
}

function moveRight () {
  return 'right!'
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}