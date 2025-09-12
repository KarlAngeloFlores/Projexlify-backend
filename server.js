const clc = require('cli-color');
const app = require('./app');
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
   console.log(clc.bgGreen.black(`Server running on http://localhost:${PORT}`)); 
});