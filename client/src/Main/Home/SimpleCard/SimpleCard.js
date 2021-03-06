import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = () => ({
  card: {
    width: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
});

function SimpleCard(props) {
  const { classes } = props;
  const bull = <span className={classes.bullet}>•</span>;
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography type="headline" component="h2">
          #{props.card.idShort}
        </Typography>
        <Typography component="p">
          {bull} {props.card.name}
        </Typography>
      </CardContent>
      <CardActions>
        {
          props.isCurrentTicket
            ? <Button dense onClick={()=> props.handleCardContinueClick(props.card)}>Continue</Button>
            : <Button dense onClick={()=> props.handleCardStartClick(props.card)}>Start</Button>
        }
      </CardActions>
    </Card>
  );
}

Card.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(SimpleCard);
