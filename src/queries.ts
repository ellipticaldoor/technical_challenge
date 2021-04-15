import { gql } from "graphql-request";

export const SearchReposQuery = gql`
  query searchRepos($searchParam: String!, $first: Int!, $after: String) {
    search(
      query: $searchParam
      first: $first
      after: $after
      type: REPOSITORY
    ) {
      edges {
        cursor
        node {
          ... on Repository {
            name
            url
            stargazerCount
            forkCount
          }
        }
      }
    }
  }
`;

export type SearchReposQueryResponse = {
  search: {
    edges?: {
      cursor: string;
      node: {
        name: string;
        url: string;
        stargazerCount: number;
        forkCount: number;
      };
    }[];
  };
};
