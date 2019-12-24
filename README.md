# Puppet show notificator for Budapest Babszinhaz

This is a node.js project to send email notification about new shows at Budapest Babszinhaz.

## Set up
0. You need [node.js](https://nodejs.org/en/) to be installed
1. Run `npm install` to run dependencies
2. Create a `.env` file based on `.env.example` with your data
    * AGE_GROUP and DAYP_GROUP are comma separated values based on the filter on the https://budapestbabszinhaz.hu/jegyek-musor/jegyvasarlas/ webpage 
3. Set up [FireStore](https://googleapis.dev/nodejs/firestore/latest/index.html#quickstart) and create a `gcp-credentials.json`file in the docroot with the service account credentials
4. Create a `shows` collection in FireStore

## Run
Run `npm start`

You might want to run this periodically on a server with some cron job to get regular notifications.
