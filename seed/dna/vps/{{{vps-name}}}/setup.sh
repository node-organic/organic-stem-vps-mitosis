# executed via angel cli at monorepo level `$ angel vps {{{vps-name}}} setup`

adduser --disabled-password --gecos "" --home /home/node node
mkdir /home/node/.ssh
chown -R node:node /home/node/.ssh
apt-get update
apt-get -y install git build-essential
git clone https://github.com/creationix/nvm.git /home/node/.nvm
cd /home/node/.nvm
git checkout v0.33.11
chown -R node:node /home/node/.nvm

## installs mongodb 4 ##
# apt-get -y install apt-transport-https
# apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv E52529D4
# echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list
# apt-get update
# apt-get install -y mongodb-org
# service mongod start

## installs systemd onfailure reporting to slack channel ##
# echo "[Unit]
# Description=OnFailure post slack message to channel
#
# [Service]
# Type=oneshot
# ExecStart=/bin/bash -c 'export SLACK_TOKEN="<<SET YOU SLACK TOKEN HERE>>"; . ~/.nvm/nvm.sh; nvm use v8.12.0; npx node-slack-cli -c <<SET YOUR CHANNEL>> -u <<SET BOT USERNAME>> -m "%i failed..."'
# User=node
# Group=node
#
# [Install]
# WantedBy=multi-user.target" > /etc/systemd/system/on-failure-post-slack@.service
# systemctl enable on-failure-post-slack@.service
