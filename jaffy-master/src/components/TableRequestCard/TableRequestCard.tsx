import React, { useEffect, useState } from 'react';
import BlockIcon from '@material-ui/icons/Block';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import Firebase from '../../firebase/firebase';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import MessageIcon from '@material-ui/icons/Message';
import { REQUEST_TYPE } from '../../constants/constants';
import ReceiptIcon from '@material-ui/icons/Receipt';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import { convertRequestTypeToRequestName } from '../../utils/utils';
import { makeStyles } from '@material-ui/core/styles';

interface TableRequestCardProps {
    requestType: string;
    tableNumber: string;
    timestamp: string;
}

const useStyles = makeStyles({
    green: {
        backgroundColor: '#81c784'
    },
    yellow: {
        backgroundColor: '#ffd54f'
    },
    red: {
        backgroundColor: '#e57373'
    },
    invisible: {
        display: 'none'
    }

});

const iconStyle = {
    fontSize: 75,
    position: 'relative',
    top: '15px'
} as React.CSSProperties;

export default function TableRequestCard(props: TableRequestCardProps) {
    const classes = useStyles();
    const [invisibleElement, setInvisibleElement] = useState(0);

    const requestTime = new Date(props.timestamp);
    const elapsedTimeInSeconds = (new Date().getTime() - requestTime.getTime()) / 1000;

    let backgroundClass = classes.green;
    if (elapsedTimeInSeconds > 30) {
        backgroundClass = classes.red;
    } else if (elapsedTimeInSeconds > 10) {
        backgroundClass = classes.yellow;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setInvisibleElement(counter => counter + 1);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card raised={true} className={backgroundClass}>
            <CardContent>
                <h2
                    style={{
                        fontSize: '30px',
                        marginTop: '0px',
                        display: 'inline-block'
                    }}
                >
                    Table {`${props.tableNumber}`}
                </h2>

                <button
                    style={{
                        color: 'black',
                        float: 'right',
                        background: 'transparent',
                        border: '0px',
                        fontSize: '25px',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        Firebase.database()
                            .ref(
                                `requests/${props.tableNumber}-${props.requestType}`
                            )
                            .remove();
                        Firebase.database()
                            .ref(
                                `tables/${props.tableNumber}/states/${props.requestType}`
                            )
                            .update({ state: false });
                    }}
                >
                    <span className={classes.invisible}>{invisibleElement}</span>
                    X
                </button>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {renderButtonIcon(props.requestType)}
                    <h1
                        style={{
                            textAlign: 'center',
                            fontSize: 40,
                            display: 'inline-block',
                            paddingLeft: '5px'
                        }}
                    >
                        {convertRequestTypeToRequestName(props.requestType)}
                    </h1>
                </div>

                <h3
                    style={{
                        fontSize: '25px',
                        textAlign: 'right',
                        marginBottom: '0px'
                    }}
                >
                    {`${requestTime.toLocaleString()}`}
                </h3>
            </CardContent>
        </Card>
    );
}

const renderButtonIcon = (requestType: string) => {
    let icon;
    switch (requestType) {
    case REQUEST_TYPE.MENU:
        icon = <RestaurantMenuIcon style={iconStyle} />;
        break;
    case REQUEST_TYPE.WATER:
        icon = <LocalDrinkIcon style={iconStyle} />;
        break;
    case REQUEST_TYPE.HELP:
        icon = <EmojiPeopleIcon style={iconStyle} />;
        break;
    case REQUEST_TYPE.BILL:
        icon = <ReceiptIcon style={iconStyle} />;
        break;
    case REQUEST_TYPE.CHAT:
        icon = <MessageIcon style={iconStyle} />;
        break;
    case REQUEST_TYPE.DND:
        icon = <BlockIcon style={iconStyle} />;
        break;
    }
    return icon;
};
