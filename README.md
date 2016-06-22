# hts

An app used for HIV Testing and Counseling.

Setup
=====

1. Install Node.js (at the time of writing preferably v5.10.1)

2. Install npm for Node.js

3. Create a database connection file in config/ using 
    'cp config/database.json.example config/database.json'
    
4. Update the created file to match your local database settings

5. Copy config/sites.json.example file as well to config/sites.json and update to match the local site settings

6. Go into db/ folder on your terminal

7. Then run './seed.js' to initialise your databases

8. CD one level up back using 'cd ..'

9. Then run the application using 'node app.js'

10. The app.js can also be executed automatically on system restart using 'pm2 start app.js'
