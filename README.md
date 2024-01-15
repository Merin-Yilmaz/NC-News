** IMPORTANT **

In order to use this repo and run it locally, you will need to create the necessary environment variables.

** INSTRUCTIONS **

You will need to create 2 files:

.env.test 
& 
.env.development

Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). 
You can refer to .env-example which shows the correct way of writing this.

Once the variables have been created, you will need to double check that these .env files are .gitignored. 
If not, add them to the .gitignored file by writing under node_modules: 
.env.development
.env.test