import { gql } from "graphql-request";

export const RepositoriesQuery = gql`
  query searchRepos($searchParam: String, $first: Int, $after: String) {
    search(
      query: $searchParam
      type: REPOSITORY
      first: $first
      after: $after
    ) {
      edges {
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

export type RepoNodeData = {
  name: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
};

export type RepositoriesQueryResponse = {
  data: {
    search: {
      edges: {
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
};
