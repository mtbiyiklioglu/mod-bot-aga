# Discord Bot With Node JS

    Github: @mtbiyiklioglu
    İnstagram: mete.biyiklioglu


Requirements:

1. Node JS
2. Discord Bot And Token
3. Discord.js

First write: 

    npm init

Then you should pass or write the description

After you will see the file > package.json

Then write:

    npm install discord.js

The Files > node_modules and package-lock.json, will came


Open index.js

Take your discord bot token and paste here:

    const token = ' Paste Your Token Here ';

Or you can use .env, in .env write this:

    TOKEN=' YOUR TOKEN HERE '
    
And in index.js write this:
    
    const token = process.env.TOKEN

Then go to terminal and write

    node .

You can write your own commands /etc
