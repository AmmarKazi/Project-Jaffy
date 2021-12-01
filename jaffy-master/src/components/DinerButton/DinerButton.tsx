import './DinerButton.css';
import BlockIcon from '@material-ui/icons/Block';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import Firebase from '../../firebase/firebase';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import MessageIcon from '@material-ui/icons/Message';
import { REQUEST_TYPE } from '../../constants/constants';
import React from 'react';
import ReceiptIcon from '@material-ui/icons/Receipt';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import Skeleton from 'react-loading-skeleton';
import { convertRequestTypeToRequestName } from '../../utils/utils';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

interface DinerButtonProps {
    requestType: string;
    isToggle: boolean;
    table: string;
    url?: string;
}

interface DinerButtonState {
    enabled: boolean;
    loading: boolean;
}

class DinerButton extends React.Component<DinerButtonProps, DinerButtonState> {
    constructor(props: Readonly<DinerButtonProps>) {
        super(props);

        this.state = {
            enabled: false,
            loading: true
        };

        this.loadButtonState().then((result) => {
            let buttonState = false;
            if (result) {
                buttonState = result.state;
            }

            this.setState({
                enabled: buttonState,
                loading: false
            });
        });
    }

    private readonly ICON_STYLE = {
        fontSize: 75
    };

    private renderButtonIcon = () => {
        let icon;
        switch (this.props.requestType) {
            case REQUEST_TYPE.MENU:
                icon = <RestaurantMenuIcon style={this.ICON_STYLE} />;
                break;
            case REQUEST_TYPE.WATER:
                icon = <LocalDrinkIcon style={this.ICON_STYLE} />;
                break;
            case REQUEST_TYPE.HELP:
                icon = <EmojiPeopleIcon style={this.ICON_STYLE} />;
                break;
            case REQUEST_TYPE.BILL:
                icon = <ReceiptIcon style={this.ICON_STYLE} />;
                break;
            case REQUEST_TYPE.CHAT:
                icon = <HelpOutlineIcon style={this.ICON_STYLE} />;
                break;
            case REQUEST_TYPE.DND:
                icon = <BlockIcon style={this.ICON_STYLE} />;
                break;
        }
        return icon;
    };

    private async loadButtonState(): Promise<any> {
        const snapshot = await Firebase.database()
            .ref(`tables/${this.props.table}/states/${this.props.requestType}`)
            .once('value');
        return snapshot.val();
    }

    private handleClick(): void {
        if (this.props.isToggle) {
            this.setState({ enabled: !this.state.enabled }, () => {
                this.writeData();
                if (this.props.requestType !== 'DND') {
                    this.handleQueueUpdate();
                }
            });
        }
    }

    private writeData(): void {
        Firebase.database()
            .ref(`tables/${this.props.table}/states/${this.props.requestType}`)
            .set({
                state: this.state.enabled
            });
    }

    private handleQueueUpdate(): void {
        const requestID = `${this.props.table}-${this.props.requestType}`;
        const currentDateTime: Date = new Date();

        Firebase.database()
            .ref('requests/')
            .once('value')
            .then((snapshot) => {
                if (snapshot.val()) {
                    if (requestID in snapshot.val()) {
                        Firebase.database()
                            .ref(`requests/${requestID}`)
                            .remove();
                    } else {
                        Firebase.database()
                            .ref(`requests/${requestID}`)
                            .set({
                                requestType: this.props.requestType,
                                tableNumber: this.props.table,
                                timestamp: currentDateTime.toISOString()
                            });
                    }
                } else {
                    Firebase.database()
                        .ref(`requests/${requestID}`)
                        .set({
                            requestType: this.props.requestType,
                            tableNumber: this.props.table,
                            timestamp: currentDateTime.toISOString()
                        });
                }
            });
    }

    private getMenuUrl(): string | undefined {
        if (
            this.props.requestType === 'MENU' &&
            !this.props.isToggle &&
            this.props.url
        ) {
            return this.props.url;
        }
        return undefined;
    }

    componentDidMount() {
        const tableRef = Firebase.database().ref(
            `tables/${this.props.table}/states/${this.props.requestType}`
        );
        tableRef.on('value', (snapshot) => {
            if (snapshot.val()) {
                this.setState({ enabled: snapshot.val().state });
            }
        });
    }

    render(): React.ReactNode {
        const isLoading = this.state.loading;
        const isEnabled = this.state.enabled ? 'enabled' : 'disabled';

        const height =
            document.documentElement?.clientHeight || window.innerHeight;
        const thirtyViewHeight = height ? height / (10 / 3) : '30vh';

        return (
            <a
                className={`dinerButton ${isEnabled}`}
                style={{ height: thirtyViewHeight }}
                onClick={this.handleClick.bind(this)}
                href={this.getMenuUrl()}
                target={'_blank'}
                rel={'noopener noreferrer'}
            >
                <div>
                    <span className="dinerButtonIcon">
                        {isLoading ? (
                            <Skeleton height={75} width={75} />
                        ) : (
                                this.renderButtonIcon()
                            )}
                    </span>
                    <p>
                        {isLoading ? (
                            <Skeleton />
                        ) : (
                                convertRequestTypeToRequestName(
                                    this.props.requestType
                                )
                            )}
                    </p>
                </div>
            </a>
        );
    }
}

export default DinerButton;
