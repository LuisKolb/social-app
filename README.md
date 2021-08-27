# social-app-2

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Useful Commands
Test building and deploying
```
npm run build && npx serve dist

npm run build && firebase emulators:start
```

Kill all firebase emulators to free up ports:
```
lsof -ti :8081 -ti :5000 -ti :4000 -ti :5001 -ti :9099 -ti :8080 | xargs --no-run-if-empty kill 
```