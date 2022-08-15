import { setAppStatusAC } from 'app/app-reducer';
import { AppThunk } from 'app/store';
import { handleServerNetworkError } from 'common/utils/error-utils';
import {
  cardsAPI,
  CreateCardParamsType,
  GetCardsParamsType,
  GetCardsResponseType,
} from 'features/cards/cards-api';

const initialState: InitialStateType = {
  cards: [],
  cardsTotalCount: 12,
  maxGrade: 5,
  minGrade: 0,
  page: 1,
  pageCount: 4,
  packUserId: '',
  searchValue: '',
  sortFlag: false,
};

export const cardsReducer = (
  state: InitialStateType = initialState,
  action: CardsActionsType,
): InitialStateType => {
  switch (action.type) {
    case 'cards/SET-SEARCH-VALUE':
    case 'cards/SET-PAGE-NUMBER':
    case 'cards/SET-PAGE-COUNT-NUMBER':
    case 'cards/SET-CARDS':
      return { ...state, ...action.payload };
    case 'cards/SET-SORT-FLAG':
      return {
        ...state,
        sortFlag: !state.sortFlag,
      };
    case 'cards/SET-CARD-GRADE':
      return {
        ...state,
        cards: state.cards.map(card =>
          card._id === action.cardId ? { ...card, grade: action.grade } : card,
        ),
      };
    default:
      return state;
  }
};

// ______________________Actions____________________________
export const setPackCardsAC = (payload: GetCardsResponseType) =>
  ({
    type: 'cards/SET-CARDS',
    payload,
  } as const);
export const setCardsSearchValueAC = (value: string) =>
  ({
    type: 'cards/SET-SEARCH-VALUE',
    payload: {
      searchValue: value,
    },
  } as const);
export const setCardsPageNumberAC = (page: number) =>
  ({
    type: 'cards/SET-PAGE-NUMBER',
    payload: {
      page,
    },
  } as const);
export const setCardsPageCountNumberAC = (pageCount: number) =>
  ({
    type: 'cards/SET-PAGE-COUNT-NUMBER',
    payload: {
      pageCount,
    },
  } as const);
export const setCardsSortFlagAC = () =>
  ({
    type: 'cards/SET-SORT-FLAG',
  } as const);
export const setCardGradeAC = (grade: number, cardId: string) =>
  ({ type: 'cards/SET-CARD-GRADE', grade, cardId } as const);

// ______________________Types_______________________________
export type CardsActionsType =
  | ReturnType<typeof setPackCardsAC>
  | ReturnType<typeof setCardsPageNumberAC>
  | ReturnType<typeof setCardsPageCountNumberAC>
  | ReturnType<typeof setCardsSortFlagAC>
  | ReturnType<typeof setCardGradeAC>
  | ReturnType<typeof setCardsSearchValueAC>;

type InitialStateType = GetCardsResponseType & { searchValue: string; sortFlag: boolean };

// ______________________Thunks_____________________________
export const getPackCardsTC =
  (params: GetCardsParamsType): AppThunk =>
  async dispatch => {
    dispatch(setAppStatusAC('loading'));
    const response = await cardsAPI.getCards(params);
    try {
      dispatch(setPackCardsAC(response.data));
      dispatch(setAppStatusAC('succeeded'));
    } catch (err) {
      handleServerNetworkError((err as Error).message, dispatch);
    } finally {
      dispatch(setAppStatusAC('idle'));
    }
  };
export const createPackCardTC =
  (params: CreateCardParamsType): AppThunk =>
  async dispatch => {
    dispatch(setAppStatusAC('loading'));
    await cardsAPI.createCard(params);
    try {
      dispatch(getPackCardsTC({ cardsPack_id: params.cardsPack_id }));
    } catch (err) {
      handleServerNetworkError((err as Error).message, dispatch);
    } finally {
      dispatch(setAppStatusAC('idle'));
    }
  };
export const deletePackCardTC =
  (packId: string, cardId: string): AppThunk =>
  async dispatch => {
    dispatch(setAppStatusAC('loading'));
    await cardsAPI.deleteCard(cardId);
    try {
      dispatch(getPackCardsTC({ cardsPack_id: packId }));
    } catch (err) {
      handleServerNetworkError((err as Error).message, dispatch);
    } finally {
      dispatch(setAppStatusAC('idle'));
    }
  };
export const updatePackCardTC =
  (packId: string, _id: string, question?: string, answer?: string): AppThunk =>
  async dispatch => {
    dispatch(setAppStatusAC('loading'));
    await cardsAPI.updateCard({ _id, question, answer });
    try {
      dispatch(getPackCardsTC({ cardsPack_id: packId }));
    } catch (err) {
      handleServerNetworkError((err as Error).message, dispatch);
    } finally {
      dispatch(setAppStatusAC('idle'));
    }
  };
export const updateCardGradeTC =
  (grade: number, cardId: string): AppThunk =>
  async dispatch => {
    dispatch(setAppStatusAC('loading'));
    const res = await cardsAPI.updateCardGrade({ grade, card_id: cardId });
    try {
      dispatch(setCardGradeAC(res.data.grade, cardId));
    } catch (err) {
      handleServerNetworkError((err as Error).message, dispatch);
    } finally {
      dispatch(setAppStatusAC('idle'));
    }
  };