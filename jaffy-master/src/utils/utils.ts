import { REQUEST_NAME, REQUEST_TYPE } from "../constants/constants";

export const convertRequestTypeToRequestName = (requestType: string) => {
    let requestName: string = '';
    switch (requestType) {
        case REQUEST_TYPE.MENU:
            requestName = REQUEST_NAME.VIEW_MENU;
            break;
        case REQUEST_TYPE.WATER:
            requestName = REQUEST_NAME.MORE_WATER;
            break;
        case REQUEST_TYPE.HELP:
            requestName = REQUEST_NAME.NEED_SOMETHING;
            break;
        case REQUEST_TYPE.BILL:
            requestName = REQUEST_NAME.REQUEST_BILL;
            break;
        case REQUEST_TYPE.CHAT:
            requestName = REQUEST_NAME.SEND_MESSAGE;
            break;
        case REQUEST_TYPE.DND:
            requestName = REQUEST_NAME.DO_NOT_DISTURB;
            break;
    }
    return requestName;
};