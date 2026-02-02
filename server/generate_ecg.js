const fs = require('fs');
const stream = fs.createWriteStream('data.csv');
stream.write('time,HeartRate,SpO2,ECG_Value\n');

// Generate 600 lines of dummy data
for (let i = 0; i < 600; i++) {
  const time = (i / 10).toFixed(1);
  const hr = 80 + Math.floor(Math.random() * 20); // Random HR 80-100
  const spo2 = 96 + Math.floor(Math.random() * 4); // Random SpO2 96-100
  const val = Math.sin(i * 0.5).toFixed(3); // Fake sine wave ECG
  stream.write(`${time},${hr},${spo2},${val}\n`);
}
stream.end(() => console.log("data.csv created!"));