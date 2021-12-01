import Card from '@material-ui/core/Card';
import Firebase from '../../firebase/firebase';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

interface TableDoNotDisturbCardProps {
    classes: any;
    tableNumber: string;
}

interface TableDoNotDisturbCardState {
    doNotDisturb: boolean;
}

const styles = (theme: any) => ({
    root: {
        textAlign: 'center' as 'center',
        padding: '10px',
        '&::last-child': {
            padding: '0px'
        }
    },
    enabled: {
        backgroundColor: '#e57373'
    },
    disabled: {
        backgroundColor: '#81c784'
    }
});

class TableDoNotDisturbCard extends React.Component<TableDoNotDisturbCardProps, TableDoNotDisturbCardState> {
    constructor(props: Readonly<TableDoNotDisturbCardProps>) {
        super(props);
        this.state = {
            doNotDisturb: false
        };
    }

    componentDidMount() {
        const tableRef = Firebase.database().ref(`tables/${this.props.tableNumber}/states/DND`);
        tableRef.on('value', snapshot => {
            if (snapshot.val()) {
                this.setState({ doNotDisturb: snapshot.val().state });
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Card
                raised={true}
                className={`${classes.root} ${this.state.doNotDisturb ? classes.enabled : classes.disabled}`}>
                <h1>{`Table ${this.props.tableNumber}`}</h1>
            </Card>
        );
    }
}

export default withStyles(styles)(TableDoNotDisturbCard);