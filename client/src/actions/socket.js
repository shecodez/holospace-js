import { SOCKET_SET } from "./../actionTypes";

export const socketSet = socket => ({
	type: SOCKET_SET,
	socket
});

export const setSocket = socket => dispatch => {
	dispatch(socketSet(socket));
};

/* 
import io from 'socket.io-client';
import {messageTypes, uri} from '../constants/socket';

const socket = io( uri );

export const init = ( store ) => {
  Object.keys( messageTypes )
    .forEach( type => socket.on( type, ( payload ) => 
       store.dispatch({ type, payload }) 
    )
  );
};

export const emit = ( type, payload ) => socket.emit( type, payload );
*/
