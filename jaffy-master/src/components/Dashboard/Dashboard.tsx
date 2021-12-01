import Firebase from '../../firebase/firebase';
import { Grid } from '@material-ui/core';
import Navbar from '../Navbar/Navbar';
import React from 'react';
import TableDoNotDisturbCard from '../TableDoNotDisturbCard/TableDoNotDisturbCard';
import TableRequestCard from '../TableRequestCard/TableRequestCard';
import { withStyles } from '@material-ui/core/styles';

interface DashboardProps {
    classes: any;
}

interface DashboardState {
    requests: any[];
}

const styles = (theme: any) => ({
    gridContainer: {
        marginTop: '10px',
        paddingLeft: '10px',
        paddingRight: '10px'
    },
    dashboardContainer: {
        width: '100%'
    },
    leftPane: {
        float: 'left' as 'left',
        height: '100vh',
        width: '50%',
        overflow: 'auto'
    },
    rightPane: {
        float: 'right' as 'right',
        width: '50%',
        left: '50%',
        position: 'fixed' as 'fixed'
    }
});

class Dashboard extends React.Component<DashboardProps, DashboardState>{
    constructor(props: Readonly<DashboardProps>) {
        super(props);

        this.state = {
            requests: []
        };

    }

    private loadRequests = async () => {
        Firebase.database().ref('requests').on('value', snapshot => {
            let requests: any[] = [];
            if (snapshot.val()) {
                requests = Object.entries(snapshot.val()).map((e) => ({ [e[0]]: e[1] }));
                requests = requests.sort((a: any, b: any) => {
                    const aKey = Object.keys(a)[0];
                    const bKey = Object.keys(b)[0];
                    return new Date(a[aKey]['timestamp']).getTime() - new Date(b[bKey]['timestamp']).getTime();
                });
            }
            this.setState({
                requests: requests.map((request, i) => {
                    const k = Object.keys(request)[0];

                    return (
                        <Grid item xs={12} key={i}>
                            <TableRequestCard
                                requestType={request[k]['requestType']}
                                tableNumber={request[k]['tableNumber']}
                                timestamp={request[k]['timestamp']}
                            />
                        </Grid>
                    );
                })
            });
        });
    }

    componentDidMount() {
        this.loadRequests();
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Navbar />
                <div className={classes.dashboardContainer}>
                    <div className={classes.leftPane}>
                        <Grid container spacing={2} className={classes.gridContainer}>
                            {this.state.requests}
                        </Grid>
                    </div>
                    <div className={classes.rightPane}>
                        <Grid container spacing={2} className={classes.gridContainer}>
                            <Grid item xs={4}>
                                <TableDoNotDisturbCard tableNumber='1' />
                            </Grid>
                            <Grid item xs={4}>
                                <TableDoNotDisturbCard tableNumber='2' />
                            </Grid>
                            <Grid item xs={4}>
                                <TableDoNotDisturbCard tableNumber='3' />
                            </Grid>
                            <Grid item xs={4}>
                                <TableDoNotDisturbCard tableNumber='4' />
                            </Grid>
                            <Grid item xs={4}>
                                <TableDoNotDisturbCard tableNumber='5' />
                            </Grid>
                            <Grid item xs={4}>
                                <TableDoNotDisturbCard tableNumber='6' />
                            </Grid>
                            <Grid item xs={4}>
                                <TableDoNotDisturbCard tableNumber='7' />
                            </Grid>
                            <Grid item xs={4}>
                                <TableDoNotDisturbCard tableNumber='8' />
                            </Grid>
                            <Grid item xs={4}>
                                <TableDoNotDisturbCard tableNumber='9' />
                            </Grid>
                            <Grid item xs={4}>
                                <TableDoNotDisturbCard tableNumber='10' />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Dashboard);