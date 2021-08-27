# social-app

## What is this?
This is a webapp i built for myself, featuring live chat, a kanban board and The Oracle. Built with vue3, tailwindcss and firebase.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Building and Deploying
```
npm run build && npx serve dist

npm run build && firebase emulators:start
```

### Kill all firebase emulators to free up ports in case of incomplete shutdown
```
lsof -ti :8081 -ti :5000 -ti :4000 -ti :5001 -ti :9099 -ti :8080 | xargs --no-run-if-empty kill 
```
