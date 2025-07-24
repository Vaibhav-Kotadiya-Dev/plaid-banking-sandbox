import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
    },
  },
});

const plaidClient = new PlaidApi(config);

export async function createLinkToken() {
  return plaidClient.linkTokenCreate({
    user: { client_user_id: 'user-id-1' },
    client_name: 'Plaid Test App',
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: 'en',
  });
}

export async function exchangePublicToken(public_token: string) {
  return plaidClient.itemPublicTokenExchange({ public_token });
}

export async function getTransactions(access_token: string) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    .toISOString()
    .slice(0, 10);
  const endDate = now.toISOString().slice(0, 10);
  return plaidClient.transactionsGet({
    access_token,
    start_date: startDate,
    end_date: endDate,
    options: { count: 20, offset: 0 },
  });
} 