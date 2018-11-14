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

# uncomment for mongodb 4
# apt-get -y install apt-transport-https
# apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv E52529D4
# echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list
# apt-get update
# apt-get install -y mongodb-org
# service mongod start
