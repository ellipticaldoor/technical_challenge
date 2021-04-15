import { useMemo, useState } from "react";
import { GraphQLClient } from "graphql-request";
import { Card, Button, Table, Input } from "antd";
import { SearchReposTable } from "./SearchReposTable";

const GITHUB_API_ENDPOINT = "https://api.github.com/graphql";

export const App = () => {
  const [githubToken, setGithubToken] = useState<string>();
  const [textInputState, setTextInputState] = useState<string>();

  const client = useMemo(() => {
    if (!githubToken) return;

    return new GraphQLClient(GITHUB_API_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });
  }, [githubToken]);

  if (!client) {
    return (
      <Card
        style={{
          padding: "20vh 20vw",
          border: "none",
        }}
      >
        <Input
          style={{ marginBottom: 10 }}
          placeholder="Please provide your github token"
          value={textInputState}
          onChange={(event) => {
            setTextInputState(event.target.value);
          }}
        />
        <Button
          disabled={!textInputState}
          onClick={() => {
            setGithubToken(textInputState);
          }}
        >
          Submit
        </Button>
      </Card>
    );
  }

  return <SearchReposTable client={client} />;
};
