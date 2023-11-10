import axios from "axios";
import cryptoJs from "crypto-js";

const DEPOSIT_INTENT = "deposit/intent";

const TRANSACTION_METHOD = {
  LOCAL_BANK_TRANSFER: "local_bank_transfer",
  E_WALLET: "e_wallet",
  CREDIT_DEBIT_CARD: "credit_debit_card",
};

const SOLUTION = {
  JPAY: "jpay",
  GCASH: "gcash",
  DIXONPAY: "dixonpay",
};

const CURRENCY = {
  EUR: "EUR",
  GBP: "GBP",
  HKD: "HKD",
  IDR: "IDR",
  JPY: "JPY",
  MYR: "MYR",
  PHP: "PHP",
  THB: "THB",
  USD: "USD",
  VND: "VND",
  KRW: "KRW",
  INR: "INR",
};

interface IPayload {
  customer: {
    addressLine1: string;
    city: string;
    country: string;
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
    state: string;
    zip: string;
  };
  details: {
    amount: number;
    redirectUrl: string;
    referenceNo: string;
    currency: string;
  };
  publicKey: string;
  secretKey: string;
}

interface IRequestObj {
  env: string;
  publicKey: string;
  secretKey: string;
  referenceNo: string;
}

const request = (requestObj: IRequestObj) => {
  let _env;

  switch (requestObj.env) {
    case "develop":
      _env = "https://api-develop.paystage.net";
      break;
    case "staging":
      _env = "https://api-staging.paystage.net";
      break;
    case "production":
      _env = "https://prod-api-integrate.paystage.net";
      break;
    default:
      _env = "localhost";
      break;
  }

  const publicKey = requestObj.publicKey;
  const secretKey = requestObj.secretKey;

  const algo = cryptoJs.HmacSHA256(publicKey + requestObj.referenceNo, secretKey);

  const digest = algo.toString(cryptoJs.enc.Hex);

  return axios.create({
    baseURL: _env,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
      "X-GATEWAY-KEY": publicKey,
      "X-GATEWAY-SECRET": digest,
    },
  });
};

export class Jpay {
  constructor(env: string) {
    this.env = env;
  }

  private readonly env: string;

  public depositIntent(payload: IPayload) {
    return request({
      env: this.env,
      publicKey: payload.publicKey,
      secretKey: payload.secretKey,
      referenceNo: payload.details.referenceNo,
    }).post(DEPOSIT_INTENT, {
      customer: {
        address_line_1: payload.customer.addressLine1,
        city: payload.customer.city,
        country: payload.customer.country,
        email: payload.customer.email,
        first_name: payload.customer.firstName,
        last_name: payload.customer.lastName,
        mobile: payload.customer.mobile,
        state: payload.customer.state,
        zip: payload.customer.zip,
      },
      details: {
        reference_no: payload.details.referenceNo,
        redirect_url: payload.details.redirectUrl,
        amount: payload.details.amount,
        method: TRANSACTION_METHOD.LOCAL_BANK_TRANSFER,
        currency: payload.details.currency,
        receiving_currency: CURRENCY.JPY,
      },
    });
  }
}

export class Gcash {
  constructor(env: string) {
    this.env = env;
  }

  private readonly env: string;

  public depositIntent(payload: IPayload) {
    return request({
      env: this.env,
      publicKey: payload.publicKey,
      secretKey: payload.secretKey,
      referenceNo: payload.details.referenceNo,
    }).post(DEPOSIT_INTENT, {
      customer: {
        address_line_1: payload.customer.addressLine1,
        city: payload.customer.city,
        country: payload.customer.country,
        email: payload.customer.email,
        first_name: payload.customer.firstName,
        last_name: payload.customer.lastName,
        mobile: payload.customer.mobile,
        state: payload.customer.state,
        zip: payload.customer.zip,
      },
      details: {
        reference_no: payload.details.referenceNo,
        redirect_url: payload.details.redirectUrl,
        amount: payload.details.amount,
        solution: SOLUTION.GCASH,
        method: TRANSACTION_METHOD.E_WALLET,
        currency: payload.details.currency,
      },
    });
  }
}

export class Dixonpay {
  constructor(env: string) {
    this.env = env;
  }

  private readonly env: string;

  public depositIntent(payload: IPayload) {
    return request({
      env: this.env,
      publicKey: payload.publicKey,
      secretKey: payload.secretKey,
      referenceNo: payload.details.referenceNo,
    }).post(DEPOSIT_INTENT, {
      customer: {
        address_line_1: payload.customer.addressLine1,
        city: payload.customer.city,
        country: payload.customer.country,
        email: payload.customer.email,
        first_name: payload.customer.firstName,
        last_name: payload.customer.lastName,
        mobile: payload.customer.mobile,
        state: payload.customer.state,
        zip: payload.customer.zip,
      },
      details: {
        reference_no: payload.details.referenceNo,
        redirect_url: payload.details.redirectUrl,
        amount: payload.details.amount,
        currency: payload.details.currency,
        method: TRANSACTION_METHOD.CREDIT_DEBIT_CARD,
      },
    });
  }
}
