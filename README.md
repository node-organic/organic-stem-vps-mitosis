# organic-stem-vps-mitosis-template

A stack upgrade adding mitosis abilities to a stem skeleton 2.1 monorepo based cell

## usage

```
$ cd ./myProject
$ npx node-organic/organic-stem-vps-mitosis-template
```

## commands

### monorepo level 

* `$ npx angel vps :vpsName setup` script which provisions remote VPS instance
  * installs root cells:   
    * [organic-nginx-configurator](https://github.com/node-organic/organic-nginx-configurator) 
    * [organic-systemd-configurator](https://github.com/node-organic/organic-systemd-configurator)
    * [organic-flush-legacy-cells](https://github.com/node-organic/organic-flush-legacy-cells/network/alerts)
  * setups `node` user with [nvm](https://github.com/creationix/nvm) at `/home/node/.nvm`

### cell level 

#### via npm

* `$ npm run deploy-{mitosisName}-current`
* `$ npm run deploy-{mitosisName}-major`
* `$ npm run deploy-{mitosisName}-minor`
* `$ npm run deploy-{mitosisName}-patch`
* `$ npm run deploy-{mitosisName}-prerelease`
* `$ npm run apoptosis-{mitosisName}`
* `$ npm run stop-{mitosisName}`
* `$ npm run status-{mitosisName}`
* `$ npm run restart-{mitosisName}`

#### via angel

* `$ npx angel cell mitosis :mitosisName :versionChange` script which deploys a version (`major`, `minor`, `patch`, `prerelease`, `build` or `current`) accordingly to its cell mitosis dna
* `$ npx angel cell status :mitosisName` generates report about cell mitosis(es) accordingly to its dna
* `$ npx angel cell apoptosis :mitosisName` script which kills specific completed mitosis
* `$ npx angel cell stop :mitosisName` 
* `$ npx angel cell restart :mitosisName`
