const mqtt = require('mqtt');




const brokerUrl = 'mqtt://127.0.0.1:1883';
const options = {
 username: 'test',
 password: 'secret',
};


const client = mqtt.connect(brokerUrl, options);


const MIN_TEMPERATURE = 20;
const MAX_TEMPERATURE = 30;
const MIN_HUMIDITY = 40;
const MAX_HUMIDITY = 60;


function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}


client.on('connect', () => {


      setInterval(() => {
        const temperature = getRandomValue(MIN_TEMPERATURE, MAX_TEMPERATURE);
        const humidity = getRandomValue(MIN_HUMIDITY, MAX_HUMIDITY);
        const data = { temperature, humidity, timestamp: Date.now() };
        client.publish('sensors/temperature-humidity', JSON.stringify(data));
      }, 100);


});


function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}