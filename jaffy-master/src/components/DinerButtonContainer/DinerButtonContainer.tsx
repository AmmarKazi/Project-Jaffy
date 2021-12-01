import './DinerButtonContainer.css';
import DinerButton from '../DinerButton/DinerButton';
import { REQUEST_TYPE } from '../../constants/constants';
import React from 'react';
import { RouteProps } from 'react-router-dom';
import logo from './logo.png';

interface DinerButtonContainerProps extends RouteProps {
    restaurantName: string;
}

const DinerButtonContainer: React.FunctionComponent<DinerButtonContainerProps> = (props: DinerButtonContainerProps) => {

    const queryString: string = props.location?.search!;
    const queryParameters = parseQueryStringToDictionary(queryString);

    const table: string = queryParameters['table'];

    const height = document.documentElement?.clientHeight || window.innerHeight;
    const tenViewHeight = height ? height / 10 : '10vh';
    const thirtyViewHeight = height ? height / (10 / 3) : '30vh';
    const sixtyViewHeight = height ? height / (10 / 6) : '60vh';

    return (
        <div>
            <div className="restaurantName" style={{ height: tenViewHeight }}>
                <img src={logo} alt='logo' style={{ maxHeight: '100%', maxWidth: '100%' }} />
            </div>

            <div id="topLeftButton">
                <DinerButton
                    requestType={REQUEST_TYPE.MENU}
                    isToggle={false}
                    table={table}
                    url='https://www.karamia.ca/pdf/CaraMia.pdf' />
            </div>

            <div id="topRightButton">
                <DinerButton
                    requestType={REQUEST_TYPE.WATER}
                    table={table}
                    isToggle />
            </div>

            <div id="middleLeftButton" style={{ marginTop: thirtyViewHeight }}>
                <DinerButton
                    requestType={REQUEST_TYPE.HELP}
                    table={table}
                    isToggle
                />
            </div>

            <div id="middleRightButton" style={{ marginTop: thirtyViewHeight }}>
                <DinerButton
                    requestType={REQUEST_TYPE.BILL}
                    table={table}
                    isToggle />
            </div>

            <div id="bottomLeftButton" style={{ marginTop: sixtyViewHeight }}>
                <DinerButton
                    requestType={REQUEST_TYPE.CHAT}
                    table={table}
                    isToggle={false} />
            </div>

            <div id="bottomRightButton" style={{ marginTop: sixtyViewHeight }}>
                <DinerButton
                    requestType={REQUEST_TYPE.DND}
                    table={table}
                    isToggle />
            </div>
        </div>
    );
};

function parseQueryStringToDictionary(queryString: string): { [key: string]: string } {
    const dictionary: { [key: string]: string } = {};

    if (queryString.indexOf('?') === 0) {
        queryString = queryString.substr(1);
    }

    const parameters = queryString.split('&');

    for (const p of parameters) {
        const keyValuePair: string[] = p.split('=');
        dictionary[keyValuePair[0]] = keyValuePair[1];
    }

    return dictionary;
}

export default DinerButtonContainer;
