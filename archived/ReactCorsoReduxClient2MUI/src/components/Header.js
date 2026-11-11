import React,{Component} from 'react';
import AppBar from '@material-ui/core/AppBar';  
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle } from "@material-ui/icons";
import { Link } from 'react-router-dom'

class Header extends Component{
    render(){
        return (
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Lista
              </Typography>
              
              <Link to="/create" >
                <IconButton color="inherit"><AccountCircle /></IconButton >
              </Link>
            </Toolbar>
          </AppBar>
        );
    }
}
export default Header;