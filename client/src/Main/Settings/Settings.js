import React, { Component } from 'react';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { saveSettings } from './SettingsActions';
import TaskEditor from '../TaskEditor/TaskEditor';
import { filterEmptyTasks } from '../../Utils/TaskUtils';
import './Settings.css';

class Settings extends Component {
  constructor(props){
    super(props);
    this.handleTasksChange = this.handleTasksChange.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.copyToken = this.copyToken.bind(this);
    this.state = {
      beginTasks: this.props.settings.beginTasks ? this.props.settings.beginTasks : [] ,
      endTasks: this.props.settings.endTasks ? this.props.settings.endTasks : [],
    };
  }
  handleTasksChange( taskCategory, tasks ) {
    this.setState({ [taskCategory]: tasks });
  }
  saveSettings() {
    this.props.saveSettings({
      beginTasks: filterEmptyTasks(this.state.beginTasks),
      endTasks: filterEmptyTasks(this.state.endTasks),
    });
  }
  copyToken() {
    copy(localStorage.getItem('jwt_token'));
    alert('Token copied');
  }
  render() {
    return (
      <div className="Settings">
        <Grid container spacing={24}>
          <Grid item xs={1} lg={2}>
          </Grid>
          <Grid item xs={10} lg={8}>
            <h4>Begin tasks</h4>
            <TaskEditor tasks={this.state.beginTasks} updateTasks={(tasks) => this.handleTasksChange('beginTasks', tasks)} />
            <h4>End tasks</h4>
            <TaskEditor tasks={this.state.endTasks} updateTasks={(tasks) => this.handleTasksChange('endTasks', tasks)} />

            <Button raised onClick={this.saveSettings}>
              Sauvegarder
            </Button>
            <h4>Copy CLI token</h4>
            <Button raised onClick={this.copyToken}>
              Copy
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={1} md={2}>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.SettingsReducers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveSettings: (settings) => {
      dispatch(saveSettings(settings));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
