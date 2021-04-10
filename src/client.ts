import { GraphQLClient } from "graphql-request";

// To get this token you need to create a new Oauth github app
// Setup the Oauth server, host this app, login with your user, get the token and use it here
const GITHUB_API_TOKEN = "";
const GITHUB_API_ENDPOINT = "https://api.github.com/graphql";

export const client = new GraphQLClient(GITHUB_API_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${GITHUB_API_TOKEN}`,
  },
});
