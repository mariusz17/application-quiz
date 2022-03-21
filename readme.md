# My first Express app

to install on local machine:
git clone https://github.com/mariusz17/application-quiz.git

create package.json:
in terminal navigate to main folder ("application-quiz) and type: npm init -y

Then in package.json need to add _"type" : "module"_
In new type of importing modules (_import express from "express"_ instead of _const express = require("express")_) I had to manually add _"type" : "module"_, because without it there is an error.

Run server with command: _node app.js_
