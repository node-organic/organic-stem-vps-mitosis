# organic-stem-vps-mitosis-template

A stack upgrade adding mitosis abilities to a stem skeleton 2.1 monorepo based cell

## usage

```
$ cd ./myProject
$ npx node-organic/organic-stem-vps-mitosis-template
```

## details

### monorepo level 

* `$ npx angel vps :vpsName setup` script which provisions remote VPS instance
  * installs [organic-nginx-configurator](https://github.com/node-organic/organic-nginx-configurator) and [organic-systemd-configurator](https://github.com/node-organic/organic-systemd-configurator)
  * setups `node` user with [nvm](https://github.com/creationix/nvm) at `/home/node/.nvm`

### cell level 

* `$ npx angel deploy :version` script which deploys a version (`major`, `minor`, `patch`, `prerelease`, `build` or `current`) accordingly to its cell mitosis dna

* `$ npx angel status report` generates report about cell mitosis(es) accordingly to its dna

* `$ npx angel kill :version` script which kills specific completed mitosis by its version
