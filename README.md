# Description

Simple logger for abstracting logging in browser and node environments.
Uses static functions for easy importing accross multiple classes without multiple instances.
Filtering logs can be done via the LOG_LEVEL environment variable.
Dynamic setting functionality reserved as a possibility in the future.

## Usage

```
const Log = require('log');
Log.debug('Hello World');
Log.info('Hello World');
Log.warn('Hello World');
Log.error('Hello World');
```

## Environment variables

```
//Node
process.env.LOG_LEVEL = 'debug';

//Browser
window.env = {
    LOG_LEVEL: 'debug'
};
```