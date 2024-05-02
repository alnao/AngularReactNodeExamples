# Node Api SqlLite

Piccola applicazione in JS-node-express per l'esecuzione di API Crud su una tabella SqlLite interna al progetto
```
const sqlite3 = require('sqlite3');
const express = require("express");
var app = express();

const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});
const db = new sqlite3.Database('./emp_database.db', (err) => { 
    if (err) {
        console.error("Erro opening database " + err.message);
    }
});
app.get("/employees", (req, res, next) => {
    db.all("SELECT * FROM employees", [], (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json(rows);
      });
});
```

Per avviare il server locale, lanciare il comando 

```
npm install
node restwithnodejssqlite3.js
```

e aprire il browser 

```
http://localhost:8000/employees
``` 



# AlNao.it
Nessun contenuto in questo repository è stato creato con IA o automaticamente, tutto il codice è stato scritto con molta pazienza da Alberto Nao. Se il codice è stato preso da altri siti/progetti è sempre indicata la fonte. Per maggior informazioni visitare il sito [alnao.it](https://www.alnao.it/).


## License
Public projects 
<a href="https://it.wikipedia.org/wiki/GNU_General_Public_License"  valign="middle"><img src="https://img.shields.io/badge/License-GNU-blue" style="height:22px;"  valign="middle"></a> 
*Free Software!*