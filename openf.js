var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

// use res.render to load up an ejs view file

// index page
app.get('/', function (req, res) {
    var botUrl = req.query.botUrl;
    var params = req.query.params;
    console.log(`botUrl: ${botUrl}`);
    console.log(`params: ${params}`);
    if(params) {
        botUrl = botUrl + '?' + params;
    }
    
    if(/^https%3A/.test(botUrl)) {
        botUrl = decodeURIComponent(botUrl);
    }

    res.render('pages/index', {
        botUrl: botUrl
    });
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

// [END gae_flex_node_static_files]
module.exports = app;

