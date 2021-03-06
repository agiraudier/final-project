export function reducer(state = {}, action) {
    if (action.type == "GET_WANNABE_FRIENDS") {
        //update the state
        state = {
            ...state,
            users: action.friendsList,
        };
    }
    if (action.type == "ACCEPTED_FRIENDS") {
        state = {
            ...state,
            users: state.users.map((friend) => {
                if (friend.id == action.id) {
                    return {
                        ...friend,
                        accepted: true,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }
    if (action.type == "END_FRIENDS") {
        state = {
            ...state,
            users: state.users.map((friend) => {
                if (friend.id == action.id) {
                    return {
                        ...friend,
                        accepted: false,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }

    if (action.type == "RECENT_MESSAGES") {
        state = {
            ...state,
            messages: action.data,
        };
    }

    if (action.type == "NEW_MESSAGE") {
        state = {
            ...state,
            messages: [...state.messages, action.data],
        };
    }

    return state;
}
