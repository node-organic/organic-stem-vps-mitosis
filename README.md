# organic-stem-vps-mitosis-template

A stack upgrade adding mitosis abilities to a stem skeleton 2.1 monorepo based cell

## usage

```
$ cd ./myProject
$ npx node-organic/organic-stem-vps-mitosis-template
```

## details

### on monorepo level 

* `angel setup vps :vpsName mitosis` script which provisions remote VPS instance
  * installs [organic-nginx-configurator](https://github.com/node-organic/organic-nginx-configurator) and [organic-systemd-configurator](https://github.com/node-organic/organic-systemd-configurator)
  * setups `node` user with [nvm](https://github.com/creationix/nvm) at `/home/node/.nvm`

### on cell level 

* `angel deploy :version` script which deploys a version (`major`, `minor`, `patch`, `prerelease` or `build`) accordingly to its cell mitosis dna

* `angel start remote mitosis :mitosisName` starts (packages and uploads) a mitosis on a host vps target then completes the mitosis process by notifying `nginx` and `systemd` root cells

* `angel start remote aptosis :mitosisName` starts an aptosis on previously started mitosis on a host vps target by notifying `nginx` and `systemd` root cells.
