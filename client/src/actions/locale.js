import { LOCALE_SET } from './../actionTypes';

export const localeSet = lang => ({
  type: LOCALE_SET,
  lang
});

export const setLocale = lang => (dispatch) => {
  localStorage.holospaceLang = lang;
  dispatch(localeSet(lang));
};
