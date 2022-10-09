import { Paper, Tab, Tabs } from '@material-ui/core';
import React,{Component} from 'react';

class Footer extends Component{
    state = {value:'addominali'};
    hchange = (e,value) => {  this.setState({value:value}); } //no hchange(e,v){...}
    render(){ return (
        <Paper >
            <Tabs value={this.state.value}
            onChange={this.hchange}
            indicatorColor="primary"
            textColor="primary"
            contered="true">
                {this.props.muscoli.map (gruppo =>
                    <Tab key={gruppo} label={gruppo} value={gruppo}/>
                )}
            </Tabs>
        </Paper>
    );}
}
export default Footer;