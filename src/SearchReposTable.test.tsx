import { render, fireEvent, waitFor } from "@testing-library/react";
import { GraphQLClient } from "graphql-request";
import { SearchReposTable } from "./SearchReposTable";
import { searchReposQueryMock } from "./mocks";
import { SearchReposQuery } from "./queries";

describe("SearchReposQuery", () => {
  test("it renders a search query by default", async () => {
    const mockRequest = jest.fn().mockResolvedValue(searchReposQueryMock);
    const { findAllByRole } = render(
      <SearchReposTable
        client={({ request: mockRequest } as any) as GraphQLClient}
      />,
    );

    await waitFor(() =>
      expect(mockRequest).toHaveBeenCalledWith(SearchReposQuery, {
        after: undefined,
        first: 10,
        searchParam: "react project",
      }),
    );

    const Rows = await findAllByRole("link");

    expect(Rows.length).toEqual(searchReposQueryMock.search.edges?.length);
  });

  test("it requests the next page when button is clicked", async () => {
    const mockRequest = jest.fn().mockResolvedValue(searchReposQueryMock);
    const { findByText } = render(
      <SearchReposTable
        client={({ request: mockRequest } as any) as GraphQLClient}
      />,
    );

    await waitFor(() => expect(mockRequest).toHaveBeenCalledTimes(1));

    const NextButton = await findByText("Next");

    fireEvent.click(NextButton);

    await waitFor(() =>
      expect(mockRequest).toHaveBeenCalledWith(SearchReposQuery, {
        after: "Y3Vyc29yOjEw",
        first: 10,
        searchParam: "react project",
      }),
    );
  });

  test("it requests a new set of repos when the search input changes", async () => {
    const mockRequest = jest.fn().mockResolvedValue(searchReposQueryMock);
    const { findByPlaceholderText } = render(
      <SearchReposTable
        client={({ request: mockRequest } as any) as GraphQLClient}
      />,
    );

    const SearchInput = await findByPlaceholderText("Search");

    fireEvent.change(SearchInput, {
      target: { value: "css libraries" },
    });

    await waitFor(() =>
      expect(mockRequest).toHaveBeenCalledWith(SearchReposQuery, {
        after: undefined,
        first: 10,
        searchParam: "css libraries",
      }),
    );
  });
});
