import { Language } from "../enums/language.enum";
import { Currency } from "../enums/currency.enum";

export const getCurrencyForLanguage = (language: Language | string) => {
  switch (language) {
    case Language.Russian:
      return `₽`;
    default:
      return "$";
  }
};

export const getTextCurrency = (currency: Currency | string) => {
  switch (currency) {
    case Currency.RUB:
      return `₽`;
    default:
      return "$";
  }
};
