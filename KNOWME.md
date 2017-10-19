Which port I use :
```
lsof -i | grep <myservice>
```

Dump ma base de donnée :
```
mongodump --db beealive
```

Restore ma base de donnée :
```
mongorestore --db beealive dump/beealive
```
