import { AppBar, Button, Grid, IconButton, List, ListItem, ListItemText, Paper, Toolbar, Typography } from "@material-ui/core";
import { Component, Fragment } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Route, Routes } from 'react-router-dom'
  //https://stackoverflow.com/questions/63124161/attempted-import-error-switch-is-not-exported-from-react-router-dom
import { ArrowBack } from "@material-ui/icons";
import { Link } from 'react-router-dom'
import serialializeForm from 'form-serialize'

const style={
  Paper: {padding:10,margin:10}
}
export const muscoli = ['spalle','addominali','gambe'];
export let esercizi = [
  {id:'flessioni', muscoli:'spalle'},
  {id:'pesi', muscoli:'spalle'},
  {id:'piegamenti', muscoli:'addominali'},
  {id:'pushp', muscoli:'addominali'},
  {id:'corsa', muscoli:'gambe'},
];
export const esercizioSelezionato={id:'Benvenuto',muscoli:'seleziona esercizio'}

class App extends Component {
  render(){return (
    <div className="App" ><Routes>
      <Route exact path="/" element={
        <Lista esercizi={this.state.esercizi} 
          onEsecizioSelect={this.onEsecizioSelect} esercizioSelezionato={this.state.esercizioSelezionato} />
      } ></Route>
      <Route path="/create" element = {<Modifica onCreatePlace={this.onCreatePlace}/> } ></Route>
    </Routes></div>
  );}
	state={esercizi,esercizioSelezionato}
	getEserciziPerGruppo = () => {
    //TODO read list with API
		return Object.entries(
    this.state.esercizi.reduce((esercizi,esercizio) => {
			const {muscoli} = esercizio;
			esercizi[muscoli]=esercizi[muscoli] ? [...esercizi[muscoli],esercizio] : [esercizio]
			return esercizi;
		},{}));
	}
  onEsecizioSelect = id => {console.log(id);
    if (id===undefined){return;}
    this.setState( (prevState)=> ({
      esercizioSelezionato: prevState.esercizi.find(ex => ex.id===id)
    }));
  }
  onCreatePlace = (data) => {
    //TODO add data with API
    esercizi.push(data);
    const state={esercizi,data}
    this.setState(state);
  }
}

class Lista extends Component{
  onEsecizioSelect = id => { this.props.onEsecizioSelect(id);}
  render(){return (
    <div className="Lista">
        <Header></Header>
        <Grid container spacing={10} >
          <Grid item xs={5}  >
            <Paper elevation={1} style={style.Paper}>
                {this.props.esercizi.map (({id,muscoli}) =>
                  <Fragment>
                    <Typography variant="h4">{muscoli}</Typography>
                    <List component="nav">
                      {esercizi.map(({id,muscoli}) => (
                        <ListItem button key={id}>
                          <ListItemText onClick={() => this.onEsecizioSelect(id)}>{id}</ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </Fragment>
                )}
            </Paper>
          </Grid>
          <Grid item xs={5} >
            <Paper elevation={1} style={style.Paper}>
              <Typography variant="h5">{this.props.esercizioSelezionato.id}</Typography>
              <Typography variant="subtitle1">{this.props.esercizioSelezionato.muscoli}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Footer muscoli={muscoli}></Footer>
  </div>);}
}

class Modifica extends Component{
  render(){return (
    <div className="Modifica" >
          <AppBar position="static">
            <Toolbar>
              <Link to="/" >
                <IconButton color="inherit"><ArrowBack /></IconButton >
              </Link>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Modifica
              </Typography>
            </Toolbar>
          </AppBar>
        <form className="div-edit-form" onSubmit={(e) => this.onSubmit(e)}>
          TODO grafica
          <input type="text" name="id" placeholder="name" />
          <input type="text" name="muscoli" placeholder="type" />
          <Button type="submit">Save</Button>
        </form>
    </div>
  );}

  onSubmit = (e) => {
    e.preventDefault() ; //per non cambiare url e rimane sempre nella stessa url
    const data=serialializeForm(e.target , {hash:true}); //form --> json
    console.log(data);
    this.props.onCreatePlace(data); // send data to main component 
  }
}

export default App;
