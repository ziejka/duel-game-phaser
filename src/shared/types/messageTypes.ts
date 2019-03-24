export enum MessageTypes {
    INIT_RESPONSE = 'INIT_RESPONSE',
    START_REQUEST = 'START_REQUEST',
    DUEL_REJECT = 'DUEL_OVER',
    DUEL_REQUEST = 'DUEL_REQUEST',
    DUEL_ACCEPTED = 'DUEL_ACCEPTED',
    DUEL_REJECTED = 'DUEL_REJECTED',
    PLAYER_READY = 'PLAYER_READY',
    START_ROUND = 'START_ROUND',
    STOP_COUNTING = 'STOP_COUNTING',
    COUNTING_STOPPED = 'COUNTING_STOPPED',
    AIM_CLICKED = 'AIM_CLICKED',
    ROUND_WON = 'ROUND_WON',
    ROUND_LOST = 'ROUND_LOST',
    DUEL_FINISHED = 'DUEL_FINISHED',
    GET_LIST_OF_PLAYERS = 'GET_LIST_OF_PLAYERS',
    WAITING_PLAYERS_LIST = 'WAITING_PLAYERS_LIST',
    CONNECT_WITH_PLAYER = 'CONNECT_WITH_PLAYER',
    PLAYER_UNAVAILABLE = 'PLAYER_UNAVAILABLE',
    NO_PLAYERS = 'NO_PLAYERS'
}
