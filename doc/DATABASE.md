# MongoDB


## Install

Here we install mongoDB

Open terminal and go to home folder
```
cd ~
```

Download mongodb package
```
curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.6.1.tgz
```

Extract it
```
tar -zxvf mongodb-linux-x86_64-3.6.1.tgz
```

Copy extracted file to folder which run mongodb
```
mkdir -p mongodb
cp -R -n mongodb-linux-x86_64-3.6.1/* mongodb
```

Edit your `.bashrc`
```
nano ~/.bashrc
```

And paste in
```
export PATH=~/mongodb/bin:$PATH
```

Then reload your current terminal
```
source ~/.bashrc
```

## Configuration

Here we configure mongoDB

Open terminal and go to home folder
```
cd ~
```

Create folder `mdb`, it will use to store your data
```
mkdir -p mdb
```

Then type this command line to start mongoDB
```
mongod --dbpath ~/mdb/
```

## Others

Dump database :
```
mongodump --db beealive
```

Restore database from dump :
```
mongorestore --db beealive dump/beealive
```
