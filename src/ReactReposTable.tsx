import { useState, useEffect, useCallback } from "react";
import { Button, Table, Divider, Input } from "antd";
import { client } from "./client";
import { RepositoriesQuery, RepositoriesQueryResponse } from "./queries";
// import { responseDataMock } from "./mocks";

type SearchDataSource = {
  id: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
};

const mapSearchResponseToDataSource = ({
  data,
}: RepositoriesQueryResponse): SearchDataSource[] => {
  return data.search.edges.map(
    ({ node: { name, url, stargazerCount, forkCount } }, index) => ({
      id: index.toString(),
      name,
      url,
      stars: stargazerCount,
      forks: forkCount,
    }),
  );
};

const searchTableColumns = [
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "stars",
    dataIndex: "stars",
    key: "stars",
  },
  {
    title: "forks",
    dataIndex: "forks",
    key: "forks",
  },
];

const REPOS_PER_PAGE = 10;

export const ReactReposTable = () => {
  const [searchParam, setSearchParam] = useState("react");
  const [cursor, setCursor] = useState<string>();
  const [tableDataSource, setTableDataSource] = useState<SearchDataSource[]>(
    [],
  );

  const fetchNextPage = useCallback(() => {
    // setTableDataSource(mapSearchResponseToDataSource(responseDataMock));
    client
      .request(RepositoriesQuery, {
        variables: {
          searchParam,
          first: REPOS_PER_PAGE,
          after: cursor,
        },
      })
      .then((response: RepositoriesQueryResponse) => {
        setTableDataSource((prev) => [
          ...prev,
          ...mapSearchResponseToDataSource(response),
        ]);
        const lastNodeIndex = response.data.search.edges.length - 1;
        const nextCursor = response.data.search.edges[lastNodeIndex].cursor;
        setCursor(nextCursor);
      });
  }, [cursor, searchParam]);

  useEffect(() => {
    fetchNextPage();
  }, [searchParam]);

  return (
    <>
      <Input
        placeholder="Search"
        value={searchParam}
        onChange={(event) => {
          setSearchParam(event.target.value);
        }}
      />
      <Divider />
      <Button onClick={fetchNextPage}>Get next page</Button>
      <Divider />
      <Table
        dataSource={tableDataSource}
        columns={searchTableColumns}
        onRow={(record) => {
          return {
            onClick: () => {
              alert(record.url);
            },
          };
        }}
      />
    </>
  );
};
