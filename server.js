const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


// middleware to keep track of server logs
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  fs.appendFileSync('server.log', log + '\n');
  console.log(log);
  next();
});

app.use((req, res, next) => {
  if (false) {
    res.render('maintenance.hbs', {
      pageTitle: 'Maintenance page',
    });
  }
  else {
    next();
  }
});

// middleware for static files
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('currentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('uppercase', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'Welcome to this Express App'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page'
  });
});

app.get('/projects', (req, res) => {
  let request = require('request');
  var options = {
    url: 'https://api.github.com/users/vincentsordo/repos/',
    headers: {
      'User-Agent': 'https://api.github.com/users/vincentsordo',
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  function callback(error, response, body) {
      return JSON.parse(body);
  };
  let body = request(options, callback);
  console.log('Body', JSON.stringify(body));
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
    welcomeMessage: 'Welcome to my projects',
    gitProjects: body
  });
});


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
