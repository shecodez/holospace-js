import { SET_MEMBER_SERVERS, SERVER_CREATED, SERVER_FETCHED, SERVER_UPDATED, MEMBERSHIP_CREATED } from "./../actionTypes";

export default function servers(state = [], action = {}) {
  switch (action.type) {
    case SET_MEMBER_SERVERS:
      return action.memberServers;

    case MEMBERSHIP_CREATED:
      return [...state, action.membership.server_id];

    case SERVER_CREATED:
      return [...state, action.server];

    case SERVER_FETCHED: {
      const index = state.findIndex(item => item._id === action.server._id);
      if (index > -1) {
        return state.map(item => {
          if (item._id === action.server._id) return action.server;
          return item;
        });
      }
      return [...state, action.server];
    }

    case SERVER_UPDATED:
      return state.map(item => {
        if (item._id === action.server._id) return action.server;
        return item;
      });

    default:
      return state;
  }
}
