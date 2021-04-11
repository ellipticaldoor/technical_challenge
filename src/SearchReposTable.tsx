import { useState, useEffect, useCallback, useRef } from "react";
import { Card, Button, Table, Divider, Input } from "antd";
import { client } from "./client";
import { SearchReposQuery, SearchReposQueryResponse } from "./queries";
// import { searchReposQueryMock } from "./mocks";

type SearchDataSource = {
  id: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
};

const mapSearchResponseToDataSource = ({
  data,
}: SearchReposQueryResponse): SearchDataSource[] => {
  return data.search.edges.map(
    ({ node: { name, url, stargazerCount, forkCount } }, index) => ({
      id: `${index}-${name}`,
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
    render: (text, record) => (
      <a href={record.url} target="_blank" role="link">
        {text}
      </a>
    ),
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

export const SearchReposTable = () => {
  const [searchParam, setSearchParam] = useState("react");
  const cursor = useRef<string>();
  const [tableDataSource, setTableDataSource] = useState<SearchDataSource[]>(
    [],
  );

  const fetchNextPage = useCallback(
    async (useCursor?: boolean) => {
      // setTableDataSource(mapSearchResponseToDataSource(searchReposQueryMock));
      const response = await client.request<SearchReposQueryResponse>(
        SearchReposQuery,
        {
          variables: {
            searchParam,
            first: REPOS_PER_PAGE,
            after: useCursor ? cursor.current : undefined,
          },
        },
      );

      setTableDataSource((prev) => [
        ...prev,
        ...mapSearchResponseToDataSource(response),
      ]);
      const lastNodeIndex = response.data.search.edges.length - 1;
      const nextCursor = response.data.search.edges[lastNodeIndex].cursor;
      cursor.current = nextCursor;
    },
    [searchParam],
  );

  useEffect(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return (
    <Card>
      <Input
        placeholder="Search"
        value={searchParam}
        onChange={(event) => {
          setSearchParam(event.target.value);
        }}
      />
      <Divider />
      <Button onClick={() => fetchNextPage(true)}>Get next page</Button>
      <Divider />
      <Table
        dataSource={tableDataSource}
        columns={searchTableColumns}
        rowKey="id"
      />
    </Card>
  );
};
