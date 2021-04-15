import { useState, useEffect, useCallback } from "react";
import { Card, Button, Table, Input } from "antd";
import { GraphQLClient } from "graphql-request";
import { SearchReposQuery, SearchReposQueryResponse } from "./queries";

type SearchDataSource = {
  id: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
};

const mapSearchResponseToDataSource = ({
  search,
}: SearchReposQueryResponse): SearchDataSource[] => {
  if (!search.edges) return [];
  return search.edges.map(
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

type SearchReposTableProps = {
  client: GraphQLClient;
};

export const SearchReposTable: React.FC<SearchReposTableProps> = ({
  client,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("react project");
  const [tableDataSource, setTableDataSource] = useState<SearchDataSource[]>(
    [],
  );
  const [currentCursor, setCurrentCursor] = useState<string>();
  const [previousCursor, setPreviousCursor] = useState<string>();

  const fetchPage = useCallback(
    async (cursor?: string) => {
      if (loading) return;

      if (!searchParam) {
        setTableDataSource([]);
        return;
      }

      setLoading(true);
      const response = await client.request<SearchReposQueryResponse>(
        SearchReposQuery,
        {
          searchParam,
          first: REPOS_PER_PAGE,
          after: cursor,
        },
      );
      setLoading(false);

      setTableDataSource(mapSearchResponseToDataSource(response));

      if (response.search.edges && response.search.edges.length) {
        const lastNodeIndex = response.search.edges.length - 1;
        const nextCursor = response.search.edges[lastNodeIndex].cursor;
        setCurrentCursor(nextCursor);
      }
    },
    [searchParam],
  );

  // Reset the pagination cursor when the search term changes
  useEffect(() => {
    setCurrentCursor(undefined);
    setPreviousCursor(undefined);
  }, [searchParam]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return (
    <Card style={{ border: "none" }}>
      <Input
        placeholder="Search"
        value={searchParam}
        onChange={(event) => {
          setSearchParam(event.target.value);
        }}
      />
      <Button
        disabled={!previousCursor || loading}
        onClick={() => fetchPage(previousCursor)}
        style={{ margin: "15px 15px 15px 0px" }}
      >
        Prev
      </Button>
      <Button
        disabled={!currentCursor || loading}
        onClick={() => {
          setPreviousCursor(currentCursor);
          fetchPage(currentCursor);
        }}
      >
        Next
      </Button>
      <Table
        dataSource={tableDataSource}
        columns={searchTableColumns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </Card>
  );
};
