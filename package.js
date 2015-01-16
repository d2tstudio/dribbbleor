Package.describe({
  summary: "Dribbble OAuth flow",
  version: "1.0.0",
  git: "https://github.com/d2tstudio/dribbbleor"
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Dribbble');

  api.addFiles(
    ['dribbble_configure.html', 'dribbble_configure.js'],
    'client');

  api.addFiles('dribbble_server.js', 'server');
  api.addFiles('dribbble_client.js', 'client');
});
