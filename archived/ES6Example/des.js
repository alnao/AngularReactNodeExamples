/*
function creaReport({veicoli = 1,auto=['Panda'] }={}){
    const testoVeicolo= veicoli == 1 ? 'veicolo' : 'veicoli';
    return `Presenti ${veicoli} ${testoVeicolo} : ${auto.join(' e ')}`;
}
console.log( creaReport({}) );//ritorna tutti i default Hai 1 veicolo Panda
console.log( creaReport({veicoli:2}) );//hai 2 ma mostra solo un panda
console.log( creaReport({veicoli:2,auto:['206','Seat']}) );
console.log( creaReport({auto:['206','Seat']}) );
console.log( creaReport() );
*/

/*
function creaMatrice([righe=4,colonne=5] = []){
    return `Crea matrice ${righe} x ${colonne}`;
}
console.log( creaMatrice([]) );//senza parametri usa 4 e 5
console.log( creaMatrice([2]) );//con un solo parametro usa solo righe
console.log( creaMatrice([2,3]) );//entrambi ok
console.log( creaMatrice([,3]) );//solo colonne, righe a 4
console.log( creaMatrice() );//aggiunto = [] per default senza parametri
*/
/*
function Prefisso(prefisso){
    this.prefisso = prefisso;
}
Prefisso.prototype.prefissoArray= function (arr){
    return arr.map( x => this.prefisso + x ); //this funzia
}
const pre = new Prefisso("Ciao ");
const nomi=["Alberto", "Andrea", "Pietro"];
console.log( pre.prefissoArray (nomi) ); 
*/

/*
const hello0Param = () => `Hello to everyone`; 
console.log ( hello0Param() );
const hello1Param = nome => `Hello ${nome}`;
console.log ( hello1Param("Alberto") );
const hello2Param = (nome,cognome) => `Hello ${nome} ${cognome}`;
console.log ( hello2Param("Alberto","Nao") );
*/
/*
// da un array di nomi , ritornare gli stessi in maiuscolo
const nomi=["Alberto Nao", "Andrea", "Pietro"];
const nomiMaiuscoloOld=nomi.map( function(val){return val.toUpperCase()} );
console.log(nomiMaiuscoloOld);
const nomiMaiuscoloNew=nomi.map( val => val.toUpperCase() );
console.log(nomiMaiuscoloNew);
*/
/*
//map tutti modificati
const numeri=[1,4,7,11,12,42];
const numeriPerDue=numeri.map(x => x *2 ); //funzione per ogni elemento
console.log(numeriPerDue);
//filter solo i pari
const numeriPari=numeri.filter (x => x%2==0 );
console.log(numeriPari);
//filter con funzione dispari
function isDispari(valore){return (valore%2 != 0); }
const numeroDispari=numeri.filter ( isDispari );
console.log(numeroDispari);
//map e filter assimeme
const numeriDispariRaddoppiati=numeri.filter(isDispari).map(x=>x*2);
console.log(numeriDispariRaddoppiati);
*/
/*
const mix=[42,528,"Alberto","Valentina","Angela"];
const [var1,var2, ...nomi]=mix; //cioè due variabili e il resto sul nomi
console.log(var1);
console.log(var2);
console.log(nomi);
//altro esempio, funzione con numero 
function somma(...numeri){
    let total=0;
    for (const numero of numeri){
        total+=+numero;
    }
    return total;
}
console.log(somma(5,6));
console.log(somma(5,6,42));
console.log(somma(5,6,42,528));
*/

/*
const nomi=["Alberto Nao", "Andrea", "Pietro"];
console.log(nomi);//vecchio modo
console.log(...nomi);//nuovo modo
const paesi=["Padova","Venezia"];
const nomipaesi=nomi.concat(paesi); //vecchio modo concat
console.log(nomipaesi);
const nomipaesinew=[...nomi,...paesi]; //nuovo modo con ... 
console.log(nomipaesinew);
*/
/*
const numeri=[1,4,7,11,12];
for (const numero of numeri){
    console.log(numero);
}*/




/*
const autoOld={tipo:tipo,colore:colore, posti:posti
    ,duplicaPosti: function(){//vecchio modo
        return posti*2; //vecchio modo
    }
    ,duplicaPOstiNew(){return  posti*2; } //new senza funcion
}//vecchio modo
*/

/*
let tipo='postiva';
let colore='rosso';
let posti=4;
const autoOld={tipo:tipo,colore:colore, posti:posti}//vecchio modo
console.log(autoOld);
const autoNew={tipo,colore, posti}//nuovo
console.log(autoNew);
*/
/*
//vecchio modo
    const punto=[5,42,74];
    const x=punto[0];
    const y=punto[1];
    const z=punto[2];
    console.log(x,y,z);
    const auto={tipo:'sportiva',colore:'rosso', posti:4}
    const tipoOld=auto.tipo;
    console.log(tipoOld);
//nuovo modo
    const [xNew,yNew,zNew] = punto;
    console.log(xNew,zNew);
    const {tipo,posti} = auto;
    console.log(tipo + posti);
*/
