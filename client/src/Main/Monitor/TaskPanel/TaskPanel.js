import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import { FormControlLabel } from 'material-ui/Form';
import { initAlarm, cancelAlarm } from '../../../Utils/AlarmUtils';
import ReverseChrono from '../ReverseChrono/ReverseChrono';
import TaskEditor from '../../TaskEditor/TaskEditor';
import { formatMilliSecondToTime } from '../../../Utils/TimeUtils';
import { filterEmptyTasks } from '../../../Utils/TaskUtils';
import './TaskPanel.css';

const TEXT_AREA_BORDER = '1px solid #CACFD2';

const problemsTextFieldStyle = {
  borderLeft: TEXT_AREA_BORDER,
  borderTop: TEXT_AREA_BORDER,
  borderRight: TEXT_AREA_BORDER,
  borderRadius: '4px 4px 0 0',
  backgroundColor: 'white',
};

class TaskPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      problems: '',
      newTasks: [],
      currentTaskCheckOK: false,
    };
    this.handleNewTasksValueChange = this.handleNewTasksValueChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    if(!this.props.dateLastPause) initAlarm(props.currentTask.estimatedTime - this.props.taskChrono.elapsedTime);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.dateLastPause && !this.props.dateLastPause){
      cancelAlarm();
    } else if (!nextProps.dateLastPause && this.props.dateLastPause){
      initAlarm(this.props.currentTask.estimatedTime - nextProps.taskChrono.elapsedTime);
    }
    if (nextProps.currentTask && nextProps.currentTask !== this.props.currentTask) {
      cancelAlarm();
      initAlarm(nextProps.currentTask.estimatedTime);
      this.setState({
        problems: '',
        newTasks: [],
        currentTaskCheckOK: false,
      });
    }
  }
  componentWillUnmount(){
    cancelAlarm();
  }

  getFormattedTasks(tasks) {
    return tasks ?
      filterEmptyTasks(tasks).map((task) => ({ ...task, addedOnTheFly: true }))
      : undefined;
  }

  handleTaskPanelChange() {
    this.props.handleTaskPanelChange({
      taskPanelChanges : {
        newTasks: this.getFormattedTasks(this.state.newTasks),
        problems: this.state.problems,
        currentTaskCheckOK: this.state.currentTaskCheckOK,
      },
    });
  }
  handleProblemsValueChange(event) {
    this.setState({problems: event.target.value}, this.handleTaskPanelChange);
  }
  handleNewTasksValueChange(tasks) {
    this.setState({newTasks: tasks}, this.handleTaskPanelChange);
  }
  handleCheckChange(event) {
    this.setState({currentTaskCheckOK: event.target.checked}, this.handleTaskPanelChange);
  }
  render() {
    return (
      <Grid className="TaskPanel" container spacing={24}>
        <Grid item xs={1} >
        </Grid>
        <Grid item xs={10}>
          <h2>{this.props.currentTask.label}</h2>
          {
            this.props.currentTask.estimatedTime &&
              <div>
                <h3>Estimated time : {formatMilliSecondToTime(this.props.currentTask.estimatedTime)}</h3>
                <h3>
                  <ReverseChrono
                    dateLastPause={this.props.dateLastPause}
                    estimatedTaskTime={this.props.currentTask.estimatedTime}
                    taskChrono={this.props.taskChrono} />
                </h3>
              </div>
          }
          {
            this.props.currentTask.check && this.props.currentTask.check.length > 0 &&
              <div>
                <h3>Checks :</h3>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.currentTaskCheckOK}
                      onChange={(this.handleCheckChange)}
                      value="check"
                    />
                  }
                  label={this.props.currentTask.check}
                />
              </div>
          }
          <h3>Problems :</h3>
          <TextField
            style={{ ...problemsTextFieldStyle }}
            id="multiline-flexible"
            label="Problems"
            multiline
            rowsMax="4"
            value={this.state.problems}
            onChange={(event) => this.handleProblemsValueChange(event)}
            className="TaskPanel-problem-textarea"
            margin="normal"
          />
          <h3>Add tasks after this one :</h3>
          <TaskEditor tasks={this.state.newTasks} updateTasks={this.handleNewTasksValueChange}/>
        </Grid>
        <Grid item xs={1} >
        </Grid>
      </Grid>
    );
  }
}

export default TaskPanel;
