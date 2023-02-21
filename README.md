

## References
- https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework


## Project Start Up

```bash
        #no questions install
        npm init -y 
        git init
        git branch -M main
        touch README.md
        #add node_modules/, .DS_Store to the below
        touch .gitignore
        git add .
        git commit -m "hello project"
        # Options for making a remote:
        # https://cli.github.com/manual/gh_repo_create  (brew install gh)
        #gh repo create [<name>] --public
        git remote add origin https://github.com/carlynorama/TestingServer_Node.git  #<- links an existing repo to git
        #git remote -v #checks to see if it worked
        #Potential GOTCHAs - https://docs.github.com/en/authentication/troubleshooting-ssh/error-permission-denied-publickey#make-sure-you-have-a-key-that-is-being-used
        git push -u origin main
```

Hello world:

```bash
        node simple_server.js #^C to exit
```

and then in another terminal window

```bash
        curl --header "Accept: text/event-stream" http://localhost:8000/events #^C to exit
```

For a more elaborate example that shows a client as well as a server and uses `express` `body-parser` and `cors` see: <https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app>