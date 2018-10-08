<div style="text-align:center;">
    <h1>Sally The SSL Alpaca - A Slack Bot repository was migrated to internal bitbucket to get access please cobtact with Roche DevTools Support</h1>
    <img src="https://travis-ci.org/Roche/ssl-certificate-notifier.svg?branch=master" alt="Build Status">
    <p>
    Sally reminds you, when your SSL certificates in your internal network are expiring.
    </p>
    <img src="https://i.imgur.com/H92Mo0L.jpg" alt="Sally" />
</div>

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

# Table of Contents
- <a href="#under-the-hood">Under The Hood</a>
    - <a href="#web-api">Web API</a>
        - <a href="#api-command">/api/command/*</a>
        - <a href="#api-certificate">/api/certificate/*</a>
- <a href="#installation">Installation</a>
    - <a href="#internal-server">Internal Server</a>
    - <a href="#public-server">Public Server</a>
        - <a href="#configuration">Configuration</a>
        - <a href="#heroku-installation">Heroku Installation</a>
        - <a href="#local-installation">Local Installation</a>
- <a href="#documentation">Documentation</a>
    - <a href="#generate">Generate</a>
    - <a href="#generate">Local Server</a>

<div id="under-the-hood">
    <h1>Under The Hood</h1>
    <img src="https://i.imgur.com/KU483Vv.png" alt="Diagram" width="500" />
    <p>
        The application is split in 2 services; the Web API and the checker-Script.
    </p>
    <h2 id="web-api">Web API</h2>
    <img src="https://i.imgur.com/ekASr5F.png" alt="Web API" width="300" />
    <p>
        The Web API has 2 ways of communicating. 
    </p>
    <h3 id="api-command">/api/command/*</h3>
    <p>is meant for operations between Slack and the database. It will respons with human readable plain text. </p>
    <table width="100%">
        <thead>
            <th>URL</th>
            <th>Arguments</th>
            <th>Description</th>
        </thead>
        <tbody>
            <tr>
                <td>
                    <i style="background-color: #2196F3;">POST</i>
                    <code>/api/command/add</code>
                </td>
                <td>
                    <code>text</code> <i>[string]</i> - The url of the certificate to add
                </td>
                <td>
                    Adds the given certificate URL to the database. 
                </td>
            </tr>
            <tr>
                <td>
                    <i style="background-color: #2196F3;">POST</i>
                    <code>/api/command/remove</code>
                </td>
                <td>
                    <code>text</code> <i>[string]</i> - The url of the certificate to remove
                </td>
                <td>
                    Removes the given certificate URL to the database. 
                </td>
            </tr>
            <tr>
                <td>
                    <i style="background-color: #2196F3;">POST</i>
                    <code>/api/command/list</code></td>
                <td>
                -
                </td>
                <td>
                    Lists all stored certificates and their expiration date, if available.
                </td>
            </tr>
            <tr>
                <td>
                    <i style="background-color: #2196F3;">POST</i>
                    <code>/api/command/help</code></td>
                <td>
                -
                </td>
                <td>
                    Help command when you are stuck. Lists all commands and how to use them. Also displays meta information about this bot.
                </td>
            </tr>
        </tbody>
    </table>
    <h3 id="api-certificate">/api/certificate/*</h3>
    <p>
        is meant for the <i>checker-Script</i> or third party services. It will
        respond with JSON-results
    </p>
    <table width="100%">
        <thead>
            <th>URL</th>
            <th>Arguments</th>
            <th>Description</th>
        </thead>
        <tbody>
            <tr>
                <td>
                    <i style="background-color: #4caf50;">GET</i>
                    <code>/api/certificate</code>
                </td>
                <td>
                -
                </td>
                <td>
                    Returns a list of all stored certificates 
                </td>
            </tr>
            <tr>
                <td>
                    <i style="background-color: #4caf50;">GET</i>
                    <code>/api/certificate/{CERTIFICATE_URL}/ics</code>
                </td>
                <td>
                -
                </td>
                <td>
                    Downloads the ICS file for the certificate expiry date
                </td>
            </tr>
            <tr>
                <td>
                    <i style="background-color: #2196F3;">POST</i>
                    <code>/api/certificate</code>
                </td>
                <td>
                    <div><code>url</code> <i>[string]</i> - The url of the certificate to add</div>
                    <div><code>expires</code> <i>[date]</i> - The date, when the certificate expires</div>
                    <div><code>status</code> <i>[integer]</i> - The status of the certificate. 0 = Not checked yet, 1 = Found expire-date, 2 = Got an error, while checking</div>
                </td>
                <td>
                    Adds the certificate to the database
                </td>
            </tr>
            <tr>
                <td>
                    <i style="background-color: #f44336;">DELETE</i>
                    <code>/api/certificate</code></td>
                <td>
                    <div><code>url</code> <i>[string]</i> - The url of the certificate to remove</div>
                </td>
                <td>
                    Removes the given certificate from the database.
                </td>
            </tr>
        </tbody>
    </table>
</div>


# Installation

In order to run this application properly, you need to install it on 2 servers.

## Configuration

In the file `src/app.config.json.template`, you can find the configuration options for this application.
Note: Some of these options can be overwritten using environment variables.

After you changed your settings run

```bash
mv src/app.config.json.template src/app.config.json
```

## Internal Server

Run the following command
### Install

```bash
sudo ./bin/install-internal-server.sh
```

### Uninstall
```bash
sudo ./bin/uninstall-internal-server.sh
```

## Public Server

### Heroku Installation
You can deploy this application [using GIT to Heroku](https://devcenter.heroku.com/articles/git). 

You also need to add the POSTGRESQL addon

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### Local Installation

1. Install POSTGRESQL

#### Linux
##### Debian
```bash
sudo apt-get install postgresql
```

##### Redhat

```bash
yum install postgresql-server
```

#### Windows

[Download for Windows](https://www.postgresql.org/download/windows/)

2. Add Database
```
sudo su postgres
psql -c "CREATE DATABASE sslcertificatenotifier;"
```
3. Run

```bash
DATABASE_URL=postgresql://@localhost:5432/sslcertificatenotifier ./bin/run-server-prod.sh
``` 

# Documentation

## Generate

Generate the HTML-documentation using:

```bash
npm run docs
```
The documentation is generated in the `./docs`-Folder, which can be visited using
a simple http server.
